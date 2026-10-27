import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { query } from './db.js';
import {
  USERS, PROGRAMMES, MODULES, ENROLMENTS, ASSESSMENTS,
  GRADES, ATTENDANCE, RISK_CASES, MESSAGES, NOTIFICATIONS,
  APPLICATIONS, EMAIL_QUEUE, ANNOUNCEMENTS, TIMETABLE
} from '../src/data/seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function seedDatabase() {
  console.log('🚀 Initializing & migrating UniSphere Neon PostgreSQL schema...');

  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

  // Split and run each table creation statement
  const statements = schemaSql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const statement of statements) {
    await query(statement);
  }

  // Safe schema migrations for existing database instances
  const migrations = [
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS student_email VARCHAR(255)`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS personal_email VARCHAR(255)`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50)`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS id_number VARCHAR(50)`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth VARCHAR(50)`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS study_mode VARCHAR(50) DEFAULT 'Full-time'`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb`,
    `ALTER TABLE programmes ADD COLUMN IF NOT EXISTS code VARCHAR(20)`,
    `ALTER TABLE programmes ADD COLUMN IF NOT EXISTS full_description TEXT`,
    `ALTER TABLE programmes ADD COLUMN IF NOT EXISTS career_opportunities JSONB DEFAULT '[]'::jsonb`,
    `ALTER TABLE programmes ADD COLUMN IF NOT EXISTS requirements JSONB DEFAULT '{}'::jsonb`,
  ];

  for (const mig of migrations) {
    try {
      await query(mig);
    } catch (e) {
      console.warn('Migration step notice:', e.message);
    }
  }

  console.log('✅ Schema tables & columns verified/migrated.');

  console.log('🌱 Seeding users with secure bcrypt hashes and institutional student emails...');

  // Users
  for (const u of USERS) {
    const hashedPassword = await bcrypt.hash(u.password, 10);
    await query(
      `INSERT INTO users (id, name, email, student_email, personal_email, password, role, avatar, faculty, student_id, programme, year, phone, modules)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         email = EXCLUDED.email,
         student_email = EXCLUDED.student_email,
         personal_email = EXCLUDED.personal_email,
         password = EXCLUDED.password,
         role = EXCLUDED.role,
         avatar = EXCLUDED.avatar,
         faculty = EXCLUDED.faculty,
         student_id = EXCLUDED.student_id,
         programme = EXCLUDED.programme,
         year = EXCLUDED.year,
         phone = EXCLUDED.phone,
         modules = EXCLUDED.modules`,
      [
        u.id,
        u.name,
        u.email,
        u.studentEmail || u.email,
        u.personalEmail || null,
        hashedPassword,
        u.role,
        u.avatar,
        u.faculty || null,
        u.studentId || null,
        u.programme || null,
        u.year || null,
        u.phone || null,
        JSON.stringify(u.modules || [])
      ]
    );
  }

  // Programmes
  console.log(`🌱 Seeding ${PROGRAMMES.length} comprehensive degree programmes...`);
  for (const p of PROGRAMMES) {
    await query(
      `INSERT INTO programmes (id, code, name, faculty, years, credits, nqf, fee, description, full_description, career_opportunities, requirements)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       ON CONFLICT (id) DO UPDATE SET
         code = EXCLUDED.code,
         name = EXCLUDED.name,
         faculty = EXCLUDED.faculty,
         years = EXCLUDED.years,
         credits = EXCLUDED.credits,
         nqf = EXCLUDED.nqf,
         fee = EXCLUDED.fee,
         description = EXCLUDED.description,
         full_description = EXCLUDED.full_description,
         career_opportunities = EXCLUDED.career_opportunities,
         requirements = EXCLUDED.requirements`,
      [
        p.id,
        p.code || null,
        p.name,
        p.faculty,
        p.years,
        p.credits,
        p.nqf,
        p.fee,
        p.description,
        p.fullDescription || p.description,
        JSON.stringify(p.careerOpportunities || []),
        JSON.stringify(p.requirements || {})
      ]
    );
  }

  // Modules
  console.log(`🌱 Seeding ${MODULES.length} academic modules across faculties...`);
  for (const m of MODULES) {
    await query(
      `INSERT INTO modules (id, code, name, credits, semester, year, programme_id, lecturer_id, capacity, enrolled)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (id) DO UPDATE SET
         code = EXCLUDED.code,
         name = EXCLUDED.name,
         credits = EXCLUDED.credits,
         semester = EXCLUDED.semester,
         year = EXCLUDED.year,
         programme_id = EXCLUDED.programme_id,
         lecturer_id = EXCLUDED.lecturer_id,
         capacity = EXCLUDED.capacity,
         enrolled = EXCLUDED.enrolled`,
      [m.id, m.code, m.name, m.credits, m.semester, m.year, m.programme, m.lecturer, m.capacity, m.enrolled]
    );
  }

  // Enrolments
  for (const e of ENROLMENTS) {
    await query(
      `INSERT INTO enrolments (id, student_id, module_id, status)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE SET
         student_id = EXCLUDED.student_id,
         module_id = EXCLUDED.module_id,
         status = EXCLUDED.status`,
      [e.id, e.studentId, e.moduleId, e.status]
    );
  }

  // Assessments
  for (const a of ASSESSMENTS) {
    await query(
      `INSERT INTO assessments (id, module_id, title, type, due_date, total_marks, weight)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET
         module_id = EXCLUDED.module_id,
         title = EXCLUDED.title,
         type = EXCLUDED.type,
         due_date = EXCLUDED.due_date,
         total_marks = EXCLUDED.total_marks,
         weight = EXCLUDED.weight`,
      [a.id, a.moduleId, a.title, a.type, a.dueDate, a.totalMarks, a.weight]
    );
  }

  // Grades
  for (const g of GRADES) {
    await query(
      `INSERT INTO grades (id, assessment_id, student_id, mark, feedback)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE SET
         assessment_id = EXCLUDED.assessment_id,
         student_id = EXCLUDED.student_id,
         mark = EXCLUDED.mark,
         feedback = EXCLUDED.feedback`,
      [g.id, g.assessmentId, g.studentId, g.mark, g.feedback]
    );
  }

  // Attendance
  for (const at of ATTENDANCE) {
    await query(
      `INSERT INTO attendance (id, student_id, module_id, attended, total, percentage)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET
         student_id = EXCLUDED.student_id,
         module_id = EXCLUDED.module_id,
         attended = EXCLUDED.attended,
         total = EXCLUDED.total,
         percentage = EXCLUDED.percentage`,
      [at.id, at.studentId, at.moduleId, at.attended, at.total, at.percentage]
    );
  }

  // Risk Cases
  for (const rc of RISK_CASES) {
    await query(
      `INSERT INTO risk_cases (id, student_id, status, priority, triggers, created_at, assigned_to, interventions, next_follow_up)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO UPDATE SET
         student_id = EXCLUDED.student_id,
         status = EXCLUDED.status,
         priority = EXCLUDED.priority,
         triggers = EXCLUDED.triggers,
         created_at = EXCLUDED.created_at,
         assigned_to = EXCLUDED.assigned_to,
         interventions = EXCLUDED.interventions,
         next_follow_up = EXCLUDED.next_follow_up`,
      [rc.id, rc.studentId, rc.status, rc.priority, JSON.stringify(rc.triggers || []), rc.createdAt, rc.assignedTo, JSON.stringify(rc.interventions || []), rc.nextFollowUp]
    );
  }

  // Messages
  for (const msg of MESSAGES) {
    await query(
      `INSERT INTO messages (id, conversation_id, from_id, to_id, subject, body, timestamp, read)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE SET
         conversation_id = EXCLUDED.conversation_id,
         from_id = EXCLUDED.from_id,
         to_id = EXCLUDED.to_id,
         subject = EXCLUDED.subject,
         body = EXCLUDED.body,
         timestamp = EXCLUDED.timestamp,
         read = EXCLUDED.read`,
      [msg.id, msg.conversationId, msg.fromId, msg.toId, msg.subject, msg.body, msg.timestamp, msg.read]
    );
  }

  // Notifications
  for (const n of NOTIFICATIONS) {
    await query(
      `INSERT INTO notifications (id, user_id, type, title, body, read, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET
         user_id = EXCLUDED.user_id,
         type = EXCLUDED.type,
         title = EXCLUDED.title,
         body = EXCLUDED.body,
         read = EXCLUDED.read,
         timestamp = EXCLUDED.timestamp`,
      [n.id, n.userId, n.type, n.title, n.body, n.read, n.timestamp]
    );
  }

  // Applications
  for (const app of APPLICATIONS) {
    await query(
      `INSERT INTO applications (id, name, email, programme, status, submitted, docs, score)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         email = EXCLUDED.email,
         programme = EXCLUDED.programme,
         status = EXCLUDED.status,
         submitted = EXCLUDED.submitted,
         docs = EXCLUDED.docs,
         score = EXCLUDED.score`,
      [app.id, app.name, app.email, app.programme, app.status, app.submitted, JSON.stringify(app.docs || []), app.score]
    );
  }

  // Email Queue
  for (const eq of EMAIL_QUEUE) {
    await query(
      `INSERT INTO email_queue (id, recipient, subject, status, sent_at, template, error, retries)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE SET
         recipient = EXCLUDED.recipient,
         subject = EXCLUDED.subject,
         status = EXCLUDED.status,
         sent_at = EXCLUDED.sent_at,
         template = EXCLUDED.template,
         error = EXCLUDED.error,
         retries = EXCLUDED.retries`,
      [eq.id, eq.to, eq.subject, eq.status, eq.sentAt, eq.template, eq.error || null, eq.retries || 0]
    );
  }

  // Announcements
  for (const an of ANNOUNCEMENTS) {
    await query(
      `INSERT INTO announcements (id, module_id, title, body, posted_by, date)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET
         module_id = EXCLUDED.module_id,
         title = EXCLUDED.title,
         body = EXCLUDED.body,
         posted_by = EXCLUDED.posted_by,
         date = EXCLUDED.date`,
      [an.id, an.moduleId, an.title, an.body, an.postedBy, an.date]
    );
  }

  // Timetable
  for (const t of TIMETABLE) {
    await query(
      `INSERT INTO timetable (id, module_id, day, time, room, type)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET
         module_id = EXCLUDED.module_id,
         day = EXCLUDED.day,
         time = EXCLUDED.time,
         room = EXCLUDED.room,
         type = EXCLUDED.type`,
      [t.id, t.moduleId, t.day, t.time, t.room, t.type]
    );
  }

  console.log('✅ All initial data seeded successfully into Neon PostgreSQL!');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Seeding failed:', err);
      process.exit(1);
    });
}
