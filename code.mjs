import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const app = express();
const PORT = 3000;

// For ES modules __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files (like signup-success.html, login-success.html, etc.)

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'venuashok',
  database: 'codepathway'
});
db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL');
});

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { fullname, email, password, learningPath } = req.body;
  if (!fullname || !email || !password || !learningPath) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  db.query('SELECT 1 FROM users WHERE email = ?', [email], async (err, results) => {
    if (results && results.length > 0) return res.status(400).json({ error: 'Email already registered' });
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      db.query(
        'INSERT INTO users (fullname, email, password, learning_path) VALUES (?, ?, ?, ?)',
        [fullname, email, hashedPassword, learningPath],
        err => {
          if (err) return res.status(500).json({ error: 'Error saving user' });

          // Redirect to signup-success.html
          res.json({ redirectUrl: 'signup-success.html' });
        }
      );
    } catch (e) {
      return res.status(500).json({ error: 'Error saving user' });
    }
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('MySQL error during login:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!results || results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = results[0];
    bcrypt.compare(password, user.password, (err, match) => {
      if (err) {
        console.error('Bcrypt error during login:', err);
        return res.status(500).json({ error: 'Error checking password' });
      }
      if (!match) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      // Redirect to login-success.html
      res.json({ redirectUrl: 'login-success.html', user });
    });
  });
});

// Piston API endpoint
const PISTON_URL = 'https://emkc.org/api/v2/piston/execute';

// Supported languages mapping for Piston
const pistonLangMap = {
  'c++': 'cpp',
  'cpp': 'cpp',
  'java': 'java',
  'javascript': 'javascript',
  'js': 'javascript',
  'python': 'python3',
  'py': 'python3',
  'golang': 'go',
  'go': 'go',
  'typescript': 'typescript',
  'ts': 'typescript'
};

// Code execution endpoint
app.post('/execute', async (req, res) => {
  const { language, code, stdin } = req.body;
  const pistonLang = pistonLangMap[language?.toLowerCase()];
  if (!pistonLang) {
    return res.status(400).json({ output: 'Language not supported.' });
  }
  try {
    const response = await axios.post(PISTON_URL, {
      language: pistonLang,
      version: '*', // Use latest version
      files: [{ name: 'main', content: code }],
      stdin: stdin || ''
    });
    const { run } = response.data;
    let output = '';
    if (run.stdout) output += run.stdout;
    if (run.stderr) output += run.stderr;
    res.json({ output });
  } catch (err) {
    res.json({ output: 'Error executing code: ' + (err.response?.data?.message || err.message) });
  }
});

// Serve signup-success.html and login-success.html directly
app.get('/signup-success.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup-success.html'));
});
app.get('/login-success.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'login-success.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});