import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { Server as SocketIOServer } from 'socket.io';
import { query, sql } from './db.js';
import { seedDatabase } from './seed.js';
import { generateToken, authenticateToken, requireRole } from './authMiddleware.js';
import { evaluateStudentRisk } from './riskEngine.js';
import { upload } from './upload.js';
import { sendEmail } from './mailer.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Setup Socket.io for Real-time Updates
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  },
});

app.use(cors());
app.use(express.json());

// Serve uploaded documents statically
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Socket.io Connection & Room Handling
io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    if (userId) {
      socket.join(userId);
      console.log(`🔌 User connected to socket room: ${userId}`);
    }
  });

  socket.on('disconnect', () => {
    // disconnected
  });
});

// Health & Status
app.get('/api/health', async (req, res) => {
  try {
    if (!sql) {
      return res.status(200).json({ status: 'no_db_url', message: 'DATABASE_URL is not set.' });
    }
    const [result] = await query('SELECT NOW() as current_time');
    res.json({ status: 'connected', dbTime: result.current_time });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// Seed endpoint
app.post('/api/seed', async (req, res) => {
  try {
    await seedDatabase();
    res.json({ success: true, message: 'Database initialized and seeded successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Authentication with Bcrypt & JWT (Supports institutional email stXXXX@unisphere.com, personal email, or legacy email)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const rows = await query(
      `SELECT * FROM users 
       WHERE LOWER(email) = $1 
          OR LOWER(student_email) = $1 
          OR LOWER(personal_email) = $1`,
      [cleanEmail]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const u = rows[0];
    let isPasswordValid = false;

    // Check if hashed with bcrypt or plain text fallback
    if (u.password.startsWith('$2a$') || u.password.startsWith('$2b$')) {
      isPasswordValid = await bcrypt.compare(password, u.password);
    } else {
      isPasswordValid = (u.password === password);
    }

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const userObj = {
      id: u.id,
      name: u.name,
      email: u.email,
      studentEmail: u.student_email || u.email,
      personalEmail: u.personal_email,
      role: u.role,
      avatar: u.avatar,
      faculty: u.faculty,
      studentId: u.student_id,
      programme: u.programme,
      year: u.year,
      phone: u.phone,
      modules: typeof u.modules === 'string' ? JSON.parse(u.modules) : (u.modules || [])
    };

    const token = generateToken(userObj);
    return res.json({ success: true, token, role: userObj.role, user: userObj });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Full Student Registration Endpoint (supports multipart/form-data document uploads & JSON)
app.post('/api/auth/register', upload.array('documents', 5), async (req, res) => {
  const {
    name,
    email, // Personal email supplied by applicant
    personalEmail,
    password,
    programme,
    year,
    phone,
    idNumber,
    dateOfBirth,
    address,
    studyMode
  } = req.body;

  const effectivePersonalEmail = (personalEmail || email || '').trim().toLowerCase();

  if (!name || !effectivePersonalEmail || !password || !programme) {
    return res.status(400).json({ error: 'Name, personal email, password, and programme are required.' });
  }

  try {
    // Check if personal email is already registered
    const existing = await query(
      `SELECT id FROM users WHERE LOWER(email) = $1 OR LOWER(personal_email) = $1 OR LOWER(student_email) = $1`,
      [effectivePersonalEmail]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'An account with this email address already exists. Please sign in.' });
    }

    // Generate unique 4-digit institutional email: stXXXX@unisphere.com and student ID: ST-XXXX
    let studentNum = '';
    let studentEmail = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 30) {
      const random4 = Math.floor(1000 + Math.random() * 9000); // 1000 to 9999
      const candidateEmail = `st${random4}@unisphere.com`;
      const chk = await query(
        `SELECT id FROM users WHERE LOWER(email) = $1 OR LOWER(student_email) = $1`,
        [candidateEmail]
      );
      if (chk.length === 0) {
        studentNum = String(random4);
        studentEmail = candidateEmail;
        isUnique = true;
      }
      attempts++;
    }

    if (!studentEmail) {
      studentNum = String(Date.now()).slice(-4);
      studentEmail = `st${studentNum}@unisphere.com`;
    }

    const studentId = `ST-${studentNum}`;

    const initials = name
      .split(' ')
      .map(part => part[0])
      .filter(Boolean)
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'ST';

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `u_${studentEmail.replace('@unisphere.com', '')}_${Date.now()}`;

    // Get programme info
    const progRows = await query('SELECT * FROM programmes WHERE name = $1 OR id = $1', [programme]);
    const progName = progRows.length > 0 ? progRows[0].name : programme;
    const progId = progRows.length > 0 ? progRows[0].id : null;
    const faculty = progRows.length > 0 ? progRows[0].faculty : 'General Academic';

    // Find modules to auto-enrol student in
    let moduleIds = [];
    if (progId) {
      const moduleRows = await query('SELECT id FROM modules WHERE programme_id = $1', [progId]);
      moduleIds = moduleRows.map(m => m.id);
    }
    if (moduleIds.length === 0) {
      moduleIds = ['m1', 'm2', 'm4'];
    }

    // Parse uploaded documents
    let uploadedDocs = [];
    if (req.files && Array.isArray(req.files)) {
      uploadedDocs = req.files.map(f => ({
        name: f.originalname,
        filename: f.filename,
        url: `/uploads/${f.filename}`,
        size: f.size,
        type: f.mimetype,
        uploadedAt: new Date().toISOString()
      }));
    }

    // Insert user into PostgreSQL
    await query(
      `INSERT INTO users (
        id, name, email, student_email, personal_email, password, role,
        avatar, faculty, student_id, programme, year, phone, id_number,
        date_of_birth, address, study_mode, documents, modules
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
      [
        userId,
        name,
        studentEmail, // primary login email is official institutional email
        studentEmail,
        effectivePersonalEmail,
        hashedPassword,
        'student',
        initials,
        faculty,
        studentId,
        progName,
        Number(year) || 1,
        phone || null,
        idNumber || null,
        dateOfBirth || null,
        address || null,
        studyMode || 'Full-time',
        JSON.stringify(uploadedDocs),
        JSON.stringify(moduleIds)
      ]
    );

    // Auto-create initial enrolments
    for (const modId of moduleIds) {
      const enrolId = `e_${studentNum}_${modId}`;
      await query(
        `INSERT INTO enrolments (id, student_id, module_id, status)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO NOTHING`,
        [enrolId, userId, modId, 'active']
      );
    }

    // Create welcome notification
    const notifId = `n_${Date.now()}`;
    await query(
      `INSERT INTO notifications (id, user_id, type, title, body, read, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        notifId,
        userId,
        'info',
        'Welcome to UniSphere!',
        `Your student profile has been registered. Student ID: ${studentId}. School Email: ${studentEmail}. You are enrolled in ${moduleIds.length} modules.`,
        false,
        new Date().toISOString()
      ]
    );

    // Send login details to personal email address!
    const emailSubject = `🎓 UniSphere Enrolment Confirmed — Your Official Student Login Details`;
    const emailBody = `Dear ${name},

Congratulations! Your official registration for ${progName} at UniSphere has been successfully processed.

HERE ARE YOUR OFFICIAL ACCESS CREDENTIALS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Institutional Student Email: ${studentEmail}
• Student ID Number:           ${studentId}
• Password:                    ${password}
• Registered Programme:        ${progName}
• Study Mode:                  ${studyMode || 'Full-time'}
• Student Portal Login:        http://localhost:5173
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT NEXT STEPS:
1. Navigate to http://localhost:5173 and sign in using your Institutional Email (${studentEmail}) and your password.
2. You have been automatically enrolled into ${moduleIds.length} modules for your academic curriculum.
3. Access your weekly class timetable, module outlines, and connect with your course lecturers.

Your uploaded documents have been securely archived in your student dossier.

Warm regards,
Office of the Academic Registrar
UniSphere University Ecosystem`;

    sendEmail({
      to: effectivePersonalEmail,
      subject: emailSubject,
      body: emailBody
    }).catch(err => console.warn('Welcome credentials email delivery error:', err));

    // Also queue into system email queue
    await query(
      `INSERT INTO email_queue (id, recipient, subject, status, sent_at, template, error, retries)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        `eq_${Date.now()}`,
        effectivePersonalEmail,
        emailSubject,
        'delivered',
        new Date().toISOString(),
        'student_registration_credentials',
        null,
        0
      ]
    );

    const userObj = {
      id: userId,
      name,
      email: studentEmail,
      studentEmail,
      personalEmail: effectivePersonalEmail,
      role: 'student',
      avatar: initials,
      faculty,
      studentId,
      programme: progName,
      year: Number(year) || 1,
      modules: moduleIds,
      documents: uploadedDocs
    };

    const token = generateToken(userObj);

    // Broadcast new registration to connected staff in real time
    io.emit('new_student_registered', userObj);

    return res.status(201).json({
      success: true,
      token,
      role: 'student',
      user: userObj,
      credentials: {
        studentEmail,
        studentId,
        password,
        personalEmail: effectivePersonalEmail,
        programme: progName,
        enrolledCount: moduleIds.length
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const rows = await query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const u = rows[0];
    res.json({
      id: u.id,
      name: u.name,
      email: u.email,
      studentEmail: u.student_email || u.email,
      personalEmail: u.personal_email,
      role: u.role,
      avatar: u.avatar,
      faculty: u.faculty,
      studentId: u.student_id,
      programme: u.programme,
      year: u.year,
      phone: u.phone,
      modules: typeof u.modules === 'string' ? JSON.parse(u.modules) : (u.modules || []),
      documents: typeof u.documents === 'string' ? JSON.parse(u.documents) : (u.documents || [])
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Users
app.get('/api/users', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM users ORDER BY id ASC');
    const users = rows.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      studentEmail: u.student_email || u.email,
      personalEmail: u.personal_email,
      role: u.role,
      avatar: u.avatar,
      faculty: u.faculty,
      studentId: u.student_id,
      programme: u.programme,
      year: u.year,
      phone: u.phone,
      modules: typeof u.modules === 'string' ? JSON.parse(u.modules) : (u.modules || []),
      documents: typeof u.documents === 'string' ? JSON.parse(u.documents) : (u.documents || [])
    }));
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Programmes with Full Explanations & Requirements
app.get('/api/programmes', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM programmes ORDER BY id ASC');
    res.json(rows.map(p => ({
      ...p,
      fee: Number(p.fee),
      careerOpportunities: typeof p.career_opportunities === 'string' ? JSON.parse(p.career_opportunities) : (p.career_opportunities || []),
      requirements: typeof p.requirements === 'string' ? JSON.parse(p.requirements) : (p.requirements || {})
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Modules
app.get('/api/modules', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM modules ORDER BY id ASC');
    res.json(rows.map(m => ({
      id: m.id,
      code: m.code,
      name: m.name,
      credits: m.credits,
      semester: m.semester,
      year: m.year,
      programme: m.programme_id,
      lecturer: m.lecturer_id,
      capacity: m.capacity,
      enrolled: m.enrolled
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Enrolments
app.get('/api/enrolments', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM enrolments');
    res.json(rows.map(e => ({
      id: e.id,
      studentId: e.student_id,
      moduleId: e.module_id,
      status: e.status
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Assessments
app.get('/api/assessments', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM assessments');
    res.json(rows.map(a => ({
      id: a.id,
      moduleId: a.module_id,
      title: a.title,
      type: a.type,
      dueDate: a.due_date,
      totalMarks: a.total_marks,
      weight: a.weight
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Grades & Automated Early Warning Calculation
app.get('/api/grades', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM grades');
    res.json(rows.map(g => ({
      id: g.id,
      assessmentId: g.assessment_id,
      studentId: g.student_id,
      mark: Number(g.mark),
      feedback: g.feedback
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/grades', async (req, res) => {
  const { assessmentId, studentId, mark, feedback } = req.body;
  try {
    const existing = await query('SELECT id FROM grades WHERE assessment_id = $1 AND student_id = $2', [assessmentId, studentId]);
    const id = existing.length > 0 ? existing[0].id : `g${Date.now()}`;
    
    await query(
      `INSERT INTO grades (id, assessment_id, student_id, mark, feedback)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE SET mark = EXCLUDED.mark, feedback = EXCLUDED.feedback`,
      [id, assessmentId, studentId, mark, feedback]
    );

    const gradeObj = { id, assessmentId, studentId, mark: Number(mark), feedback };

    // Broadcast grade update in real-time
    io.emit('grade_updated', gradeObj);

    // Notify student about posted grade
    const notifId = `n${Date.now()}_grade`;
    const notif = {
      id: notifId,
      userId: studentId,
      type: 'info',
      title: 'Grade Posted',
      body: `A new assessment mark (${mark}%) has been published.`,
      timestamp: new Date().toISOString()
    };
    await query(
      `INSERT INTO notifications (id, user_id, type, title, body, read, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [notif.id, notif.userId, notif.type, notif.title, notif.body, false, notif.timestamp]
    );
    io.to(studentId).emit('new_notification', notif);

    // Trigger Automated Early Warning Engine!
    evaluateStudentRisk(studentId, io).catch(e => console.error('Early Warning engine error:', e));

    res.json(gradeObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Attendance & Risk Re-evaluation
app.get('/api/attendance', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM attendance');
    res.json(rows.map(a => ({
      id: a.id,
      studentId: a.student_id,
      moduleId: a.module_id,
      attended: a.attended,
      total: a.total,
      percentage: Number(a.percentage)
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/attendance', async (req, res) => {
  const { studentId, moduleId, attended, total } = req.body;
  try {
    const percentage = total > 0 ? Number(((attended / total) * 100).toFixed(1)) : 0;
    const existing = await query('SELECT id FROM attendance WHERE student_id = $1 AND module_id = $2', [studentId, moduleId]);
    const id = existing.length > 0 ? existing[0].id : `at${Date.now()}`;

    await query(
      `INSERT INTO attendance (id, student_id, module_id, attended, total, percentage)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET attended = EXCLUDED.attended, total = EXCLUDED.total, percentage = EXCLUDED.percentage`,
      [id, studentId, moduleId, attended, total, percentage]
    );

    const atObj = { id, studentId, moduleId, attended, total, percentage };
    io.emit('attendance_updated', atObj);

    // Evaluate Risk Engine
    evaluateStudentRisk(studentId, io).catch(e => console.error('Early Warning engine error:', e));

    res.json(atObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Risk Cases
app.get('/api/risk-cases', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM risk_cases');
    res.json(rows.map(rc => ({
      id: rc.id,
      studentId: rc.student_id,
      status: rc.status,
      priority: rc.priority,
      triggers: typeof rc.triggers === 'string' ? JSON.parse(rc.triggers) : (rc.triggers || []),
      createdAt: rc.created_at,
      assignedTo: rc.assigned_to,
      interventions: typeof rc.interventions === 'string' ? JSON.parse(rc.interventions) : (rc.interventions || []),
      nextFollowUp: rc.next_follow_up
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/risk-cases/:id/interventions', async (req, res) => {
  const { id } = req.params;
  const { action, by } = req.body;
  try {
    const rows = await query('SELECT interventions FROM risk_cases WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Case not found' });
    
    const existing = typeof rows[0].interventions === 'string' ? JSON.parse(rows[0].interventions) : (rows[0].interventions || []);
    const newIntervention = {
      id: `i${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      action,
      by,
      outcome: 'Pending response'
    };
    const updated = [...existing, newIntervention];

    await query('UPDATE risk_cases SET interventions = $1 WHERE id = $2', [JSON.stringify(updated), id]);
    
    io.emit('intervention_added', { caseId: id, intervention: newIntervention });
    res.json(newIntervention);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Messages (Real-Time WebSockets)
app.get('/api/messages', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM messages ORDER BY timestamp ASC');
    res.json(rows.map(m => ({
      id: m.id,
      conversationId: m.conversation_id,
      fromId: m.from_id,
      toId: m.to_id,
      subject: m.subject,
      body: m.body,
      timestamp: m.timestamp,
      read: m.read
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/messages', async (req, res) => {
  const { fromId, toId, subject, body } = req.body;
  try {
    const id = `msg${Date.now()}`;
    const conversationId = `conv${Date.now()}`;
    const timestamp = new Date().toISOString();

    await query(
      `INSERT INTO messages (id, conversation_id, from_id, to_id, subject, body, timestamp, read)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [id, conversationId, fromId, toId, subject, body, timestamp, false]
    );

    const msgObj = { id, conversationId, fromId, toId, subject, body, timestamp, read: false };

    // Auto-create notification for recipient
    const senderRows = await query('SELECT name FROM users WHERE id = $1', [fromId]);
    const senderName = senderRows.length > 0 ? senderRows[0].name : 'Someone';

    const notifId = `n${Date.now()}`;
    const notifObj = {
      id: notifId,
      userId: toId,
      type: 'info',
      title: `New message from ${senderName}`,
      body: subject,
      read: false,
      timestamp
    };

    await query(
      `INSERT INTO notifications (id, user_id, type, title, body, read, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [notifObj.id, notifObj.userId, notifObj.type, notifObj.title, notifObj.body, false, notifObj.timestamp]
    );

    io.to(toId).emit('new_message', msgObj);
    io.to(fromId).emit('new_message', msgObj);
    io.to(toId).emit('new_notification', notifObj);

    res.json(msgObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Notifications
app.get('/api/notifications', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM notifications ORDER BY timestamp DESC');
    res.json(rows.map(n => ({
      id: n.id,
      userId: n.user_id,
      type: n.type,
      title: n.title,
      body: n.body,
      read: n.read,
      timestamp: n.timestamp
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/notifications/:id/read', async (req, res) => {
  const { id } = req.params;
  try {
    await query('UPDATE notifications SET read = TRUE WHERE id = $1', [id]);
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/notifications/read-all', async (req, res) => {
  const { userId } = req.body;
  try {
    if (userId) {
      await query('UPDATE notifications SET read = TRUE WHERE user_id = $1', [userId]);
    } else {
      await query('UPDATE notifications SET read = TRUE');
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Applications & File Uploads
app.get('/api/applications', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM applications ORDER BY submitted DESC');
    res.json(rows.map(a => ({
      id: a.id,
      name: a.name,
      email: a.email,
      programme: a.programme,
      status: a.status,
      submitted: a.submitted,
      docs: typeof a.docs === 'string' ? JSON.parse(a.docs) : (a.docs || []),
      score: a.score
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/applications/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await query('UPDATE applications SET status = $1 WHERE id = $2', [status, id]);
    
    const appRows = await query('SELECT * FROM applications WHERE id = $1', [id]);
    if (appRows.length > 0) {
      const applicant = appRows[0];
      const statusTitle = status === 'accepted' ? 'Application Accepted!' : (status === 'rejected' ? 'Application Outcome' : 'Application Status Update');
      const emailBody = `Dear ${applicant.name},\n\nYour application status for UniSphere has been updated to: ${status.toUpperCase()}.\n\nPlease log in or contact Admissions for next steps.`;

      sendEmail({
        to: applicant.email,
        subject: `UniSphere: ${statusTitle}`,
        body: emailBody
      }).catch(e => console.warn('Email dispatch warning:', e));
    }

    io.emit('application_status_updated', { id, status });
    res.json({ success: true, id, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload Document Endpoint
app.post('/api/applications/:id/documents', upload.single('file'), async (req, res) => {
  const { id } = req.params;
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    const rows = await query('SELECT docs FROM applications WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    const currentDocs = typeof rows[0].docs === 'string' ? JSON.parse(rows[0].docs) : (rows[0].docs || []);
    const docMeta = {
      name: req.file.originalname,
      filename: req.file.filename,
      url: `/uploads/${req.file.filename}`,
      size: req.file.size,
      uploadedAt: new Date().toISOString()
    };

    const updatedDocs = [...currentDocs, docMeta];
    await query('UPDATE applications SET docs = $1 WHERE id = $2', [JSON.stringify(updatedDocs), id]);

    res.json({ success: true, document: docMeta, docs: updatedDocs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Email Queue
app.get('/api/email-queue', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM email_queue ORDER BY id DESC');
    res.json(rows.map(e => ({
      id: e.id,
      to: e.recipient,
      subject: e.subject,
      status: e.status,
      sentAt: e.sent_at,
      template: e.template,
      error: e.error,
      retries: e.retries
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/email-queue/:id/retry', async (req, res) => {
  const { id } = req.params;
  try {
    const rows = await query('SELECT * FROM email_queue WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Email record not found' });
    const emailRecord = rows[0];

    const mailResult = await sendEmail({
      to: emailRecord.recipient,
      subject: emailRecord.subject,
      body: `Notice from UniSphere System regarding: ${emailRecord.subject}`
    });

    if (mailResult.success) {
      await query("UPDATE email_queue SET status = 'delivered', sent_at = $1, error = NULL WHERE id = $2", [new Date().toISOString(), id]);
    } else {
      await query("UPDATE email_queue SET status = 'failed', error = $1, retries = retries + 1 WHERE id = $2", [mailResult.error, id]);
    }

    io.emit('email_queue_updated', { id, status: mailResult.success ? 'delivered' : 'failed' });
    res.json({ success: true, delivered: mailResult.success, previewUrl: mailResult.previewUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Announcements
app.get('/api/announcements', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM announcements ORDER BY date DESC');
    res.json(rows.map(an => ({
      id: an.id,
      moduleId: an.module_id,
      title: an.title,
      body: an.body,
      postedBy: an.posted_by,
      date: an.date
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/announcements', async (req, res) => {
  const { moduleId, title, body, postedBy } = req.body;
  try {
    const id = `an${Date.now()}`;
    const date = new Date().toISOString().split('T')[0];
    await query(
      `INSERT INTO announcements (id, module_id, title, body, posted_by, date)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, moduleId, title, body, postedBy, date]
    );

    const annObj = { id, moduleId, title, body, postedBy, date };
    io.emit('new_announcement', annObj);
    res.json(annObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Timetable
app.get('/api/timetable', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM timetable');
    res.json(rows.map(t => ({
      id: t.id,
      moduleId: t.module_id,
      day: t.day,
      time: t.time,
      room: t.room,
      type: t.type
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  });
}

// Start Server with WebSockets
server.listen(PORT, () => {
  console.log(`🚀 UniSphere Server with WebSockets & Neon running at http://localhost:${PORT}`);
});
