// server.js
require('dotenv').config();
const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND = process.env.FRONTEND_ORIGIN || 'http://localhost:5174';
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

// CORS configuration - allow multiple frontend ports
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:3000',
      process.env.FRONTEND_ORIGIN
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// connect DB
async function start() {
  await con.connect();
  console.log('Postgres connected');

  // Ensure required columns exist (safe migrations)
  try {
    // Add columns if they do not exist
    await con.query(`
      ALTER TABLE UserInfo
      ADD COLUMN IF NOT EXISTS email VARCHAR(255),
      ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
      ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
    `);

    // Ensure email uniqueness via unique index (IF NOT EXISTS)
    await con.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS UserInfo_email_idx ON UserInfo(email);
    `);

    console.log('Schema checked/updated (email, phone, password_hash)');
  } catch (err) {
    console.error('Schema migration error:', err);
  }

  app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
}

// ---------- Helpers ----------
const SALT_ROUNDS = 10;

// Input validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (pwd) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  return pwdRegex.test(pwd);
};

const validatePhone = (phone) => {
  if (!phone) return true; // phone is optional
  const phoneRegex = /^\+?[0-9]{8,15}$/;
  return phoneRegex.test(phone);
};

const validateName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 100;
};

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
    if (err) {
      const errorMsg = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
      return res.status(401).json({ message: errorMsg });
    }
    req.user = decoded;
    next();
  });
}

// Rate limiting middleware
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 attempts per window (increased for development/testing)
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 registration attempts per hour per IP
  message: 'Too many registration attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// ---------- Routes ----------

// GET all users (non-sensitive fields)
app.get('/', async (req, res) => {
  try {
    const q = 'SELECT name, email, phone FROM UserInfo ORDER BY email';
    const r = await con.query(q);
    return res.json(r.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Database error' });
  }
});

// Register route
app.post('/register', registerLimiter, async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword, isGoogleAuth, googleId, googlePicture } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields: name, email, password' });
    }

    if (!validateName(name)) {
      return res.status(400).json({ message: 'Name must be 2-100 characters' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // For Google auth, password validation is optional (using Google ID)
    if (!isGoogleAuth && !validatePassword(password)) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&)' 
      });
    }

    if (!isGoogleAuth && password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (phone && !validatePhone(phone)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    // Check existing user
    const exists = await con.query('SELECT email FROM UserInfo WHERE email=$1', [email.toLowerCase()]);
    if (exists.rows.length) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }

    const passwordHash = await hashPassword(password || googleId);

    // Add columns for Google auth if using Google
    if (isGoogleAuth) {
      try {
        await con.query(`
          ALTER TABLE UserInfo
          ADD COLUMN IF NOT EXISTS google_id VARCHAR(255),
          ADD COLUMN IF NOT EXISTS is_google_auth BOOLEAN DEFAULT false,
          ADD COLUMN IF NOT EXISTS profile_picture VARCHAR(500);
        `);
      } catch (err) {
        console.log('Schema update skipped (columns may already exist)');
      }
    }

    const insertQ = `
      INSERT INTO UserInfo (name, email, phone, password_hash, google_id, is_google_auth, profile_picture)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING name, email, phone;
    `;
    const result = await con.query(insertQ, [
      name.trim(),
      email.toLowerCase(),
      phone || null,
      passwordHash,
      googleId || null,
      isGoogleAuth || false,
      googlePicture || null
    ]);
    return res.status(201).json({ message: 'User created successfully', user: result.rows[0] });
  } catch (err) {
    // handle unique-constraint race condition
    if (err.code === '23505') {
      return res.status(409).json({ message: 'User already exists with this email' });
    }
    console.error('Registration error:', err);
    return res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login route
app.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password, google_id, is_google_auth } = req.body;

    // Google authentication flow
    if (is_google_auth && google_id) {
      if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      // Check if user exists with google_id or email
      const q = 'SELECT name, email, phone, google_id, is_google_auth, profile_picture FROM UserInfo WHERE email=$1 OR google_id=$2';
      const r = await con.query(q, [email.toLowerCase(), google_id]);
      
      if (!r.rows.length) {
        return res.status(401).json({ message: 'No account found with this Google email. Please register first.' });
      }

      const user = r.rows[0];
      
      // Verify google_id matches if account was created with Google
      if (user.is_google_auth && user.google_id !== google_id) {
        return res.status(401).json({ message: 'Google account mismatch' });
      }

      const payload = { email: user.email, name: user.name, phone: user.phone };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000
      });

      return res.json({ message: 'Logged in successfully with Google', user: payload });
    }

    // Email/password authentication flow
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const q = 'SELECT name, email, phone, password_hash FROM UserInfo WHERE email=$1';
    const r = await con.query(q, [email.toLowerCase()]);
    if (!r.rows.length) {
      // Don't reveal if email exists (security best practice)
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = r.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash || '');
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = { email: user.email, name: user.name, phone: user.phone };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Set httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true only in production
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    // Return user info
    return res.json({ message: 'Logged in successfully', user: payload });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

// Protected route example
app.get('/profile', authenticateToken, async (req, res) => {
  try {
    // Fetch fresh user data from database instead of just token payload
    const q = 'SELECT name, email, phone FROM UserInfo WHERE email=$1';
    const r = await con.query(q, [req.user.email]);
    
    if (!r.rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile retrieved', user: r.rows[0] });
  } catch (err) {
    console.error('Profile fetch error:', err);
    return res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// Logout
app.post('/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
  res.json({ message: 'Logged out' });
});

// Update profile - PUT endpoint
app.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, mobile, role } = req.body;
    const userEmail = req.user.email;

    // Validate input
    if (!name || !email || !mobile) {
      return res.status(400).json({ message: 'Name, email, and mobile are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate phone format
    if (!/^\+?[0-9]{8,15}$/.test(mobile)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    // Check if new email already exists (if email was changed)
    if (email !== userEmail) {
      const emailExists = await con.query('SELECT id FROM UserInfo WHERE email=$1', [email]);
      if (emailExists.rows.length > 0) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Update user in database
    const q = 'UPDATE UserInfo SET name=$1, email=$2, phone=$3 WHERE email=$4 RETURNING name, email, phone';
    const result = await con.query(q, [name, email, mobile, userEmail]);

    if (!result.rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = result.rows[0];
    
    // If email changed, issue new token with updated email
    if (email !== userEmail) {
      const payload = { email: updatedUser.email, name: updatedUser.name, phone: updatedUser.phone };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000
      });
    }

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ message: 'Server error updating profile' });
  }
});

// Start server
start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Fallback route