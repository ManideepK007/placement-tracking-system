const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const initQuery = `
-- 1. Wipe old tables to ensure the new UNIQUE rules apply
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS students CASCADE;

-- 2. Create Users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'student'
);

-- 3. Create Students (The UNIQUE keyword here is the fix)
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    batch_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Applications
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    company_name VARCHAR(100) NOT NULL,
    job_role VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Applied',
    location VARCHAR(100) DEFAULT 'Remote',
    applied_date DATE DEFAULT CURRENT_DATE
);

-- 5. Insert Test Data
INSERT INTO users (id, username, email, password_hash, role) 
VALUES (1, 'mahi_dev', 'mahesh@example.com', 'hashed_password01', 'student') 
ON CONFLICT (id) DO NOTHING;

-- This will now work because 'user_id' was marked UNIQUE in step 3
INSERT INTO students (user_id, full_name, batch_name) 
VALUES (1, 'Mahesh', '2026 Batch')
ON CONFLICT (user_id) 
DO UPDATE SET full_name = EXCLUDED.full_name;

INSERT INTO applications (student_id, company_name, job_role, status, location) 
VALUES (1, 'Sample Corp', 'Full Stack Dev', 'Applied', 'Hyderabad');
`;

const runInit = async () => {
    try {
        await pool.query(initQuery);
        console.log("Database initialized successfully! 🎯");
        console.log("Check localhost:5000/api/applications to see 'Mahesh' now.");
        process.exit();
    } catch (err) {
        console.error("Init Error:", err.message);
        process.exit(1);
    }
};

runInit();