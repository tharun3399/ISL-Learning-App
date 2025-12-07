// server.js
require('dotenv').config();
const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-this';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// PostgreSQL client (adjust via env or edit directly)
const con = new Client({
  host: process.env.PGHOST || "localhost",
  port: process.env.PGPORT || "3133",
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "T@a3?n5#",
  database: process.env.PGDATABASE || "demodb"
});

app.use(cors({
  origin: FRONTEND,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// connect DB
async function start() {
  await con.connect();
  console.log('Postgres connected');

  // Ensure required columns exist (safe migrations)
  try {
    // Add columns if they do not exist
    await con.query(`
      ALTER TABLE demotable
      ADD COLUMN IF NOT EXISTS email VARCHAR(255),
      ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
      ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
    `);

    // Ensure email uniqueness via unique index (IF NOT EXISTS)
    await con.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS demotable_email_idx ON demotable(email);
    `);

    console.log('Schema checked/updated (email, phone, password_hash)');
  } catch (err) {
    console.error('Schema migration error:', err);
  }

  app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// ---------- Helpers ----------
const SALT_ROUNDS = 10;
async function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

// Read token from header or cookie
function getTokenFromReq(req) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) return authHeader.slice(7);
  if (req.cookies && req.cookies.token) return req.cookies.token;
  return null;
}

// Auth middleware
function authenticateToken(req, res, next) {
  const token = getTokenFromReq(req);
  if (!token) return res.status(401).json({ message: 'Missing token' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid or expired token' });
    req.user = decoded;
    next();
  });
}

// ---------- Routes ----------

// GET all users (non-sensitive fields)
app.get('/', async (req, res) => {
  try {
    const q = 'SELECT name, email, phone FROM demotable ORDER BY email';
    const r = await con.query(q);
    return res.json(r.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Database error' });
  }
});

// Register route
app.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });

    // Check existing user
    const exists = await con.query('SELECT email FROM demotable WHERE email=$1', [email]);
    if (exists.rows.length) return res.status(409).json({ message: 'User already exists' });

    const passwordHash = await hashPassword(password);

    const insertQ = `
      INSERT INTO demotable (name, email, phone, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING name, email;
    `;
    const result = await con.query(insertQ, [name, email, phone || null, passwordHash]);
    return res.status(201).json({ message: 'User created', user: result.rows[0] });
  } catch (err) {
    // handle unique-constraint race
    if (err.code === '23505') return res.status(409).json({ message: 'User already exists' });
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    const q = 'SELECT name, email, phone, password_hash FROM demotable WHERE email=$1';
    const r = await con.query(q, [email]);
    if (!r.rows.length) return res.status(401).json({ message: 'Invalid credentials' });

    const user = r.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash || '');
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = { email: user.email, name: user.name };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Set httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,      // set true in production (HTTPS)
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000
    });

    // Return minimal user info
    return res.json({ message: 'Logged in', user: payload });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Protected route example
app.get('/profile', authenticateToken, (req, res) => {
  // req.user is token payload (email, name)
  res.json({ message: 'Protected profile', user: req.user });
});

// Logout
app.post('/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
  res.json({ message: 'Logged out' });
});
// Fallback route