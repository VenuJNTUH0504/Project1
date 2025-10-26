const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // For password hashing
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (css, js, images etc.)
app.use(express.static(path.join(__dirname)));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'venuashok',
    database: 'codepathway'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Route to serve signup.html
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

// Route to serve login.html
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Signup API
app.post('/signup', async (req, res) => {
    try {
        const { username, password, email, fullname, learningPath } = req.body;

        if (!username || !password) {
            return res.status(400).send('Username and password are required');
        }

        // Check if user already exists
        const checkUser = 'SELECT * FROM users WHERE username = ?';
        db.query(checkUser, [username], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Error checking username');
            }

            if (results.length > 0) {
                return res.status(409).send('Username already exists');
            }

            // Check if email already exists
            const checkEmail = 'SELECT * FROM users WHERE email = ?';
            db.query(checkEmail, [email], async (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).send('Error checking email');
                }

                if (results.length > 0) {
                    return res.status(409).send('Email already exists');
                }

                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);

                // Insert user
                const sql = 'INSERT INTO users (username, password, email, fullname, learning_path) VALUES (?, ?, ?, ?, ?)';
                db.query(sql, [username, hashedPassword, email || null, fullname || null, learningPath || null], (err, result) => {
                    if (err) {
                        console.error('Signup error:', err);
                        return res.status(500).send('Error signing up');
                    }

                    res.status(201).send('User signed up successfully!');
                });
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).send('Server error during signup');
    }
});

// Login API
app.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).send('Username and password are required');
        }

        const sql = 'SELECT * FROM users WHERE username = ?';
        db.query(sql, [username], async (err, results) => {
            if (err) {
                console.error('Login error:', err);
                return res.status(500).send('Error during login');
            }

            if (results.length === 0) {
                return res.status(401).send('Invalid credentials');
            }

            const user = results[0];

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                res.status(200).send('Login successful!');
            } else {
                res.status(401).send('Invalid credentials');
            }
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).send('Server error during login');
    }
});

// Check if username exists
app.get('/check-username', (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ error: 'Username parameter is required' });
    }

    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Error checking username' });
        }

        res.json({ exists: results.length > 0 });
    });
});

// Check if email exists
app.get('/check-email', (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: 'Email parameter is required' });
    }

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Error checking email' });
        }

        res.json({ exists: results.length > 0 });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});