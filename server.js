import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';
import { supabase } from './supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const ENTITY_NAMES = new Set([
  'AppUser',
  'Announcement',
  'Assignment',
  'Message',
  'Course',
  'CourseProgress',
  'FormSubmission'
]);

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

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
const upload = multer({ storage });

function ensureEntity(entity) {
  if (!ENTITY_NAMES.has(entity)) {
    const error = new Error(`Entity ${entity} not found`);
    error.status = 404;
    throw error;
  }
}

function makeId(prefix = 'id') {
  return `${prefix}_${randomUUID()}`;
}

function rowToItem(row) {
  return {
    ...(row.data || {}),
    id: row.id,
    created_date: row.created_date,
    ...(row.updated_date ? { updated_date: row.updated_date } : {})
  };
}

function itemToData(item) {
  const { id, created_date, updated_date, ...data } = item;
  return data;
}

function normalizeFilterValue(value) {
  if (typeof value === 'string') {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value.trim() !== '' && !Number.isNaN(Number(value))) return Number(value);
  }
  return value;
}

function valuesMatch(itemValue, criteriaValue) {
  if (Array.isArray(criteriaValue)) {
    return criteriaValue.includes(itemValue);
  }

  const normalizedCriteria = normalizeFilterValue(criteriaValue);
  return itemValue === normalizedCriteria || String(itemValue) === String(criteriaValue);
}

function matchesCriteria(item, criteria) {
  return Object.entries(criteria).every(([key, value]) => {
    if (item[key] === undefined) return false;
    return valuesMatch(item[key], value);
  });
}

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

function applyLimit(items, limitParam) {
  const limit = parseInt(limitParam, 10);
  return Number.isFinite(limit) && limit > 0 ? items.slice(0, limit) : items;
}

async function loadEntityItems(entity) {
  ensureEntity(entity);

  const { data, error } = await supabase
    .from('entity_records')
    .select('id, entity, data, created_date, updated_date')
    .eq('entity', entity);

  if (error) throw error;
  return data.map(rowToItem);
}

function handleRouteError(res, error) {
  console.error(error);
  res.status(error.status || 500).json({ error: error.message || 'Internal server error' });
}

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const host = req.get('host');
  const protocol = req.protocol;
  const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
  res.json({ file_url: fileUrl });
});

app.get('/api/entities/:entity', async (req, res) => {
  try {
    const { entity } = req.params;
    const { _sort, _limit, ...filters } = req.query;

    let items = await loadEntityItems(entity);

    if (Object.keys(filters).length > 0) {
      items = items.filter(item => matchesCriteria(item, filters));
    }

    items = sortItems(items, _sort);
    items = applyLimit(items, _limit);

    res.json(items);
  } catch (error) {
    handleRouteError(res, error);
  }
});

app.post('/api/entities/:entity/filter', async (req, res) => {
  try {
    const { entity } = req.params;
    const { _sort: bodySort, _limit: bodyLimit, ...criteria } = req.body || {};

    let items = await loadEntityItems(entity);

    if (Object.keys(criteria).length > 0) {
      items = items.filter(item => matchesCriteria(item, criteria));
    }

    items = sortItems(items, req.query._sort || bodySort);
    items = applyLimit(items, req.query._limit || bodyLimit);

    res.json(items);
  } catch (error) {
    handleRouteError(res, error);
  }
});

app.get('/api/entities/:entity/:id', async (req, res) => {
  try {
    const { entity, id } = req.params;
    ensureEntity(entity);

    const { data, error } = await supabase
      .from('entity_records')
      .select('id, entity, data, created_date, updated_date')
      .eq('entity', entity)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Item not found' });

    res.json(rowToItem(data));
  } catch (error) {
    handleRouteError(res, error);
  }
});

app.post('/api/entities/:entity', async (req, res) => {
  try {
    const { entity } = req.params;
    ensureEntity(entity);

    const createdDate = new Date().toISOString();
    const newItem = {
      ...req.body,
      id: makeId(entity === 'FormSubmission' ? 'fs' : 'id'),
      created_date: createdDate
    };

    const { data, error } = await supabase
      .from('entity_records')
      .insert({
        entity,
        id: newItem.id,
        data: itemToData(newItem),
        created_date: createdDate
      })
      .select('id, entity, data, created_date, updated_date')
      .single();

    if (error) throw error;
    res.status(201).json(rowToItem(data));
  } catch (error) {
    handleRouteError(res, error);
  }
});

app.put('/api/entities/:entity/:id', async (req, res) => {
  try {
    const { entity, id } = req.params;
    ensureEntity(entity);

    const { data: existing, error: getError } = await supabase
      .from('entity_records')
      .select('id, entity, data, created_date, updated_date')
      .eq('entity', entity)
      .eq('id', id)
      .maybeSingle();

    if (getError) throw getError;
    if (!existing) return res.status(404).json({ error: 'Item not found' });

    const updatedDate = new Date().toISOString();
    const updatedItem = {
      ...rowToItem(existing),
      ...req.body,
      id,
      updated_date: updatedDate
    };

    const { data, error } = await supabase
      .from('entity_records')
      .update({
        data: itemToData(updatedItem),
        updated_date: updatedDate
      })
      .eq('entity', entity)
      .eq('id', id)
      .select('id, entity, data, created_date, updated_date')
      .single();

    if (error) throw error;
    res.json(rowToItem(data));
  } catch (error) {
    handleRouteError(res, error);
  }
});

app.delete('/api/entities/:entity/:id', async (req, res) => {
  try {
    const { entity, id } = req.params;
    ensureEntity(entity);

    const { data, error } = await supabase
      .from('entity_records')
      .delete()
      .eq('entity', entity)
      .eq('id', id)
      .select('id');

    if (error) throw error;
    if (data.length === 0) return res.status(404).json({ error: 'Item not found' });

    res.json({ success: true });
  } catch (error) {
    handleRouteError(res, error);
  }
});

app.post('/api/entities/:entity/deleteMany', async (req, res) => {
  try {
    const { entity } = req.params;
    const criteria = req.body || {};
    const items = await loadEntityItems(entity);
    const ids = items.filter(item => matchesCriteria(item, criteria)).map(item => item.id);

    if (ids.length === 0) {
      return res.json({ success: true, deleted: 0 });
    }

    const { error } = await supabase
      .from('entity_records')
      .delete()
      .eq('entity', entity)
      .in('id', ids);

    if (error) throw error;
    res.json({ success: true, deleted: ids.length });
  } catch (error) {
    handleRouteError(res, error);
  }
});

app.post('/api/webhook/google-form', async (req, res) => {
  try {
    const data = req.body;
    if (!data || !data.email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const existing = await loadEntityItems('FormSubmission');
    const matchingIds = existing
      .filter(submission => submission.email?.toLowerCase() === data.email.toLowerCase())
      .map(submission => submission.id);

    if (matchingIds.length > 0) {
      const { error } = await supabase
        .from('entity_records')
        .delete()
        .eq('entity', 'FormSubmission')
        .in('id', matchingIds);

      if (error) throw error;
    }

    const createdDate = new Date().toISOString();
    const submission = {
      id: makeId('fs'),
      created_date: createdDate,
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
      resume_url: data.resume_url || ''
    };

    const { error } = await supabase
      .from('entity_records')
      .insert({
        entity: 'FormSubmission',
        id: submission.id,
        data: itemToData(submission),
        created_date: createdDate
      });

    if (error) throw error;

    console.log(`[Webhook] Google Form submission saved for: ${submission.email}`);
    res.status(201).json({ success: true, id: submission.id });
  } catch (error) {
    handleRouteError(res, error);
  }
});

app.get('/api/health', async (req, res) => {
  const { error } = await supabase
    .from('entity_records')
    .select('id', { count: 'exact', head: true });

  res.status(error ? 500 : 200).json({ ok: !error, error: error?.message });
});

app.listen(PORT, () => {
  console.log(`Custom backend listening on port ${PORT}`);
});
