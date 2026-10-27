// UniSphere Seed Data — All fictional

export const USERS = [
  { id: 'u1', name: 'Dr. Admin Mokoena', email: 'admin@unisphere.ac.za', password: 'Admin@123', role: 'admin', avatar: 'AM', faculty: null },
  { id: 'u2', name: 'Prof. Sarah Dlamini', email: 'lecturer@unisphere.ac.za', password: 'Lecture@123', role: 'lecturer', avatar: 'SD', faculty: 'Computing & ICT', modules: ['m1','m2','m3','m4'] },
  { id: 'u3', name: 'Thabo Nkosi', email: 'student@unisphere.ac.za', studentEmail: 'st1042@unisphere.com', password: 'Student@123', role: 'student', avatar: 'TN', studentId: 'ST-1042', programme: 'BSc Computer Science', year: 2, personalEmail: 'thabo.nkosi@gmail.com', phone: '+27 72 345 6789' },
  { id: 'u4', name: 'Officer Zanele Khumalo', email: 'success@unisphere.ac.za', password: 'Success@123', role: 'success_officer', avatar: 'ZK', faculty: 'All' },
  { id: 'u5', name: 'Thembi Sithole', email: 'thembi@unisphere.ac.za', studentEmail: 'st1087@unisphere.com', password: 'Student@123', role: 'student', avatar: 'TS', studentId: 'ST-1087', programme: 'BSc Computer Science', year: 2, personalEmail: 'thembi.sithole@gmail.com', phone: '+27 83 234 5678' },
  { id: 'u6', name: 'Ayanda Mthembu', email: 'ayanda@unisphere.ac.za', studentEmail: 'st1113@unisphere.com', password: 'Student@123', role: 'student', avatar: 'AM', studentId: 'ST-1113', programme: 'BEng Software Engineering', year: 1, personalEmail: 'ayanda.m@gmail.com', phone: '+27 71 890 1234' },
];

export const PROGRAMMES = [
  {
    id: 'p1',
    code: 'BSC-CS',
    name: 'BSc Computer Science',
    faculty: 'Computing & ICT',
    years: 3,
    credits: 360,
    nqf: 7,
    fee: 45000,
    description: 'Develop rigorous technical mastery in algorithm design, scalable cloud computing, data structures, and enterprise full-stack development.',
    fullDescription: 'The Bachelor of Science in Computer Science equips students with foundational and advanced computing theory coupled with intensive practical software engineering. Students learn algorithms, low-level architecture, operating systems, database management systems, and modern AI pipelines. The curriculum bridges rigorous mathematical problem solving with real-world enterprise software delivery.',
    careerOpportunities: ['Full-Stack Software Engineer', 'Cloud Systems Architect', 'Database Administrator', 'Algorithm Research Scientist', 'DevOps & Infrastructure Lead'],
    requirements: { aps: 34, math: '65% (Mathematics)', science: '60% (Physical Sciences)', english: '60% (English HL/FAL)' }
  },
  {
    id: 'p2',
    code: 'BENG-SE',
    name: 'BEng Software Engineering',
    faculty: 'Engineering & Built Environment',
    years: 4,
    credits: 480,
    nqf: 8,
    fee: 52000,
    description: 'Professional engineering curriculum on mission-critical distributed systems, embedded firmware, real-time architectures, and systems safety.',
    fullDescription: 'The Bachelor of Engineering in Software Engineering is an accredited professional program focused on architecting reliable, fault-tolerant, high-performance distributed systems. Students master systems validation, computer hardware interfacing, microservice patterns, and enterprise cybersecurity protocols under strict engineering standards.',
    careerOpportunities: ['Systems Software Engineer', 'Embedded Systems Developer', 'DevOps Solutions Architect', 'Cybersecurity Systems Engineer', 'Enterprise Technical Director'],
    requirements: { aps: 36, math: '75% (Mathematics)', science: '70% (Physical Sciences)', english: '65% (English HL/FAL)' }
  },
  {
    id: 'p3',
    code: 'BCOM-IS',
    name: 'BCom Information Systems & Analytics',
    faculty: 'Commerce & Management Sciences',
    years: 3,
    credits: 360,
    nqf: 7,
    fee: 42000,
    description: 'Bridge business strategy and modern enterprise technology with corporate digital transformation, ERP systems, and BI analytics.',
    fullDescription: 'The BCom in Information Systems bridges executive business operations and technical IT infrastructure. Students master business intelligence, data modeling, enterprise resource planning (ERP), corporate IT governance, agile project management, and digital customer product strategy.',
    careerOpportunities: ['Business Systems Analyst', 'IT Project Manager', 'Enterprise ERP Consultant', 'BI & Reporting Analyst', 'Digital Transformation Strategist'],
    requirements: { aps: 32, math: '60% (Maths) or 75% (Maths Lit)', science: 'Not required', english: '60% (English HL/FAL)' }
  },
  {
    id: 'p4',
    code: 'BSC-DS',
    name: 'BSc Data Science & Artificial Intelligence',
    faculty: 'Computing & ICT',
    years: 3,
    credits: 360,
    nqf: 7,
    fee: 48000,
    description: 'Master advanced statistical modeling, deep learning architectures, computer vision, natural language processing, and big data infrastructure.',
    fullDescription: 'The BSc Data Science & AI curriculum immerses students into modern probabilistic reasoning, linear algebra, neural networks, computer vision, transformers, and petabyte-scale data pipelines. Students build predictive models and end-to-end autonomous machine learning solutions.',
    careerOpportunities: ['Machine Learning Engineer', 'Data Scientist', 'AI Quantitative Researcher', 'Big Data Pipeline Engineer', 'Analytics Specialist'],
    requirements: { aps: 35, math: '70% (Mathematics)', science: '65% (Physical Sciences)', english: '60% (English HL/FAL)' }
  },
  {
    id: 'p5',
    code: 'BSC-CYBER',
    name: 'BSc Cybersecurity & Digital Forensics',
    faculty: 'Computing & ICT',
    years: 3,
    credits: 360,
    nqf: 7,
    fee: 46500,
    description: 'Specialized training in penetration testing, threat hunting, applied cryptography, network defense, and forensic crime investigations.',
    fullDescription: 'This degree provides comprehensive knowledge in red-team penetration testing, blue-team SOC defense, malware reverse engineering, packet inspection, cloud workload security, and digital evidentiary forensics adhering to criminal justice and regulatory frameworks.',
    careerOpportunities: ['Cybersecurity Threat Analyst', 'Penetration Tester / Ethical Hacker', 'SOC Security Engineer', 'Digital Forensics Investigator', 'Information Security Officer'],
    requirements: { aps: 33, math: '60% (Mathematics)', science: '55% (Physical Sciences)', english: '60% (English HL/FAL)' }
  },
  {
    id: 'p6',
    code: 'BENG-MECH',
    name: 'BEng Mechanical & Mechatronics Engineering',
    faculty: 'Engineering & Built Environment',
    years: 4,
    credits: 480,
    nqf: 8,
    fee: 54000,
    description: 'Interdisciplinary engineering merging mechanical dynamics, robotics, automated sensory control, and computer-integrated manufacturing.',
    fullDescription: 'Students explore thermodynamics, continuum mechanics, sensor telemetry, microcontrollers, pneumatic actuators, CAD/CAM simulation, and autonomous robotics. The degree trains engineers capable of revolutionizing automated industrial assembly lines and advanced robotic mechanisms.',
    careerOpportunities: ['Mechatronics Engineer', 'Robotics Systems Specialist', 'Automation & Control Engineer', 'Mechanical Design Consultant', 'Industrial Production Manager'],
    requirements: { aps: 36, math: '75% (Mathematics)', science: '70% (Physical Sciences)', english: '60% (English HL/FAL)' }
  },
  {
    id: 'p7',
    code: 'BENG-EE',
    name: 'BSc Electrical & Electronics Engineering',
    faculty: 'Engineering & Built Environment',
    years: 4,
    credits: 480,
    nqf: 8,
    fee: 53000,
    description: 'Power the future through renewable smart electrical grids, telecommunication RF networks, microchip architecture, and embedded signal processing.',
    fullDescription: 'Focuses on electrical power systems, high-voltage substations, green energy distribution, analog and digital electronics, telecommunications, and digital signal processors (DSP). Graduates pioneer smart electrical networks and IoT electronics.',
    careerOpportunities: ['Electrical Power Engineer', 'Electronics Design Specialist', 'Renewable Grid Architect', 'Telecommunications Engineer', 'Embedded Firmware Developer'],
    requirements: { aps: 35, math: '70% (Mathematics)', science: '70% (Physical Sciences)', english: '60% (English HL/FAL)' }
  },
  {
    id: 'p8',
    code: 'BCOM-ACC',
    name: 'BCom Accounting Sciences (CA Stream)',
    faculty: 'Commerce & Management Sciences',
    years: 3,
    credits: 360,
    nqf: 7,
    fee: 44000,
    description: 'Accredited professional degree covering financial accounting, corporate taxation, managerial finance, and auditing standards.',
    fullDescription: 'The BCom Accounting Sciences CA Stream prepares candidates for professional qualification as Chartered Accountants (SA). It delivers deep immersion into International Financial Reporting Standards (IFRS), tax legislation, statutory auditing, risk analysis, and corporate finance governance.',
    careerOpportunities: ['Chartered Accountant (SA Candidate)', 'Financial Controller', 'Taxation Specialist', 'Forensic Auditor', 'Investment Banking Analyst'],
    requirements: { aps: 34, math: '65% (Mathematics)', science: 'Accounting 65% recommended', english: '60% (English HL/FAL)' }
  },
  {
    id: 'p9',
    code: 'BCOM-MKT',
    name: 'BCom Business Administration & Marketing',
    faculty: 'Commerce & Management Sciences',
    years: 3,
    credits: 360,
    nqf: 7,
    fee: 39500,
    description: 'Comprehensive business management curriculum covering global supply chain, omnichannel digital marketing, brand development, and strategic leadership.',
    fullDescription: 'Covers strategic enterprise leadership, market research methods, consumer behavioral psychology, digital growth marketing, corporate communications, and supply logistics. Students build business ventures and lead international commercial operations.',
    careerOpportunities: ['Brand Manager', 'Marketing Director', 'Commercial Operations Lead', 'Business Development Consultant', 'Corporate Strategy Specialist'],
    requirements: { aps: 30, math: '50% (Maths) or 65% (Maths Lit)', science: 'Not required', english: '60% (English HL/FAL)' }
  },
  {
    id: 'p10',
    code: 'BNURS-HONS',
    name: 'Bachelor of Nursing Science (Honours)',
    faculty: 'Health Sciences',
    years: 4,
    credits: 480,
    nqf: 8,
    fee: 47000,
    description: 'Professional healthcare qualification in comprehensive nursing care, acute clinical diagnostics, pharmacology, and healthcare management.',
    fullDescription: 'An integrated clinical healthcare curriculum encompassing human anatomy, clinical physiology, general nursing, community health nursing, midwifery, and psychiatric nursing science. Students complete extensive clinical ward rotations under registered preceptor guidance.',
    careerOpportunities: ['Registered Professional Nurse', 'Intensive Care Unit (ICU) Specialist', 'Nurse Clinical Educator', 'Community Health Director', 'Hospital Ward Administrator'],
    requirements: { aps: 33, math: '60% (Maths) or 70% (Maths Lit)', science: '65% (Life Sciences)', english: '65% (English HL/FAL)' }
  },
  {
    id: 'p11',
    code: 'BPHARM',
    name: 'Bachelor of Pharmacy (BPharm)',
    faculty: 'Health Sciences',
    years: 4,
    credits: 480,
    nqf: 8,
    fee: 51000,
    description: 'Expert training in medicinal chemistry, pharmacology, pharmaceutical manufacturing, drug therapeutics, and patient clinical consultations.',
    fullDescription: 'The BPharm program trains medication experts. It covers pharmacotherapy, sterile pharmaceutical manufacturing, drug delivery formulation, pharmacokinetics, hospital dispensary management, and patient medication compliance counseling in accordance with statutory health pharmacy councils.',
    careerOpportunities: ['Hospital Clinical Pharmacist', 'Community Pharmacist', 'Pharmaceutical Drug Developer', 'Regulatory Affairs Manager', 'Clinical Trials Coordinator'],
    requirements: { aps: 35, math: '65% (Mathematics)', science: '65% (Physical Sciences) & 65% (Life Sciences)', english: '65% (English HL/FAL)' }
  },
  {
    id: 'p12',
    code: 'LLB-LAW',
    name: 'Bachelor of Laws (LLB)',
    faculty: 'Law & Humanities',
    years: 4,
    credits: 480,
    nqf: 8,
    fee: 46000,
    description: 'Premier professional legal qualification covering constitutional rights, criminal law, corporate commercial transactions, and courtroom advocacy.',
    fullDescription: 'The LLB degree delivers comprehensive mastery of private law, public law, civil procedure, criminal litigation, commercial contracts, international human rights law, labor arbitration, and legal ethics. Students engage in practical moot court trials and legal clinic community practice.',
    careerOpportunities: ['Attorney / Legal Practitioner', 'Advocate at the Bar', 'Corporate Legal Counsel', 'Judicial Clerk / Magistrate', 'Legal Compliance Specialist'],
    requirements: { aps: 34, math: '55% (Maths or Maths Lit)', science: 'Not required', english: '70% (English HL/FAL)' }
  }
];

export const MODULES = [
  // Computer Science & ICT
  { id: 'm1', code: 'CSC201', name: 'Data Structures & Algorithms', credits: 20, semester: 1, year: 2, programme: 'p1', lecturer: 'u2', capacity: 60, enrolled: 54 },
  { id: 'm2', code: 'CSC202', name: 'Database Systems & SQL', credits: 20, semester: 1, year: 2, programme: 'p1', lecturer: 'u2', capacity: 60, enrolled: 58 },
  { id: 'm3', code: 'CSC203', name: 'Operating Systems & Concurrency', credits: 20, semester: 2, year: 2, programme: 'p1', lecturer: 'u2', capacity: 55, enrolled: 49 },
  { id: 'm4', code: 'CSC101', name: 'Introduction to Programming (Python & C++)', credits: 20, semester: 1, year: 1, programme: 'p1', lecturer: 'u2', capacity: 80, enrolled: 78 },
  { id: 'm5', code: 'MAT201', name: 'Discrete Mathematics & Logic', credits: 20, semester: 1, year: 2, programme: 'p1', lecturer: null, capacity: 60, enrolled: 52 },
  
  // Software Engineering
  { id: 'm6', code: 'SEN101', name: 'Software Engineering Principles', credits: 20, semester: 1, year: 1, programme: 'p2', lecturer: 'u2', capacity: 60, enrolled: 45 },
  { id: 'm7', code: 'SEN201', name: 'Design Patterns & Enterprise Architecture', credits: 20, semester: 1, year: 2, programme: 'p2', lecturer: 'u2', capacity: 50, enrolled: 40 },
  { id: 'm8', code: 'SEN301', name: 'Distributed Systems & Cloud DevOps', credits: 20, semester: 1, year: 3, programme: 'p2', lecturer: 'u2', capacity: 45, enrolled: 38 },

  // Information Systems
  { id: 'm9', code: 'IFS101', name: 'Business Information Systems', credits: 20, semester: 1, year: 1, programme: 'p3', lecturer: null, capacity: 70, enrolled: 65 },
  { id: 'm10', code: 'IFS201', name: 'Enterprise ERP & Business Process Modeling', credits: 20, semester: 1, year: 2, programme: 'p3', lecturer: null, capacity: 60, enrolled: 55 },

  // Data Science & AI
  { id: 'm11', code: 'DAT101', name: 'Introduction to Data Science & R', credits: 20, semester: 1, year: 1, programme: 'p4', lecturer: 'u2', capacity: 60, enrolled: 50 },
  { id: 'm12', code: 'DAT201', name: 'Machine Learning & Neural Networks', credits: 20, semester: 1, year: 2, programme: 'p4', lecturer: 'u2', capacity: 50, enrolled: 48 },

  // Cybersecurity
  { id: 'm13', code: 'SEC101', name: 'Network Security Fundamentals', credits: 20, semester: 1, year: 1, programme: 'p5', lecturer: null, capacity: 55, enrolled: 42 },
  { id: 'm14', code: 'SEC201', name: 'Ethical Hacking & Penetration Testing', credits: 20, semester: 1, year: 2, programme: 'p5', lecturer: null, capacity: 45, enrolled: 39 },

  // Mechanical & Mechatronics
  { id: 'm15', code: 'MEC101', name: 'Engineering Mechanics & Statics', credits: 20, semester: 1, year: 1, programme: 'p6', lecturer: null, capacity: 60, enrolled: 52 },
  { id: 'm16', code: 'MEC201', name: 'Robotics, Sensors & Microcontrollers', credits: 20, semester: 1, year: 2, programme: 'p6', lecturer: null, capacity: 50, enrolled: 44 },

  // Electrical & Electronics
  { id: 'm17', code: 'ELE101', name: 'Circuit Analysis & Digital Logic', credits: 20, semester: 1, year: 1, programme: 'p7', lecturer: null, capacity: 60, enrolled: 51 },
  { id: 'm18', code: 'ELE201', name: 'Electromagnetics & Power Grids', credits: 20, semester: 1, year: 2, programme: 'p7', lecturer: null, capacity: 50, enrolled: 43 },

  // Accounting Sciences
  { id: 'm19', code: 'ACC101', name: 'Financial Accounting 1A', credits: 20, semester: 1, year: 1, programme: 'p8', lecturer: null, capacity: 80, enrolled: 75 },
  { id: 'm20', code: 'ACC201', name: 'Corporate Taxation & Auditing', credits: 20, semester: 1, year: 2, programme: 'p8', lecturer: null, capacity: 70, enrolled: 68 },

  // Business Administration
  { id: 'm21', code: 'BUS101', name: 'Principles of Business Management', credits: 20, semester: 1, year: 1, programme: 'p9', lecturer: null, capacity: 90, enrolled: 85 },
  { id: 'm22', code: 'MKT201', name: 'Strategic Brand Marketing & Consumer Insights', credits: 20, semester: 1, year: 2, programme: 'p9', lecturer: null, capacity: 80, enrolled: 72 },

  // Nursing Science
  { id: 'm23', code: 'NUR101', name: 'Human Anatomy & Clinical Physiology', credits: 20, semester: 1, year: 1, programme: 'p10', lecturer: null, capacity: 50, enrolled: 48 },
  { id: 'm24', code: 'NUR201', name: 'Acute Clinical Nursing Practice & Pharmacology', credits: 20, semester: 1, year: 2, programme: 'p10', lecturer: null, capacity: 45, enrolled: 42 },

  // Pharmacy
  { id: 'm25', code: 'PHA101', name: 'Pharmaceutical Chemistry & Bio-organic Systems', credits: 20, semester: 1, year: 1, programme: 'p11', lecturer: null, capacity: 50, enrolled: 46 },
  { id: 'm26', code: 'PHA201', name: 'Clinical Pharmacotherapy & Drug Delivery', credits: 20, semester: 1, year: 2, programme: 'p11', lecturer: null, capacity: 45, enrolled: 41 },

  // Law
  { id: 'm27', code: 'LAW101', name: 'South African Constitutional & Criminal Law', credits: 20, semester: 1, year: 1, programme: 'p12', lecturer: null, capacity: 75, enrolled: 70 },
  { id: 'm28', code: 'LAW201', name: 'Commercial Contracts, Company Law & Dispute Resolution', credits: 20, semester: 1, year: 2, programme: 'p12', lecturer: null, capacity: 65, enrolled: 62 },
];

export const ENROLMENTS = [
  { id: 'e1', studentId: 'u3', moduleId: 'm1', status: 'active' },
  { id: 'e2', studentId: 'u3', moduleId: 'm2', status: 'active' },
  { id: 'e3', studentId: 'u3', moduleId: 'm5', status: 'active' },
  { id: 'e4', studentId: 'u5', moduleId: 'm1', status: 'active' },
  { id: 'e5', studentId: 'u5', moduleId: 'm2', status: 'active' },
  { id: 'e6', studentId: 'u6', moduleId: 'm4', status: 'active' },
  { id: 'e7', studentId: 'u6', moduleId: 'm6', status: 'active' },
];

export const ASSESSMENTS = [
  { id: 'a1', moduleId: 'm1', title: 'Assignment 1: Sorting Algorithms', type: 'assignment', dueDate: '2025-03-15', totalMarks: 50, weight: 20 },
  { id: 'a2', moduleId: 'm1', title: 'Mid-Semester Test', type: 'test', dueDate: '2025-04-10', totalMarks: 100, weight: 30 },
  { id: 'a3', moduleId: 'm1', title: 'Assignment 2: Tree Traversals', type: 'assignment', dueDate: '2025-04-30', totalMarks: 50, weight: 20 },
  { id: 'a4', moduleId: 'm1', title: 'Final Examination', type: 'exam', dueDate: '2025-06-15', totalMarks: 100, weight: 30 },
  { id: 'a5', moduleId: 'm2', title: 'SQL Project', type: 'assignment', dueDate: '2025-03-20', totalMarks: 100, weight: 25 },
  { id: 'a6', moduleId: 'm2', title: 'Mid-Semester Test', type: 'test', dueDate: '2025-04-12', totalMarks: 100, weight: 35 },
  { id: 'a7', moduleId: 'm2', title: 'Final Exam', type: 'exam', dueDate: '2025-06-18', totalMarks: 100, weight: 40 },
];

export const GRADES = [
  { id: 'g1', assessmentId: 'a1', studentId: 'u3', mark: 38, feedback: 'Good work on bubble sort, but QuickSort implementation has issues.' },
  { id: 'g2', assessmentId: 'a2', studentId: 'u3', mark: 52, feedback: 'Struggled with recursion. Please attend tutoring sessions.' },
  { id: 'g3', assessmentId: 'a5', studentId: 'u3', mark: 71, feedback: 'Well-structured SQL queries. Good use of joins.' },
  { id: 'g4', assessmentId: 'a1', studentId: 'u5', mark: 28, feedback: 'Missing critical sections. Please resubmit.' },
  { id: 'g5', assessmentId: 'a2', studentId: 'u5', mark: 41, feedback: 'Very concerning result. Come to office hours immediately.' },
  { id: 'g6', assessmentId: 'a5', studentId: 'u5', mark: 35, feedback: 'SQL queries show fundamental misunderstanding.' },
];

export const ATTENDANCE = [
  { id: 'at1', studentId: 'u3', moduleId: 'm1', attended: 18, total: 24, percentage: 75 },
  { id: 'at2', studentId: 'u3', moduleId: 'm2', attended: 22, total: 24, percentage: 91.7 },
  { id: 'at3', studentId: 'u5', moduleId: 'm1', attended: 12, total: 24, percentage: 50 },
  { id: 'at4', studentId: 'u5', moduleId: 'm2', attended: 14, total: 24, percentage: 58.3 },
];

export const RISK_CASES = [
  {
    id: 'rc1', studentId: 'u3', status: 'review', priority: 'medium',
    triggers: ['Low assessment average (58%)', 'Attendance at 75% - near threshold'],
    createdAt: '2025-04-15', assignedTo: 'u4',
    interventions: [
      { id: 'i1', date: '2025-04-16', action: 'Email sent to student', by: 'u4', outcome: 'Student responded, scheduled consultation' },
    ],
    nextFollowUp: '2025-05-01'
  },
  {
    id: 'rc2', studentId: 'u5', status: 'high', priority: 'high',
    triggers: ['Assessment average 34% — below 50% pass mark', 'Attendance at 50% — below 75% threshold', '2 missed assignment deadlines'],
    createdAt: '2025-04-14', assignedTo: 'u4',
    interventions: [
      { id: 'i2', date: '2025-04-14', action: 'Urgent email sent', by: 'u4', outcome: 'Awaiting response' },
    ],
    nextFollowUp: '2025-04-20'
  },
];

export const MESSAGES = [
  {
    id: 'msg1', conversationId: 'conv1', fromId: 'u3', toId: 'u2',
    subject: 'Question about Assignment 2',
    body: 'Good afternoon Prof Dlamini, I am struggling with the tree traversal implementation. Could you point me to some resources?',
    timestamp: '2025-04-20T10:30:00', read: true
  },
  {
    id: 'msg2', conversationId: 'conv1', fromId: 'u2', toId: 'u3',
    subject: 'Re: Question about Assignment 2',
    body: 'Hi Thabo, thank you for reaching out. I recommend reviewing Chapter 7 in the textbook, specifically pages 145-160 on in-order traversal. Also attend the Thursday tutorial session at 14:00 in Lab 3. Let me know if you need further assistance.',
    timestamp: '2025-04-20T14:15:00', read: true
  },
  {
    id: 'msg3', conversationId: 'conv2', fromId: 'u4', toId: 'u3',
    subject: 'Academic Support Check-In',
    body: 'Hi Thabo, I am your assigned student success officer. I noticed your recent assessment results and would like to schedule a consultation to help develop an academic support plan. When are you available this week?',
    timestamp: '2025-04-16T09:00:00', read: false
  },
];

export const NOTIFICATIONS = [
  { id: 'n1', userId: 'u3', type: 'warning', title: 'Assignment Due Soon', body: 'CSC201 Assignment 2 is due in 3 days.', read: false, timestamp: '2025-04-27T08:00:00' },
  { id: 'n2', userId: 'u3', type: 'info', title: 'Grade Posted', body: 'Your CSC202 SQL Project grade has been published.', read: false, timestamp: '2025-04-26T16:30:00' },
  { id: 'n3', userId: 'u3', type: 'danger', title: 'Student Success Alert', body: 'Your academic success officer has sent you a message.', read: false, timestamp: '2025-04-16T09:01:00' },
  { id: 'n4', userId: 'u2', type: 'warning', title: 'At-Risk Student', body: 'Thembi Sithole (ST-1087) has been flagged for immediate review.', read: false, timestamp: '2025-04-14T08:00:00' },
  { id: 'n5', userId: 'u4', type: 'danger', title: 'High Risk Case', body: 'ST-1087 requires urgent intervention.', read: false, timestamp: '2025-04-14T08:01:00' },
];

export const APPLICATIONS = [
  { id: 'app1', name: 'Lungelo Zwane', email: 'lungelo@gmail.com', programme: 'p1', status: 'under_review', submitted: '2025-03-01', docs: ['matric', 'id'], score: 82 },
  { id: 'app2', name: 'Nomvula Kgosi', email: 'nomvula@gmail.com', programme: 'p2', status: 'pending_docs', submitted: '2025-03-05', docs: ['matric'], score: 75 },
  { id: 'app3', name: 'Sipho Mahlangu', email: 'sipho@gmail.com', programme: 'p4', status: 'accepted', submitted: '2025-02-20', docs: ['matric','id','certificates'], score: 91 },
  { id: 'app4', name: 'Precious Moloi', email: 'precious@gmail.com', programme: 'p3', status: 'rejected', submitted: '2025-02-28', docs: ['matric','id'], score: 48 },
];

export const EMAIL_QUEUE = [
  { id: 'eq1', to: 'st1042@unisphere.com', subject: 'Assignment Due Reminder', status: 'delivered', sentAt: '2025-04-27T08:00:00', template: 'assignment_reminder' },
  { id: 'eq2', to: 'st1087@unisphere.com', subject: 'Academic Support Alert', status: 'delivered', sentAt: '2025-04-14T08:01:00', template: 'at_risk_alert' },
  { id: 'eq3', to: 'lungelo@gmail.com', subject: 'Application Under Review', status: 'queued', sentAt: null, template: 'application_status' },
  { id: 'eq4', to: 'nomvula@gmail.com', subject: 'Missing Documents Required', status: 'failed', sentAt: '2025-04-10T10:00:00', template: 'missing_docs', error: 'SMTP timeout', retries: 3 },
];

export const ANNOUNCEMENTS = [
  { id: 'an1', moduleId: 'm1', title: 'Mid-semester test venue change', body: 'The mid-semester test will be held in Hall B, not the lecture theatre. Bring your student card.', postedBy: 'u2', date: '2025-04-08' },
  { id: 'an2', moduleId: 'm2', title: 'Database project extension', body: 'Due to technical difficulties in Lab 4, the SQL project deadline has been extended by 48 hours. New deadline: 22 March 2025.', postedBy: 'u2', date: '2025-03-18' },
];

export const TIMETABLE = [
  { id: 't1', moduleId: 'm1', day: 'Monday', time: '08:00–10:00', room: 'CS Lab 2', type: 'lecture' },
  { id: 't2', moduleId: 'm1', day: 'Wednesday', time: '10:00–12:00', room: 'CS Lab 2', type: 'lecture' },
  { id: 't3', moduleId: 'm1', day: 'Thursday', time: '14:00–16:00', room: 'CS Lab 3', type: 'tutorial' },
  { id: 't4', moduleId: 'm2', day: 'Tuesday', time: '08:00–10:00', room: 'DB Lab 1', type: 'lecture' },
  { id: 't5', moduleId: 'm2', day: 'Friday', time: '10:00–12:00', room: 'DB Lab 1', type: 'lecture' },
  { id: 't6', moduleId: 'm5', day: 'Tuesday', time: '12:00–14:00', room: 'Maths 101', type: 'lecture' },
  { id: 't7', moduleId: 'm5', day: 'Thursday', time: '10:00–12:00', room: 'Maths 101', type: 'tutorial' },
];
