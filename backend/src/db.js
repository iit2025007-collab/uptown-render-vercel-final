import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localDbPath = path.join(__dirname, '..', 'data', 'local-db.json');

const initialData = {
  users: [],
  otps: [],
  carts: [],
  wishlists: [],
  searches: [],
  views: [],
  reviews: [],
  orders: [],
  payments: [],
  addresses: []
};

let mongoDb = null;
let usingMongo = false;

function ensureLocalDb() {
  if (!fs.existsSync(path.dirname(localDbPath))) fs.mkdirSync(path.dirname(localDbPath), { recursive: true });
  if (!fs.existsSync(localDbPath)) fs.writeFileSync(localDbPath, JSON.stringify(initialData, null, 2));
}

function readLocal() {
  ensureLocalDb();
  try {
    const data = JSON.parse(fs.readFileSync(localDbPath, 'utf8'));
    return { ...initialData, ...data };
  } catch {
    fs.writeFileSync(localDbPath, JSON.stringify(initialData, null, 2));
    return { ...initialData };
  }
}

function writeLocal(data) {
  fs.writeFileSync(localDbPath, JSON.stringify(data, null, 2));
}

function publicId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function connectDb() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    ensureLocalDb();
    console.log('Local JSON database ready: backend/data/local-db.json');
    return { mode: 'local-json' };
  }

  const client = new MongoClient(uri);
  await client.connect();
  mongoDb = client.db();
  usingMongo = true;
  console.log('MongoDB connected');

  await Promise.all(['users', 'otps', 'carts', 'wishlists', 'searches', 'views', 'reviews', 'orders', 'payments', 'addresses'].map((name) => mongoDb.collection(name).createIndex({ createdAt: -1 })));
  await mongoDb.collection('users').createIndex({ email: 1 }, { unique: true });
  await mongoDb.collection('otps').createIndex({ email: 1 });
  await mongoDb.collection('carts').createIndex({ userId: 1 }, { unique: true });
  await mongoDb.collection('wishlists').createIndex({ userId: 1 }, { unique: true });
  return { mode: 'mongodb' };
}

export function dbMode() {
  return usingMongo ? 'mongodb' : 'local-json';
}

async function collection(name) {
  if (usingMongo) return mongoDb.collection(name);
  return null;
}

export async function findOne(name, filter) {
  if (usingMongo) return await (await collection(name)).findOne(filter);
  const db = readLocal();
  return db[name].find((item) => Object.entries(filter).every(([key, value]) => item[key] === value)) || null;
}

export async function findMany(name, filter = {}, options = {}) {
  if (usingMongo) {
    let cursor = (await collection(name)).find(filter);
    if (options.sort) cursor = cursor.sort(options.sort);
    if (options.limit) cursor = cursor.limit(options.limit);
    return await cursor.toArray();
  }
  const db = readLocal();
  let rows = db[name].filter((item) => Object.entries(filter).every(([key, value]) => item[key] === value));
  if (options.sort) {
    const [[key, dir]] = Object.entries(options.sort);
    rows = rows.sort((a, b) => dir > 0 ? String(a[key]).localeCompare(String(b[key])) : String(b[key]).localeCompare(String(a[key])));
  }
  if (options.limit) rows = rows.slice(0, options.limit);
  return rows;
}

export async function insertOne(name, doc) {
  const payload = { id: doc.id || publicId(), ...doc, createdAt: doc.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() };
  if (usingMongo) {
    await (await collection(name)).insertOne(payload);
    return payload;
  }
  const db = readLocal();
  db[name].push(payload);
  writeLocal(db);
  return payload;
}

export async function updateOne(name, filter, update, opts = {}) {
  if (usingMongo) {
    const set = update.$set || update;
    const res = await (await collection(name)).findOneAndUpdate(
      filter,
      { $set: { ...set, updatedAt: new Date().toISOString() } },
      { upsert: Boolean(opts.upsert), returnDocument: 'after' }
    );
    return res.value || await findOne(name, filter);
  }
  const db = readLocal();
  const idx = db[name].findIndex((item) => Object.entries(filter).every(([key, value]) => item[key] === value));
  const set = update.$set || update;
  if (idx >= 0) {
    db[name][idx] = { ...db[name][idx], ...set, updatedAt: new Date().toISOString() };
    writeLocal(db);
    return db[name][idx];
  }
  if (opts.upsert) {
    const doc = { id: publicId(), ...filter, ...set, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    db[name].push(doc);
    writeLocal(db);
    return doc;
  }
  return null;
}

export async function deleteMany(name, filter) {
  if (usingMongo) return await (await collection(name)).deleteMany(filter);
  const db = readLocal();
  const before = db[name].length;
  db[name] = db[name].filter((item) => !Object.entries(filter).every(([key, value]) => item[key] === value));
  writeLocal(db);
  return { deletedCount: before - db[name].length };
}

export function newId(prefix = 'id') {
  return `${prefix}_${publicId()}`;
}
