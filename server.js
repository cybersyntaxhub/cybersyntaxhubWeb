import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Set up uploads directory static serving
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Database file setup
const DB_FILE = path.join(__dirname, 'database.json');

function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    const initial = {
      AppUser: [],
      Announcement: [],
      Assignment: [],
      Message: [],
      Course: [],
      CourseProgress: [],
      FormSubmission: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (e) {
    console.error('Error reading database.json, resetting database', e);
    const initial = {
      AppUser: [],
      Announcement: [],
      Assignment: [],
      Message: [],
      Course: [],
      CourseProgress: [],
      FormSubmission: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Multer storage setup for uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage: storage });

// Upload Endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const host = req.get('host');
  const protocol = req.protocol;
  const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
  res.json({ file_url: fileUrl });
});

// Helper: sort array of objects
function sortItems(items, sortParam) {
  if (!sortParam) return items;
  const isDesc = sortParam.startsWith('-');
  const field = isDesc ? sortParam.slice(1) : sortParam;

  return [...items].sort((a, b) => {
    let valA = a[field];
    let valB = b[field];

    if (field.includes('date') || field === 'created_date' || field === 'due_date') {
      valA = valA ? new Date(valA) : new Date(0);
      valB = valB ? new Date(valB) : new Date(0);
    }

    if (valA < valB) return isDesc ? 1 : -1;
    if (valA > valB) return isDesc ? -1 : 1;
    return 0;
  });
}

// Generic CRUD endpoints

// 1. Get all with sorting, limit, and query parameters filtering
app.get('/api/entities/:entity', (req, res) => {
  const { entity } = req.params;
  const db = readDB();
  if (!db[entity]) {
    return res.status(404).json({ error: `Entity ${entity} not found` });
  }

  let items = db[entity];

  // Apply filters from query string (except _sort, _limit)
  const filters = {};
  Object.entries(req.query).forEach(([key, val]) => {
    if (key !== '_sort' && key !== '_limit') {
      filters[key] = val;
    }
  });

  if (Object.keys(filters).length > 0) {
    items = items.filter(item => {
      return Object.entries(filters).every(([key, val]) => {
        if (item[key] === undefined) return false;
        if (typeof item[key] === 'boolean') {
          return String(item[key]) === val;
        }
        if (typeof item[key] === 'number') {
          return Number(item[key]) === Number(val);
        }
        return String(item[key]) === val;
      });
    });
  }

  const sort = req.query._sort;
  const limit = parseInt(req.query._limit, 10);

  items = sortItems(items, sort);
  if (limit) {
    items = items.slice(0, limit);
  }

  res.json(items);
});

// 2. Filter list by criteria using POST (for more complex queries)
app.post('/api/entities/:entity/filter', (req, res) => {
  const { entity } = req.params;
  const db = readDB();
  if (!db[entity]) {
    return res.status(404).json({ error: `Entity ${entity} not found` });
  }

  let items = db[entity];
  const { _sort, _limit, ...criteria } = req.body || {};

  items = items.filter(item => {
    return Object.entries(criteria).every(([key, value]) => {
      if (item[key] === undefined) return false;
      if (Array.isArray(value)) {
        return value.includes(item[key]);
      }
      return item[key] === value;
    });
  });

  const sort = req.query._sort || _sort;
  const limit = parseInt(req.query._limit || _limit, 10);

  items = sortItems(items, sort);
  if (limit) {
    items = items.slice(0, limit);
  }

  res.json(items);
});

// 3. Get single item by ID
app.get('/api/entities/:entity/:id', (req, res) => {
  const { entity, id } = req.params;
  const db = readDB();
  if (!db[entity]) {
    return res.status(404).json({ error: `Entity ${entity} not found` });
  }

  const item = db[entity].find(item => item.id === id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  res.json(item);
});

// 4. Create new item
app.post('/api/entities/:entity', (req, res) => {
  const { entity } = req.params;
  const db = readDB();
  if (!db[entity]) {
    return res.status(404).json({ error: `Entity ${entity} not found` });
  }

  const newItem = {
    ...req.body,
    id: 'id_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString().slice(-4),
    created_date: new Date().toISOString()
  };

  db[entity].push(newItem);
  writeDB(db);
  res.status(201).json(newItem);
});

// 5. Update item
app.put('/api/entities/:entity/:id', (req, res) => {
  const { entity, id } = req.params;
  const db = readDB();
  if (!db[entity]) {
    return res.status(404).json({ error: `Entity ${entity} not found` });
  }

  const index = db[entity].findIndex(item => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const updatedItem = {
    ...db[entity][index],
    ...req.body,
    updated_date: new Date().toISOString()
  };

  db[entity][index] = updatedItem;
  writeDB(db);
  res.json(updatedItem);
});

// 6. Delete single item
app.delete('/api/entities/:entity/:id', (req, res) => {
  const { entity, id } = req.params;
  const db = readDB();
  if (!db[entity]) {
    return res.status(404).json({ error: `Entity ${entity} not found` });
  }

  const index = db[entity].findIndex(item => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  db[entity].splice(index, 1);
  writeDB(db);
  res.json({ success: true });
});

// 7. Delete multiple items matching a criteria
app.post('/api/entities/:entity/deleteMany', (req, res) => {
  const { entity } = req.params;
  const db = readDB();
  if (!db[entity]) {
    return res.status(404).json({ error: `Entity ${entity} not found` });
  }

  const criteria = req.body || {};
  let removedCount = 0;

  db[entity] = db[entity].filter(item => {
    const matches = Object.entries(criteria).every(([key, value]) => {
      return item[key] === value;
    });
    if (matches) {
      removedCount++;
    }
    return !matches;
  });

  writeDB(db);
  res.json({ success: true, deleted: removedCount });
});

// Google Form Webhook endpoint
app.post('/api/webhook/google-form', (req, res) => {
  const db = readDB();
  if (!db.FormSubmission) {
    db.FormSubmission = [];
  }

  const data = req.body;
  if (!data || !data.email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Remove any existing submission with the same email (dedup)
  db.FormSubmission = db.FormSubmission.filter(
    s => s.email.toLowerCase() !== data.email.toLowerCase()
  );

  // Map Google Form fields to our schema
  const submission = {
    id: 'fs_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString().slice(-4),
    created_date: new Date().toISOString(),
    email: data.email,
    full_name: data.name || data.full_name || '',
    address: data.address || '',
    phone: data.phone || data.phone_number || '',
    grade: data.grade || data.current_grade || '',
    school: data.school || data.institution || '',
    country: data.country || '',
    linkedin_url: data.linkedin || data.linkedin_url || '',
    referral_source: data.referral_source || data.how_did_you_hear || '',
    preferred_track: data.preferred_track || '',
    interests: data.interests || data.what_excites_you || '',
    bio: data.bio || data.tell_us_about_yourself || '',
    goals: data.goals || data.why_good_fit || '',
    resume_url: data.resume_url || '',
  };

  db.FormSubmission.push(submission);
  writeDB(db);

  console.log(`[Webhook] Google Form submission saved for: ${submission.email}`);
  res.status(201).json({ success: true, id: submission.id });
});

app.listen(PORT, () => {
  console.log(`Custom backend listening on port ${PORT}`);
});
