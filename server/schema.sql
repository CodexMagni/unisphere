-- UniSphere PostgreSQL Database Schema for Neon

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    student_email VARCHAR(255),
    personal_email VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    avatar VARCHAR(10),
    faculty VARCHAR(255),
    student_id VARCHAR(50),
    programme VARCHAR(255),
    year INTEGER,
    phone VARCHAR(50),
    id_number VARCHAR(50),
    date_of_birth VARCHAR(50),
    address TEXT,
    study_mode VARCHAR(50) DEFAULT 'Full-time',
    documents JSONB DEFAULT '[]'::jsonb,
    modules JSONB DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS programmes (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(20),
    name VARCHAR(255) NOT NULL,
    faculty VARCHAR(255) NOT NULL,
    years INTEGER NOT NULL,
    credits INTEGER NOT NULL,
    nqf INTEGER NOT NULL,
    fee NUMERIC(10, 2) NOT NULL,
    description TEXT,
    full_description TEXT,
    career_opportunities JSONB DEFAULT '[]'::jsonb,
    requirements JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS modules (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    credits INTEGER NOT NULL,
    semester INTEGER NOT NULL,
    year INTEGER NOT NULL,
    programme_id VARCHAR(50),
    lecturer_id VARCHAR(50),
    capacity INTEGER NOT NULL,
    enrolled INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS enrolments (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    module_id VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS assessments (
    id VARCHAR(50) PRIMARY KEY,
    module_id VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    due_date VARCHAR(50) NOT NULL,
    total_marks INTEGER NOT NULL,
    weight INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS grades (
    id VARCHAR(50) PRIMARY KEY,
    assessment_id VARCHAR(50) NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    mark NUMERIC(5, 2) NOT NULL,
    feedback TEXT
);

CREATE TABLE IF NOT EXISTS attendance (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    module_id VARCHAR(50) NOT NULL,
    attended INTEGER NOT NULL,
    total INTEGER NOT NULL,
    percentage NUMERIC(5, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS risk_cases (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    triggers JSONB DEFAULT '[]'::jsonb,
    created_at VARCHAR(50) NOT NULL,
    assigned_to VARCHAR(50),
    interventions JSONB DEFAULT '[]'::jsonb,
    next_follow_up VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(50) PRIMARY KEY,
    conversation_id VARCHAR(50) NOT NULL,
    from_id VARCHAR(50) NOT NULL,
    to_id VARCHAR(50) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    timestamp VARCHAR(50) NOT NULL,
    read BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    timestamp VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    programme VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    submitted VARCHAR(50) NOT NULL,
    docs JSONB DEFAULT '[]'::jsonb,
    score INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS email_queue (
    id VARCHAR(50) PRIMARY KEY,
    recipient VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    sent_at VARCHAR(50),
    template VARCHAR(100),
    error TEXT,
    retries INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS announcements (
    id VARCHAR(50) PRIMARY KEY,
    module_id VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    posted_by VARCHAR(50) NOT NULL,
    date VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS timetable (
    id VARCHAR(50) PRIMARY KEY,
    module_id VARCHAR(50) NOT NULL,
    day VARCHAR(50) NOT NULL,
    time VARCHAR(50) NOT NULL,
    room VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL
);
