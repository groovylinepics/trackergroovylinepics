const express = require('express');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'groovylinepics-secret-change-this';

// --- PASSWORD SETUP ---
// Set your password via environment variable: ADMIN_PASSWORD=yourpassword
// Default password for first run: groovy123 (change this!)
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'groovy123', 10);

// --- DATABASE ---
const db = new Database(process.env.DB_PATH || './concerts.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS concerts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT,
    date TEXT NOT NULL,
    time TEXT,
    venue TEXT NOT NULL,
    contact TEXT,
    email TEXT,
    notes TEXT,
    status TEXT DEFAULT 'waiting',
    on_website INTEGER DEFAULT 0,
    created_at TEXT
  )
`);

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Auth middleware
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// --- AUTH ROUTES ---
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (!password || !bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
    return res.status(401).json({ error: 'Wrong password' });
  }
  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token });
});

app.get('/api/verify', auth, (req, res) => {
  res.json({ ok: true });
});

// --- CONCERT ROUTES ---

// GET all concerts
app.get('/api/concerts', auth, (req, res) => {
  const rows = db.prepare('SELECT * FROM concerts ORDER BY date ASC').all();
  res.json(rows.map(dbToObj));
});

// POST new concert
app.post('/api/concerts', auth, (req, res) => {
  const c = req.body;
  db.prepare(`
    INSERT INTO concerts (id, name, type, date, time, venue, contact, email, notes, status, on_website, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(c.id, c.name, c.type, c.date, c.time || '', c.venue, c.contact || '', c.email || '', c.notes || '', c.status || 'waiting', c.onWebsite ? 1 : 0, c.createdAt || new Date().toISOString());
  res.json({ ok: true });
});

// PUT update concert
app.put('/api/concerts/:id', auth, (req, res) => {
  const c = req.body;
  db.prepare(`
    UPDATE concerts SET name=?, type=?, date=?, time=?, venue=?, contact=?, email=?, notes=?, status=?, on_website=?
    WHERE id=?
  `).run(c.name, c.type, c.date, c.time || '', c.venue, c.contact || '', c.email || '', c.notes || '', c.status, c.onWebsite ? 1 : 0, req.params.id);
  res.json({ ok: true });
});

// DELETE concert
app.delete('/api/concerts/:id', auth, (req, res) => {
  db.prepare('DELETE FROM concerts WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- HELPERS ---
function dbToObj(row) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    date: row.date,
    time: row.time,
    venue: row.venue,
    contact: row.contact,
    email: row.email,
    notes: row.notes,
    status: row.status,
    onWebsite: row.on_website === 1,
    createdAt: row.created_at
  };
}

app.listen(PORT, () => console.log(`Groovylinepics server running on port ${PORT}`));
