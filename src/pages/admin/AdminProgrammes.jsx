import { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { useData } from '../../contexts/DataContext';
import {
  BookOpen, Award, GraduationCap, DollarSign, Clock,
  Search, Download, CheckCircle, ChevronDown, ChevronUp, Layers
} from 'lucide-react';

export default function AdminProgrammes() {
  const { programmes, modules, exportToCsv } = useData();
  const [search, setSearch] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const faculties = ['All', 'Computing & ICT', 'Engineering & Built Environment', 'Commerce & Management Sciences', 'Health Sciences', 'Law & Humanities'];

  const filtered = programmes.filter(p => {
    const matchesSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code?.toLowerCase().includes(search.toLowerCase()) ||
      p.faculty.toLowerCase().includes(search.toLowerCase());

    const matchesFaculty = selectedFaculty === 'All' ||
      p.faculty.toLowerCase().includes(selectedFaculty.toLowerCase().split(' ')[0]);

    return matchesSearch && matchesFaculty;
  });

  const handleExportCsv = () => {
    const headers = ['Programme Code', 'Degree Name', 'Faculty', 'Duration (Years)', 'Credits', 'NQF Level', 'Annual Fee (ZAR)', 'Career Opportunities'];
    const rows = programmes.map(p => [
      p.code || '',
      p.name,
      p.faculty,
      p.years,
      p.credits,
      p.nqf,
      p.fee,
      (p.careerOpportunities || []).join('; ')
    ]);
    exportToCsv('unisphere_academic_programmes_catalogue', headers, rows);
  };

  return (
    <div>
      <PageHeader
        title="Academic Programmes"
        subtitle={`Official degree curriculum and syllabus catalogue (${programmes.length} programmes across ${faculties.length - 1} faculties)`}
        actions={
          <button className="btn btn-ghost btn-sm" onClick={handleExportCsv}>
            <Download size={14} /> Export Catalogue CSV
          </button>
        }
      />

      <div className="page-body">
        
        {/* Controls Bar: Search & Faculty Tabs */}
        <div className="card" style={{ padding: 18, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div className="search-wrap" style={{ maxWidth: 320, width: '100%' }}>
              <Search size={14} />
              <input
                className="input-field"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search courses, codes, faculties…"
                style={{ paddingLeft: 34 }}
              />
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {faculties.map(f => (
                <button
                  key={f}
                  onClick={() => setSelectedFaculty(f)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 100,
                    fontSize: 12,
                    fontWeight: 600,
                    background: selectedFaculty === f ? 'var(--navy)' : 'var(--surface-mid)',
                    color: selectedFaculty === f ? 'var(--gold)' : 'var(--text-secondary)',
                    border: selectedFaculty === f ? '1px solid var(--navy)' : '1px solid var(--surface-dark)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Programmes Grid / Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {filtered.map(p => {
            const mods = modules.filter(m => m.programme === p.id);
            const isExpanded = expandedId === p.id;

            return (
              <div
                key={p.id}
                className="card"
                style={{
                  borderLeft: '4px solid var(--gold)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s ease',
                  padding: 24
                }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 14 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span className="badge" style={{ background: 'var(--navy)', color: 'var(--gold)', fontWeight: 700, fontSize: 11 }}>
                        {p.code || 'DEG'}
                      </span>
                      <span className="badge badge-neutral" style={{ fontSize: 11 }}>
                        {p.faculty}
                      </span>
                      <span className="badge badge-neutral" style={{ fontSize: 11 }}>
                        NQF Level {p.nqf}
                      </span>
                    </div>

                    <h3 style={{ fontSize: 20, color: 'var(--navy)', marginBottom: 4 }}>
                      {p.name}
                    </h3>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      {p.years} Years · {p.credits} Total SAQA Credits · {mods.length} Modules Registered
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 24, color: 'var(--navy)' }}>
                      R {Number(p.fee).toLocaleString()}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>per academic year</div>
                  </div>
                </div>

                {/* Short Overview */}
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                  {p.description}
                </p>

                {/* Career Pathways Pills */}
                {p.careerOpportunities && p.careerOpportunities.length > 0 && (
                  <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy)' }}>Career Pathways:</span>
                    {p.careerOpportunities.map((career, i) => (
                      <span
                        key={i}
                        style={{
                          background: 'var(--gold-pale)',
                          color: '#8a6510',
                          border: '1px solid #ebd39c',
                          padding: '3px 9px',
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 600
                        }}
                      >
                        ✓ {career}
                      </span>
                    ))}
                  </div>
                )}

                {/* Collapsible Full Explanation & Syllabus Details */}
                <div style={{ borderTop: '1px solid var(--surface-dark)', paddingTop: 14 }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setExpandedId(isExpanded ? null : p.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      fontSize: 12, fontWeight: 700, color: 'var(--navy)',
                      padding: 0
                    }}
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    {isExpanded ? 'Hide Course Curriculum & Requirements' : 'View Full Course Explanation & Curriculum'}
                  </button>

                  {isExpanded && (
                    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
                      
                      {/* Full Detailed Description */}
                      <div style={{ background: 'var(--surface)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-dark)' }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--navy)', marginBottom: 6 }}>
                          Full Syllabus & Curriculum Rationale:
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                          {p.fullDescription || p.description}
                        </p>
                      </div>

                      {/* Entry Requirements */}
                      {p.requirements && Object.keys(p.requirements).length > 0 && (
                        <div style={{ background: 'var(--surface)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-dark)' }}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--navy)', marginBottom: 6 }}>
                            Minimum Academic Entry Requirements:
                          </div>
                          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 12 }}>
                            {Object.entries(p.requirements).map(([reqKey, reqVal]) => (
                              <span key={reqKey} style={{ background: 'white', padding: '4px 10px', borderRadius: 6, border: '1px solid var(--surface-dark)' }}>
                                <strong style={{ color: 'var(--navy)' }}>{reqKey.toUpperCase()}:</strong> {reqVal}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Associated Modules */}
                      {mods.length > 0 && (
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy)', textTransform: 'uppercase', marginBottom: 10 }}>
                            Curriculum Modules ({mods.length})
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
                            {mods.map(m => (
                              <div
                                key={m.id}
                                style={{
                                  padding: '10px 14px',
                                  background: 'white',
                                  borderRadius: 'var(--radius-md)',
                                  border: '1px solid var(--surface-dark)',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: 2
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: 'var(--navy)' }}>{m.code}</span>
                                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.credits} Credits</span>
                                </div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{m.name}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Semester {m.semester} · Year {m.year}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
