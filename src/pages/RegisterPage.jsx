import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import {
  ArrowLeft, Eye, EyeOff, GraduationCap, CheckCircle2,
  Upload, FileText, X, AlertCircle, Copy, Check,
  BookOpen, Award, Clock, DollarSign, ChevronRight, ShieldCheck,
  ChevronDown, ChevronUp, Briefcase, BookMarked, ListChecks
} from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const { programmes, modules } = useData();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [copiedField, setCopiedField] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    personalEmail: '',
    phone: '',
    dateOfBirth: '',
    idNumber: '',
    address: '',
    programme: 'BSc Computer Science',
    studyMode: 'Full-time',
    year: '1',
    password: '',
    confirmPassword: '',
  });

  const [selectedFaculty, setSelectedFaculty] = useState('All');
  const [expandedProgId, setExpandedProgId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState(null);

  // Document Uploads State
  const [documents, setDocuments] = useState({
    idDoc: null,
    matricDoc: null,
    proofOfAddress: null,
  });

  const idInputRef = useRef(null);
  const matricInputRef = useRef(null);
  const addressInputRef = useRef(null);

  const selectedProg = programmes.find(p => p.name === formData.programme) || programmes[0];
  const progModules = modules.filter(m => m.programme === selectedProg?.id);

  const faculties = ['All', 'Computing & ICT', 'Engineering & Built Environment', 'Commerce & Management Sciences', 'Health Sciences', 'Law & Humanities'];
  const filteredProgrammes = selectedFaculty === 'All'
    ? programmes
    : programmes.filter(p => p.faculty.toLowerCase().includes(selectedFaculty.toLowerCase().split(' ')[0]));

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileSelect = (field, file) => {
    if (file) {
      setDocuments(prev => ({ ...prev, [field]: file }));
    }
  };

  const handleRemoveFile = (field) => {
    setDocuments(prev => ({ ...prev, [field]: null }));
  };

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!formData.name.trim()) return setError('Please enter your full legal name.');
      if (!formData.personalEmail.trim() || !formData.personalEmail.includes('@')) {
        return setError('Please enter a valid personal email address (to receive login credentials).');
      }
      if (!formData.phone.trim()) return setError('Please enter your contact mobile number.');
      if (!formData.idNumber.trim()) return setError('Please enter your National ID or Passport Number.');
      setStep(2);
    } else if (step === 2) {
      if (!formData.programme) return setError('Please select your degree programme.');
      setStep(3);
    } else if (step === 3) {
      if (!documents.idDoc) return setError('Please upload your National ID or Passport copy.');
      if (!documents.matricDoc) return setError('Please upload your Matric Certificate or High School Transcript.');
      setStep(4);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);

    try {
      const dataPayload = new FormData();
      dataPayload.append('name', formData.name);
      dataPayload.append('email', formData.personalEmail);
      dataPayload.append('personalEmail', formData.personalEmail);
      dataPayload.append('phone', formData.phone);
      dataPayload.append('idNumber', formData.idNumber);
      dataPayload.append('dateOfBirth', formData.dateOfBirth);
      dataPayload.append('address', formData.address);
      dataPayload.append('programme', formData.programme);
      dataPayload.append('studyMode', formData.studyMode);
      dataPayload.append('year', formData.year);
      dataPayload.append('password', formData.password);

      if (documents.idDoc) dataPayload.append('documents', documents.idDoc);
      if (documents.matricDoc) dataPayload.append('documents', documents.matricDoc);
      if (documents.proofOfAddress) dataPayload.append('documents', documents.proofOfAddress);

      const result = await register(dataPayload);

      if (result.success && result.credentials) {
        setCredentials(result.credentials);
        setStep(5); // Success step
      } else if (result.success) {
        setCredentials({
          studentEmail: result.user.email,
          studentId: result.user.studentId,
          password: formData.password,
          personalEmail: formData.personalEmail,
          programme: formData.programme,
        });
        setStep(5);
      } else {
        setError(result.error || 'Registration failed.');
      }
    } catch (err) {
      setError('Registration service currently unreachable. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)', padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Top Header & Navigation */}
      <div style={{ width: '100%', maxWidth: 960, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <button
          onClick={() => {
            if (step > 1 && step < 5) setStep(step - 1);
            else navigate('/');
          }}
          className="btn btn-ghost"
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'white', border: '1px solid var(--surface-dark)', borderRadius: 'var(--radius-md)' }}
        >
          <ArrowLeft size={16} />
          {step > 1 && step < 5 ? 'Previous Step' : 'Back to Sign In'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--navy)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
            U
          </div>
          <div>
            <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 16, color: 'var(--navy)', lineHeight: 1 }}>
              UniSphere
            </div>
            <div style={{ fontSize: 10, color: 'var(--gold)', letterSpacing: '0.12em', fontWeight: 700 }}>
              ACADEMIC ADMISSIONS
            </div>
          </div>
        </div>

        <Link to="/" style={{ fontSize: 13, color: 'var(--navy)', fontWeight: 600 }}>
          Already have an account? <span style={{ textDecoration: 'underline' }}>Sign In</span>
        </Link>
      </div>

      {/* Main Container */}
      <div style={{ width: '100%', maxWidth: 960 }}>
        
        {/* Step Progress Bar (Hidden on success screen) */}
        {step < 5 && (
          <div className="card" style={{ padding: '16px 24px', marginBottom: 24, borderTop: '4px solid var(--gold)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
              {[
                { num: 1, title: 'Personal Details', sub: 'Applicant identity' },
                { num: 2, title: 'Degree Programme', sub: 'Full course syllabus' },
                { num: 3, title: 'Document Uploads', sub: 'ID & Matric verification' },
                { num: 4, title: 'Security & Confirm', sub: 'Set login password' },
              ].map(s => {
                const isActive = step === s.num;
                const isPassed = step > s.num;
                return (
                  <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: isActive || isPassed ? 1 : 0.45 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: isPassed ? 'var(--success)' : isActive ? 'var(--navy)' : 'var(--surface-dark)',
                      color: isPassed || isActive ? 'white' : 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 13,
                      border: isActive ? '2px solid var(--gold)' : 'none'
                    }}>
                      {isPassed ? <Check size={16} /> : s.num}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? 'var(--navy)' : 'var(--text-primary)' }}>
                        {s.title}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {s.sub}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 1: PERSONAL DETAILS */}
        {step === 1 && (
          <div className="card" style={{ padding: 32 }}>
            <div style={{ borderBottom: '1px solid var(--surface-dark)', paddingBottom: 16, marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, color: 'var(--navy)', marginBottom: 4 }}>Student Personal Information</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                Please provide your official legal details as they appear on your National ID or Passport.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="input-group">
                  <label className="input-label">Full Legal Name *</label>
                  <input
                    className="input-field"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Kagiso Molefe"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Personal Email Address *</label>
                  <input
                    className="input-field"
                    type="email"
                    name="personalEmail"
                    value={formData.personalEmail}
                    onChange={handleChange}
                    placeholder="kagiso.molefe@gmail.com"
                    required
                  />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                    ⚠️ Your official institutional login details will be dispatched to this email.
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="input-group">
                  <label className="input-label">Mobile Contact Number *</label>
                  <input
                    className="input-field"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+27 72 123 4567"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">National ID / Passport Number *</label>
                  <input
                    className="input-field"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    placeholder="0204155089088"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="input-group">
                  <label className="input-label">Date of Birth</label>
                  <input
                    className="input-field"
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Residential Address</label>
                  <input
                    className="input-field"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street Address, City, Postal Code"
                  />
                </div>
              </div>

              {error && (
                <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', padding: '12px 16px', fontSize: 13, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                <button type="button" className="btn btn-primary btn-lg" onClick={handleNext} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Continue to Programme Selection <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: DEGREE PROGRAMME SELECTION — EXPANDABLE CARDS */}
        {step === 2 && (
          <div className="card" style={{ padding: 32 }}>
            <div style={{ borderBottom: '1px solid var(--surface-dark)', paddingBottom: 16, marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, color: 'var(--navy)', marginBottom: 4 }}>Select Your Academic Degree Programme</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                Click any programme card to expand its full syllabus, career pathways, and entry requirements. Then select it to continue.
              </p>
            </div>

            {/* Faculty Filter Tabs */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {faculties.map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => { setSelectedFaculty(f); setExpandedProgId(null); }}
                  style={{
                    padding: '8px 14px',
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

            {/* Currently selected badge */}
            {formData.programme && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '10px 14px', background: 'var(--gold-pale)', border: '1px solid var(--gold)', borderRadius: 'var(--radius-md)' }}>
                <CheckCircle2 size={15} color="var(--navy)" />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>
                  Selected: <strong>{formData.programme}</strong>
                </span>
              </div>
            )}

            {/* Expandable Programme Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {filteredProgrammes.map(p => {
                const isExpanded = expandedProgId === p.id;
                const isSelected = formData.programme === p.name;
                const pModules = modules.filter(m => m.programme === p.id);

                return (
                  <div
                    key={p.id}
                    style={{
                      borderRadius: 'var(--radius-md)',
                      border: isSelected
                        ? '2px solid var(--navy)'
                        : isExpanded
                          ? '1.5px solid var(--gold)'
                          : '1px solid var(--surface-dark)',
                      overflow: 'hidden',
                      transition: 'border-color 0.15s ease',
                      boxShadow: isExpanded ? 'var(--shadow-md)' : 'none',
                    }}
                  >
                    {/* Card Header — always visible, click to toggle expand */}
                    <div
                      onClick={() => setExpandedProgId(isExpanded ? null : p.id)}
                      style={{
                        padding: '14px 18px',
                        background: isSelected ? 'var(--navy)' : isExpanded ? '#f8f9ff' : 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                        transition: 'background 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                          background: isSelected ? 'rgba(212,168,67,0.2)' : 'var(--surface-dark)',
                          color: isSelected ? 'var(--gold)' : 'var(--navy)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <GraduationCap size={20} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 700, fontSize: 14, color: isSelected ? 'white' : 'var(--text-primary)' }}>
                              {p.name}
                            </span>
                            {isSelected && (
                              <span style={{ fontSize: 10, fontWeight: 800, background: 'var(--gold)', color: 'var(--navy)', padding: '2px 8px', borderRadius: 100 }}>
                                ✓ SELECTED
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: 11, color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)', display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 2 }}>
                            <span>{p.faculty}</span>
                            <span>·</span>
                            <span>{p.years} Yrs</span>
                            <span>·</span>
                            <span>NQF {p.nqf}</span>
                            <span>·</span>
                            <span style={{ color: isSelected ? 'var(--gold)' : 'var(--navy)', fontWeight: 700 }}>
                              R {p.fee.toLocaleString()}/yr
                            </span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4,
                          background: isSelected ? 'rgba(255,255,255,0.15)' : 'var(--surface-dark)',
                          color: isSelected ? 'white' : 'var(--text-secondary)'
                        }}>
                          {p.code || 'DEG'}
                        </span>
                        {isExpanded
                          ? <ChevronUp size={16} color={isSelected ? 'white' : 'var(--text-muted)'} />
                          : <ChevronDown size={16} color={isSelected ? 'white' : 'var(--text-muted)'} />}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div style={{
                        background: 'linear-gradient(160deg, #0f1f3d 0%, #1a3260 100%)',
                        color: 'white',
                        padding: 24,
                        borderTop: '2px solid var(--gold)'
                      }}>
                        {/* Stats Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, padding: '12px 16px', background: 'rgba(255,255,255,0.06)', borderRadius: 10, marginBottom: 20 }}>
                          {[
                            { label: 'Duration', val: `${p.years} Years` },
                            { label: 'Credits', val: `${p.credits} Cr` },
                            { label: 'Tuition', val: `R ${p.fee.toLocaleString()}/yr`, gold: true },
                            { label: 'Min. APS', val: `${p.requirements?.aps || 32}+ pts` },
                          ].map(stat => (
                            <div key={stat.label}>
                              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', marginBottom: 2 }}>{stat.label}</div>
                              <div style={{ fontWeight: 700, fontSize: 13, color: stat.gold ? 'var(--gold)' : 'white' }}>{stat.val}</div>
                            </div>
                          ))}
                        </div>

                        {/* Full Description */}
                        <div style={{ marginBottom: 18 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                            <BookOpen size={13} color="var(--gold)" />
                            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                              Programme Overview & Curriculum Vision
                            </span>
                          </div>
                          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                            {p.fullDescription || p.description}
                          </p>
                        </div>

                        {/* Entry Requirements */}
                        {p.requirements && (
                          <div style={{ marginBottom: 18 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                              <ListChecks size={13} color="var(--gold)" />
                              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                Minimum Admission Requirements
                              </span>
                            </div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              {Object.entries(p.requirements).map(([k, v]) => (
                                <span key={k} style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: 100, fontSize: 12, color: 'rgba(255,255,255,0.9)' }}>
                                  <strong>{k.toUpperCase()}:</strong> {v}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Career Pathways */}
                        {p.careerOpportunities && p.careerOpportunities.length > 0 && (
                          <div style={{ marginBottom: 18 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                              <Briefcase size={13} color="var(--gold)" />
                              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                Career Pathways & Industry Placement
                              </span>
                            </div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              {p.careerOpportunities.map((career, idx) => (
                                <span key={idx} style={{
                                  padding: '4px 12px',
                                  background: 'rgba(212, 168, 67, 0.15)',
                                  color: 'var(--gold)',
                                  border: '1px solid rgba(212,168,67,0.3)',
                                  borderRadius: 4,
                                  fontSize: 12,
                                  fontWeight: 500
                                }}>
                                  ✓ {career}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Module Preview */}
                        {pModules.length > 0 && (
                          <div style={{ marginBottom: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                              <BookMarked size={13} color="var(--gold)" />
                              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                Core Academic Modules ({pModules.length} Modules)
                              </span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 6 }}>
                              {pModules.map(m => (
                                <div key={m.id} style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.06)', borderRadius: 6, fontSize: 11 }}>
                                  <span style={{ fontWeight: 700, color: 'var(--gold)' }}>{m.code}</span>
                                  <span style={{ color: 'rgba(255,255,255,0.8)' }}> — {m.name}</span>
                                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}> ({m.credits} cr)</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Select & Continue button inside expanded card */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, programme: p.name }));
                              handleNext();
                            }}
                            style={{
                              padding: '10px 24px',
                              background: 'var(--gold)',
                              color: 'var(--navy)',
                              border: 'none',
                              borderRadius: 'var(--radius-md)',
                              fontWeight: 800,
                              fontSize: 13,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              transition: 'opacity 0.15s ease'
                            }}
                          >
                            Select This Programme & Continue <ChevronRight size={15} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div className="input-group">
                <label className="input-label">Preferred Study Mode</label>
                <select className="input-field" name="studyMode" value={formData.studyMode} onChange={handleChange}>
                  <option value="Full-time">Full-time (Campus Contact)</option>
                  <option value="Hybrid">Hybrid (Blended Learning)</option>
                  <option value="Part-time">Part-time (Evening & Weekend)</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Academic Intake Year</label>
                <select className="input-field" name="year" value={formData.year} onChange={handleChange}>
                  <option value="1">Year 1 (First Year Undergraduate)</option>
                  <option value="2">Year 2 (Transfer / Advanced Standing)</option>
                </select>
              </div>
            </div>

            {error && (
              <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', padding: '12px 16px', fontSize: 13, color: 'var(--danger)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button type="button" className="btn btn-primary btn-lg" onClick={handleNext} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                Continue to Document Uploads <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DOCUMENT UPLOADS */}
        {step === 3 && (
          <div className="card" style={{ padding: 32 }}>
            <div style={{ borderBottom: '1px solid var(--surface-dark)', paddingBottom: 16, marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, color: 'var(--navy)', marginBottom: 4 }}>Required Document Verification</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                Upload certified electronic copies (PDF, PNG, JPG, DOCX). These documents will be attached directly to your student admissions dossier.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 24 }}>
              
              {/* Document 1: National ID */}
              <div style={{ border: '1.5px dashed var(--surface-dark)', borderRadius: 'var(--radius-lg)', padding: 20, background: documents.idDoc ? 'var(--gold-pale)' : 'var(--surface)' }}>
                <input
                  type="file"
                  ref={idInputRef}
                  style={{ display: 'none' }}
                  accept=".pdf,.png,.jpg,.jpeg,.docx"
                  onChange={e => handleFileSelect('idDoc', e.target.files?.[0])}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--navy)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={22} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)' }}>1. National ID / Passport Document *</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Certified copy of National Identity Card or valid Passport</div>
                      {documents.idDoc && (
                        <div style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600, marginTop: 4 }}>
                          ✓ Selected: {documents.idDoc.name} ({(documents.idDoc.size / 1024).toFixed(1)} KB)
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    {documents.idDoc ? (
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => handleRemoveFile('idDoc')} style={{ color: 'var(--danger)' }}>
                        <X size={16} /> Remove
                      </button>
                    ) : (
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => idInputRef.current?.click()}>
                        <Upload size={14} /> Choose File
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Document 2: Matric Certificate */}
              <div style={{ border: '1.5px dashed var(--surface-dark)', borderRadius: 'var(--radius-lg)', padding: 20, background: documents.matricDoc ? 'var(--gold-pale)' : 'var(--surface)' }}>
                <input
                  type="file"
                  ref={matricInputRef}
                  style={{ display: 'none' }}
                  accept=".pdf,.png,.jpg,.jpeg,.docx"
                  onChange={e => handleFileSelect('matricDoc', e.target.files?.[0])}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--navy)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Award size={22} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)' }}>2. Matric / High School Final Results Transcript *</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>National Senior Certificate (NSC), IEB or equivalent secondary transcript</div>
                      {documents.matricDoc && (
                        <div style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600, marginTop: 4 }}>
                          ✓ Selected: {documents.matricDoc.name} ({(documents.matricDoc.size / 1024).toFixed(1)} KB)
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    {documents.matricDoc ? (
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => handleRemoveFile('matricDoc')} style={{ color: 'var(--danger)' }}>
                        <X size={16} /> Remove
                      </button>
                    ) : (
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => matricInputRef.current?.click()}>
                        <Upload size={14} /> Choose File
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Document 3: Proof of Residence */}
              <div style={{ border: '1.5px dashed var(--surface-dark)', borderRadius: 'var(--radius-lg)', padding: 20, background: documents.proofOfAddress ? 'var(--gold-pale)' : 'var(--surface)' }}>
                <input
                  type="file"
                  ref={addressInputRef}
                  style={{ display: 'none' }}
                  accept=".pdf,.png,.jpg,.jpeg,.docx"
                  onChange={e => handleFileSelect('proofOfAddress', e.target.files?.[0])}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--surface-dark)', color: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={22} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)' }}>3. Proof of Residential Address (Optional)</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Utility bill, lease agreement, or municipal statement (not older than 3 months)</div>
                      {documents.proofOfAddress && (
                        <div style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600, marginTop: 4 }}>
                          ✓ Selected: {documents.proofOfAddress.name} ({(documents.proofOfAddress.size / 1024).toFixed(1)} KB)
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    {documents.proofOfAddress ? (
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => handleRemoveFile('proofOfAddress')} style={{ color: 'var(--danger)' }}>
                        <X size={16} /> Remove
                      </button>
                    ) : (
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => addressInputRef.current?.click()}>
                        <Upload size={14} /> Choose File
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', padding: '12px 16px', fontSize: 13, color: 'var(--danger)', marginBottom: 16 }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setStep(2)}>
                ← Back
              </button>
              <button type="button" className="btn btn-primary btn-lg" onClick={handleNext} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                Proceed to Security & Final Review <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PASSWORD & ENROLMENT CONFIRMATION */}
        {step === 4 && (
          <div className="card" style={{ padding: 32 }}>
            <div style={{ borderBottom: '1px solid var(--surface-dark)', paddingBottom: 16, marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, color: 'var(--navy)', marginBottom: 4 }}>Security Credentials & Final Review</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                Choose a password for your new student profile. Your official institutional student email (e.g. <code>st1234@unisphere.com</code>) will be generated upon completion.
              </p>
            </div>

            {/* Summary Review Card */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--surface-dark)', borderRadius: 'var(--radius-md)', padding: 18, marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={16} color="var(--gold)" /> Registration Summary:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
                <div><strong>Applicant Name:</strong> {formData.name}</div>
                <div><strong>Personal Email:</strong> {formData.personalEmail}</div>
                <div><strong>Selected Degree:</strong> {formData.programme}</div>
                <div><strong>Study Mode:</strong> {formData.studyMode}</div>
                <div><strong>Uploaded Documents:</strong> {[documents.idDoc, documents.matricDoc, documents.proofOfAddress].filter(Boolean).length} Verified Files</div>
                <div><strong>Curriculum Modules:</strong> {progModules.length} Modules Auto-Enrolled</div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div className="input-group">
                  <label className="input-label">Create Login Password *</label>
                  <div className="relative">
                    <input
                      className="input-field"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimum 6 characters"
                      required
                      style={{ paddingRight: 42 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text-muted)' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Confirm Password *</label>
                  <input
                    className="input-field"
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    required
                  />
                </div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: 14, marginBottom: 20, fontSize: 12, color: 'var(--text-secondary)' }}>
                ℹ️ <strong>Delivery Guarantee:</strong> Once submitted, the system will instantly issue your official institutional email (format: <strong>stXXXX@unisphere.com</strong>) and student ID, and dispatch an official confirmation letter to <strong>{formData.personalEmail}</strong>.
              </div>

              {error && (
                <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', padding: '12px 16px', fontSize: 13, color: 'var(--danger)', marginBottom: 16 }}>
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setStep(3)}>
                  ← Back
                </button>
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {loading ? 'Processing Enrolment…' : 'Submit & Generate Login Details'} <CheckCircle2 size={16} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 5: REGISTRATION COMPLETE & OFFICIAL CREDENTIAL REVEAL */}
        {step === 5 && credentials && (
          <div className="card" style={{ padding: 36, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            
            {/* Top Success Badge */}
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={36} />
            </div>

            <h2 style={{ fontFamily: 'Sora', fontSize: 26, color: 'var(--navy)', marginBottom: 8 }}>
              Registration Confirmed & Enrolment Approved!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 540, margin: '0 auto 24px' }}>
              Welcome to UniSphere, <strong>{formData.name}</strong>. Your official institutional student access details have been generated and dispatched to your email.
            </p>

            {/* Official Credentials Box */}
            <div style={{
              maxWidth: 580,
              margin: '0 auto 28px',
              background: '#0f1f3d',
              border: '2px solid var(--gold)',
              borderRadius: 'var(--radius-lg)',
              padding: 24,
              color: 'white',
              textAlign: 'left',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: 12, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--gold)', letterSpacing: '0.12em', fontWeight: 800 }}>
                    OFFICIAL STUDENT ACCESS DOSSIER
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{credentials.programme}</div>
                </div>
                <span className="badge" style={{ background: 'var(--gold)', color: 'var(--navy)', fontWeight: 800 }}>
                  ACTIVE STUDENT
                </span>
              </div>

              {/* Student Email */}
              <div style={{ marginBottom: 14, background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-md)', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Institutional Student Email (Use this to Sign In):</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: 'var(--gold)' }}>
                    {credentials.studentEmail}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => handleCopy(credentials.studentEmail, 'email')}
                  style={{ color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '4px 10px', fontSize: 11 }}
                >
                  {copiedField === 'email' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                  {copiedField === 'email' ? 'Copied' : 'Copy'}
                </button>
              </div>

              {/* Student ID */}
              <div style={{ marginBottom: 14, background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-md)', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Student Number (ID):</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: 'white' }}>
                    {credentials.studentId}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => handleCopy(credentials.studentId, 'id')}
                  style={{ color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '4px 10px', fontSize: 11 }}
                >
                  {copiedField === 'id' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                  {copiedField === 'id' ? 'Copied' : 'Copy'}
                </button>
              </div>

              {/* Password */}
              <div style={{ marginBottom: 14, background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-md)', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Assigned Password:</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 600, color: 'white' }}>
                    {showPassword ? credentials.password : '••••••••••••'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '4px 8px', fontSize: 11 }}
                  >
                    {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleCopy(credentials.password, 'password')}
                    style={{ color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '4px 10px', fontSize: 11 }}
                  >
                    {copiedField === 'password' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                    {copiedField === 'password' ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                <span>📬 Sent to: <strong>{credentials.personalEmail}</strong></span>
                <span>Active Semester Modules: <strong>{credentials.enrolledCount || 3} Enrolled</strong></span>
              </div>
            </div>

            {/* Action CTAs */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/student')}
                style={{ padding: '12px 32px', fontSize: 15, fontWeight: 700 }}
              >
                Enter Student Dashboard Now →
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-lg"
                onClick={() => navigate('/')}
                style={{ border: '1px solid var(--surface-dark)', background: 'white' }}
              >
                Return to Login Page
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
