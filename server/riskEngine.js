import { query } from './db.js';
import { sendEmail } from './mailer.js';

export async function evaluateStudentRisk(studentId, io = null) {
  try {
    // 1. Fetch student info
    const studentRows = await query('SELECT * FROM users WHERE id = $1', [studentId]);
    if (studentRows.length === 0) return null;
    const student = studentRows[0];

    // 2. Fetch all grades for student
    const grades = await query(
      `SELECT g.mark, a.title, a.weight, a.total_marks
       FROM grades g
       JOIN assessments a ON g.assessment_id = a.id
       WHERE g.student_id = $1`,
      [studentId]
    );

    // 3. Fetch attendance
    const attendanceRecords = await query(
      'SELECT attended, total, percentage FROM attendance WHERE student_id = $1',
      [studentId]
    );

    const triggers = [];
    let isHighRisk = false;
    let isMediumRisk = false;

    // Evaluate grades
    if (grades.length > 0) {
      const avgMark = grades.reduce((sum, g) => sum + Number(g.mark), 0) / grades.length;
      const failedCount = grades.filter(g => Number(g.mark) < 50).length;

      if (avgMark < 40) {
        triggers.push(`Critical assessment average: ${avgMark.toFixed(1)}% (Pass mark is 50%)`);
        isHighRisk = true;
      } else if (avgMark < 50) {
        triggers.push(`Low assessment average: ${avgMark.toFixed(1)}% (Below 50% threshold)`);
        isMediumRisk = true;
      }

      if (failedCount >= 2) {
        triggers.push(`${failedCount} failed assessments recorded`);
        isHighRisk = true;
      } else if (failedCount === 1) {
        triggers.push('1 failed assessment recorded');
        isMediumRisk = true;
      }
    }

    // Evaluate attendance
    if (attendanceRecords.length > 0) {
      const avgAttendance = attendanceRecords.reduce((sum, a) => sum + Number(a.percentage), 0) / attendanceRecords.length;
      if (avgAttendance < 60) {
        triggers.push(`Severe attendance deficiency: ${avgAttendance.toFixed(1)}% (Threshold: 75%)`);
        isHighRisk = true;
      } else if (avgAttendance < 75) {
        triggers.push(`Attendance concern: ${avgAttendance.toFixed(1)}% (Threshold: 75%)`);
        isMediumRisk = true;
      }
    }

    // If no triggers, student is healthy
    if (triggers.length === 0) {
      return { status: 'healthy', studentId };
    }

    const priority = isHighRisk ? 'high' : 'medium';
    const status = isHighRisk ? 'high' : 'review';

    // Check if an existing case is already active
    const existingCases = await query('SELECT * FROM risk_cases WHERE student_id = $1', [studentId]);

    let caseId;
    if (existingCases.length > 0) {
      caseId = existingCases[0].id;
      await query(
        `UPDATE risk_cases
         SET status = $1, priority = $2, triggers = $3, next_follow_up = $4
         WHERE id = $5`,
        [status, priority, JSON.stringify(triggers), '2025-05-15', caseId]
      );
    } else {
      caseId = `rc_${Date.now()}`;
      await query(
        `INSERT INTO risk_cases (id, student_id, status, priority, triggers, created_at, assigned_to, interventions, next_follow_up)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          caseId,
          studentId,
          status,
          priority,
          JSON.stringify(triggers),
          new Date().toISOString().split('T')[0],
          'u4', // Officer Zanele Khumalo
          JSON.stringify([]),
          '2025-05-15'
        ]
      );
    }

    // Create notifications
    const notifOfficerId = `n${Date.now()}_off`;
    const notifStudentId = `n${Date.now()}_stu`;
    const nowIso = new Date().toISOString();

    // Officer Notification
    await query(
      `INSERT INTO notifications (id, user_id, type, title, body, read, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        notifOfficerId,
        'u4',
        'danger',
        `Early Warning: ${student.name} flagged (${priority.toUpperCase()})`,
        `Triggers: ${triggers.join('; ')}`,
        false,
        nowIso
      ]
    );

    // Student Notification
    await query(
      `INSERT INTO notifications (id, user_id, type, title, body, read, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        notifStudentId,
        studentId,
        'warning',
        'Academic Advisory Alert',
        'Your academic profile has been flagged for support review. Please schedule a consultation with Student Success.',
        false,
        nowIso
      ]
    );

    // Queue & dispatch email
    const emailId = `eq_${Date.now()}`;
    await query(
      `INSERT INTO email_queue (id, recipient, subject, status, sent_at, template, error, retries)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        emailId,
        student.email,
        'UniSphere: Academic Support Advisory',
        'queued',
        null,
        'at_risk_alert',
        null,
        0
      ]
    );

    // Send email asynchronously
    sendEmail({
      to: student.email,
      subject: 'UniSphere: Academic Support Advisory',
      body: `Dear ${student.name},\n\nOur early warning engine has noted academic indicators that require attention:\n- ${triggers.join('\n- ')}\n\nPlease contact Student Success Officer Zanele Khumalo (success@unisphere.ac.za) to discuss personalized support.\n\nWarm regards,\nUniSphere Student Success Team`
    }).then(async (res) => {
      if (res.success) {
        await query("UPDATE email_queue SET status = 'delivered', sent_at = $1 WHERE id = $2", [new Date().toISOString(), emailId]);
      } else {
        await query("UPDATE email_queue SET status = 'failed', error = $1 WHERE id = $2", [res.error, emailId]);
      }
    });

    // Real-time broadcast if socket is connected
    if (io) {
      io.to('u4').emit('new_notification', {
        id: notifOfficerId,
        userId: 'u4',
        type: 'danger',
        title: `Early Warning: ${student.name} flagged (${priority.toUpperCase()})`,
        body: `Triggers: ${triggers.join('; ')}`,
        timestamp: nowIso
      });
      io.to(studentId).emit('new_notification', {
        id: notifStudentId,
        userId: studentId,
        type: 'warning',
        title: 'Academic Advisory Alert',
        body: 'Your academic profile has been flagged for support review.',
        timestamp: nowIso
      });
      io.emit('risk_case_updated', { caseId, studentId, priority, status, triggers });
    }

    return { caseId, studentId, priority, status, triggers };
  } catch (error) {
    console.error('Error evaluating student risk:', error);
    return null;
  }
}

