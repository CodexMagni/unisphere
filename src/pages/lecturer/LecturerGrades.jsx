import { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { MODULES, ASSESSMENTS, USERS, ENROLMENTS } from '../../data/seed';
import { Plus, Save } from 'lucide-react';

export default function LecturerGrades() {
  const { user } = useAuth();
  const { grades, addGrade, addAnnouncement } = useData();
  const [selectedModule, setSelectedModule] = useState('m1');
  const [selectedAssessment, setSelectedAssessment] = useState('a1');
  const [gradeForm, setGradeForm] = useState({ studentId: '', mark: '', feedback: '' });
  const [showForm, setShowForm] = useState(false);

  const myModules = MODULES.filter(m => m.lecturer === user?.id);
  const moduleAssessments = ASSESSMENTS.filter(a => a.moduleId === selectedModule);
  const moduleStudents = ENROLMENTS.filter(e => e.moduleId === selectedModule).map(e => USERS.find(u => u.id === e.studentId)).filter(Boolean);

  const getGrade = (assessmentId, studentId) => grades.find(g => g.assessmentId === assessmentId && g.studentId === studentId);

  const handleSaveGrade = () => {
    if (!gradeForm.studentId || gradeForm.mark === '') return;
    addGrade(selectedAssessment, gradeForm.studentId, Number(gradeForm.mark), gradeForm.feedback);
    setGradeForm({ studentId: '', mark: '', feedback: '' });
    setShowForm(false);
  };

  const assessment = ASSESSMENTS.find(a => a.id === selectedAssessment);
  const getPercent = (mark) => assessment ? Math.round((mark / assessment.totalMarks) * 100) : 0;

  return (
    <div>
      <PageHeader title="Grades & Marks" subtitle="Record and manage student assessment results" />
      <div className="page-body">
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
            <div className="input-group" style={{ flex: 1, minWidth: 200 }}>
              <label className="input-label">Module</label>
              <select className="input-field" value={selectedModule} onChange={e => { setSelectedModule(e.target.value); setSelectedAssessment(''); }}>
                {myModules.map(m => <option key={m.id} value={m.id}>{m.code} — {m.name}</option>)}
              </select>
            </div>
            <div className="input-group" style={{ flex: 1, minWidth: 200 }}>
              <label className="input-label">Assessment</label>
              <select className="input-field" value={selectedAssessment} onChange={e => setSelectedAssessment(e.target.value)}>
                <option value="">Select assessment</option>
                {moduleAssessments.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                <Plus size={15} /> Add Grade
              </button>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: 20, borderLeft: '4px solid var(--navy)' }}>
            <h4 style={{ marginBottom: 16 }}>Record Grade — {assessment?.title}</h4>
            <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
              <div className="input-group" style={{ minWidth: 200 }}>
                <label className="input-label">Student</label>
                <select className="input-field" value={gradeForm.studentId} onChange={e => setGradeForm(f => ({ ...f, studentId: e.target.value }))}>
                  <option value="">Select student</option>
                  {moduleStudents.map(s => <option key={s.id} value={s.id}>{s.name} ({s.studentId})</option>)}
                </select>
              </div>
              <div className="input-group" style={{ width: 120 }}>
                <label className="input-label">Mark (/{assessment?.totalMarks})</label>
                <input className="input-field" type="number" min="0" max={assessment?.totalMarks}
                  value={gradeForm.mark} onChange={e => setGradeForm(f => ({ ...f, mark: e.target.value }))} />
              </div>
              <div className="input-group" style={{ flex: 1, minWidth: 240 }}>
                <label className="input-label">Feedback</label>
                <input className="input-field" value={gradeForm.feedback}
                  onChange={e => setGradeForm(f => ({ ...f, feedback: e.target.value }))}
                  placeholder="Optional feedback for student" />
              </div>
            </div>
            <div className="flex gap-2" style={{ marginTop: 14 }}>
              <button className="btn btn-primary" onClick={handleSaveGrade}><Save size={14} /> Save Grade</button>
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        <div className="card">
          <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
            <h3>Student Results</h3>
            {assessment && <span className="badge badge-neutral">Weight: {assessment.weight}% of final mark</span>}
          </div>
          <div className="table-wrapper">
            <table>
              <thead><tr>
                <th>Student</th><th>Student ID</th>
                {moduleAssessments.map(a => <th key={a.id}>{a.title.split(':')[0]}</th>)}
              </tr></thead>
              <tbody>
                {moduleStudents.map(student => (
                  <tr key={student.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="avatar" style={{ width: 28, height: 28, background: 'var(--surface-mid)', color: 'var(--text-secondary)', fontSize: 11 }}>{student.avatar}</div>
                        <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: 13 }}>{student.name}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{student.studentId}</td>
                    {moduleAssessments.map(a => {
                      const g = getGrade(a.id, student.id);
                      if (!g) return <td key={a.id}><span className="badge badge-neutral" style={{ fontSize: 11 }}>Not recorded</span></td>;
                      const pct = getPercent(g.mark);
                      return (
                        <td key={a.id}>
                          <div style={{ fontWeight: 700, color: pct >= 50 ? 'var(--success)' : 'var(--danger)' }}>
                            {g.mark}/{a.totalMarks}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{pct}%</div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
