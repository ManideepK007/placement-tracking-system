const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors({
    origin: 'http://localhost:5173', // Allow your React app
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false 
    }
});

// Database connection check
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Connected to Render PostgreSQL successfully! 🚀');
    release();
});

app.get('/', (req, res) => {
    res.send('Placement Tracker API is running...');
});

// --- GET ALL APPLICATIONS ---
app.get('/api/applications', async (req, res) => {
    // 1. Define the SQL query as a variable
    const sqlQuery = `
        SELECT a.*, s.full_name 
        FROM applications a 
        JOIN students s ON a.student_id = s.id
        ORDER BY a.applied_date DESC
    `;

    try {
        console.log("Executing Query:", sqlQuery);
        const result = await pool.query(sqlQuery);
        
        // 2. Send the response inside the try block
        res.json(result.rows);
    } catch (err) {
        console.error("DATABASE ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// --- CREATE NEW APPLICATION ---
app.post('/api/applications', async (req, res) => {
    const { student_id, company_name, job_role, status, location } = req.body;
    
    try {
        // 1. Insert the new application
        const insertQuery = `
            INSERT INTO applications (student_id, company_name, job_role, status, location)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const values = [student_id, company_name, job_role, status, location || 'Remote'];
        const newAppResult = await pool.query(insertQuery, values);

        // 2. Fetch the newly created record with the student's name joined
        const fetchQuery = `
            SELECT a.*, s.full_name 
            FROM applications a
            JOIN students s ON a.student_id = s.id
            WHERE a.id = $1
        `;
        const finalResult = await pool.query(fetchQuery, [newAppResult.rows[0].id]);
        
        res.status(201).json(finalResult.rows[0]);
    } catch (err) {
        console.error("SERVER POST ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// Add this to your server.js
app.delete('/api/applications/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleteQuery = 'DELETE FROM applications WHERE id = $1';
        await pool.query(deleteQuery, [id]);
        
        res.status(200).json({ message: "Application deleted successfully" });
    } catch (err) {
        console.error("DELETE ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});
// Add this to server.js if it's missing
app.delete('/api/applications/:id', async (req, res) => {
    const { id } = req.params; // This gets the ID from the URL
    console.log("Attempting to delete ID:", id); // Check your terminal for this!

    try {
        const deleteQuery = 'DELETE FROM applications WHERE id = $1';
        const result = await pool.query(deleteQuery, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Application not found" });
        }

        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        console.error("DELETE ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});