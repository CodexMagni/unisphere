import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown, ArrowRight, BookOpen, Check, ChevronRight, Clock3,
  GraduationCap, Menu, Search, Sparkles, X
} from 'lucide-react';
import { useData } from '../contexts/DataContext';

const COURSE_IMAGES = [
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=85',
];

export default function LandingPage() {
  const { programmes } = useData();
  const [query, setQuery] = useState('');
  const [activeFaculty, setActiveFaculty] = useState('All programmes');
  const [menuOpen, setMenuOpen] = useState(false);

  const faculties = useMemo(
    () => ['All programmes', ...new Set(programmes.map(programme => programme.faculty))],
    [programmes]
  );
  const visibleProgrammes = programmes.filter(programme => {
    const matchesFaculty = activeFaculty === 'All programmes' || programme.faculty === activeFaculty;
    const searchText = `${programme.name} ${programme.faculty} ${programme.description}`.toLowerCase();
    return matchesFaculty && searchText.includes(query.trim().toLowerCase());
  });

  return (
    <main className="landing-page">
      <header className="landing-header">
        <Link className="landing-brand" to="/" aria-label="UniSphere home">
          <span className="landing-brand-mark"><GraduationCap size={22} strokeWidth={2.2} /></span>
          <span>uni<span>sphere</span></span>
        </Link>
        <button
          className="landing-menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className={`landing-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          <a href="#programmes" onClick={() => setMenuOpen(false)}>Study with us</a>
          <a href="#why-unisphere" onClick={() => setMenuOpen(false)}>Why UniSphere</a>
          <a href="#campus-life" onClick={() => setMenuOpen(false)}>Campus life</a>
          <Link className="landing-sign-in" to="/login">Sign in</Link>
          <Link className="landing-apply" to="/register">Apply now <ArrowRight size={16} /></Link>
        </nav>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-copy">
          <div className="landing-eyebrow"><span /> YOUR NEXT CHAPTER STARTS HERE</div>
          <h1>Make room for<br />what <em>moves you.</em></h1>
          <p>Find your people. Follow your curiosity. Build a future that feels like yours at UniSphere.</p>
          <div className="landing-hero-actions">
            <a className="landing-button landing-button-gold" href="#programmes">Explore programmes <ArrowRight size={17} /></a>
            <a className="landing-text-link" href="#why-unisphere">Discover UniSphere <ChevronRight size={16} /></a>
          </div>
          <div className="landing-hero-proof">
            <div className="landing-avatar-stack" aria-hidden="true">
              <span>AM</span><span>TN</span><span>ZS</span><span>+2k</span>
            </div>
            <div><strong>A place to belong</strong><small>Join a community going places</small></div>
          </div>
        </div>
        <div className="landing-hero-visual">
          <div className="landing-hero-photo" role="img" aria-label="Students studying together on campus" />
          <div className="landing-photo-label"><span className="landing-photo-dot" /> CAMPUS LIFE, YOUR WAY</div>
          <div className="landing-note-card">
            <div className="landing-note-icon"><Sparkles size={18} /></div>
            <div><strong>Your future, in focus</strong><span>Make it happen at UniSphere</span></div>
            <ArrowRight size={17} />
          </div>
          <span className="landing-hero-orbit landing-hero-orbit-one" />
          <span className="landing-hero-orbit landing-hero-orbit-two" />
        </div>
        <a className="landing-scroll-cue" href="#programmes"><ArrowDown size={15} /> SCROLL TO EXPLORE</a>
      </section>

      <section className="landing-stat-strip" aria-label="UniSphere at a glance">
        <div><strong>4</strong><span>distinct programmes</span></div>
        <div><strong>3–4</strong><span>years to your degree</span></div>
        <div><strong>1</strong><span>community that has your back</span></div>
        <a href="#programmes">Find your programme <ArrowRight size={16} /></a>
      </section>

      <section className="landing-programmes" id="programmes">
        <div className="landing-section-heading">
          <div>
            <div className="landing-eyebrow landing-eyebrow-dark"><span /> FIND YOUR DIRECTION</div>
            <h2>Big ideas. <em>Real possibilities.</em></h2>
            <p>Start with what inspires you. We’ll help you take it further.</p>
          </div>
          <div className="landing-programme-count"><strong>{visibleProgrammes.length.toString().padStart(2, '0')}</strong><span>programmes<br />to explore</span></div>
        </div>

        <div className="landing-catalog-tools">
          <div className="landing-filters" aria-label="Filter by faculty">
            {faculties.map(faculty => (
              <button
                type="button"
                key={faculty}
                className={activeFaculty === faculty ? 'is-active' : ''}
                aria-pressed={activeFaculty === faculty}
                onClick={() => setActiveFaculty(faculty)}
              >
                {faculty}
              </button>
            ))}
          </div>
          <label className="landing-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search programmes"
              value={query}
              onChange={event => setQuery(event.target.value)}
              aria-label="Search programmes"
            />
          </label>
        </div>

        {visibleProgrammes.length ? (
          <div className="landing-course-grid">
            {visibleProgrammes.map(programme => (
              <article className="landing-course-card" key={programme.id}>
                <div className="landing-course-image">
                  <img src={COURSE_IMAGES[programmes.findIndex(course => course.id === programme.id) % COURSE_IMAGES.length]} alt="" loading="lazy" />
                  <span>{programme.faculty}</span>
                  <div className="landing-course-image-icon"><BookOpen size={19} /></div>
                </div>
                <div className="landing-course-content">
                  <div className="landing-course-meta"><span>UNDERGRADUATE</span><span>·</span><span>NQF LEVEL {programme.nqf}</span></div>
                  <h3>{programme.name}</h3>
                  <p>{programme.description}</p>
                  <div className="landing-course-details">
                    <span><Clock3 size={15} /> {programme.years} years</span>
                    <span><GraduationCap size={16} /> {programme.credits} credits</span>
                  </div>
                  <div className="landing-course-footer">
                    <span>From <strong>R{Number(programme.fee).toLocaleString('en-ZA')}</strong> <small>/ year</small></span>
                    <Link to={`/register?programme=${encodeURIComponent(programme.id)}`} aria-label={`Apply for ${programme.name}`}>
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="landing-empty">
            <Search size={24} />
            <h3>No programmes found</h3>
            <p>Try a different search or choose another faculty.</p>
            <button type="button" onClick={() => { setQuery(''); setActiveFaculty('All programmes'); }}>Clear filters</button>
          </div>
        )}
      </section>

      <section className="landing-why" id="why-unisphere">
        <div className="landing-why-photo" id="campus-life" role="img" aria-label="University students walking across campus">
          <span>COME AS YOU ARE.<br />LEAVE READY FOR MORE.</span>
        </div>
        <div className="landing-why-copy">
          <div className="landing-eyebrow"><span /> MORE THAN A DEGREE</div>
          <h2>Here, your journey<br />is <em>the point.</em></h2>
          <p>University should open doors and help you find your own way through them. At UniSphere, you get the support, the space, and the people to make every step count.</p>
          <ul>
            <li><Check size={17} /> Support that sees the whole you</li>
            <li><Check size={17} /> Learning connected to the real world</li>
            <li><Check size={17} /> A community that grows with you</li>
          </ul>
          <Link className="landing-text-link landing-why-link" to="/register">Start your application <ArrowRight size={16} /></Link>
        </div>
      </section>

      <section className="landing-bottom-cta">
        <div>
          <div className="landing-eyebrow"><span /> YOUR STORY IS WAITING</div>
          <h2>Ready to find your <em>something?</em></h2>
          <p>Your next chapter could start right here.</p>
        </div>
        <Link className="landing-button landing-button-gold" to="/register">Apply to UniSphere <ArrowRight size={17} /></Link>
      </section>

      <footer className="landing-footer">
        <Link className="landing-brand" to="/" aria-label="UniSphere home">
          <span className="landing-brand-mark"><GraduationCap size={20} strokeWidth={2.2} /></span>
          <span>uni<span>sphere</span></span>
        </Link>
        <p>One platform. Every step of the university journey.</p>
        <span>© 2026 UniSphere University</span>
      </footer>
    </main>
  );
}
