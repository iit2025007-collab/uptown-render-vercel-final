import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { OAuth2Client } from 'google-auth-library';
import { connectDb, dbMode, findOne, findMany, insertOne, updateOne, deleteMany, newId } from './db.js';
import { sendOtpEmail } from './mailer.js';
import { authRequired, makeToken } from './auth.js';
import { categories, listProducts, getProductById, relatedProducts } from './products.js';

const app = express();
const PORT = process.env.PORT || 4000;
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

function normalizeOrigin(value = '') {
  return String(value).trim().replace(/\/+$/, '');
}

function splitOrigins(value = '') {
  return String(value)
    .split(',')
    .map((item) => normalizeOrigin(item))
    .filter(Boolean);
}

const allowedOrigins = new Set([
  ...splitOrigins(clientUrl),
  ...splitOrigins(process.env.CLIENT_URLS || ''),
  'http://localhost:5173',
  'http://127.0.0.1:5173'
]);

function isVercelOrigin(origin) {
  return /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);
}

app.use(express.json({ limit: '12mb' }));
app.use(cors({
  credentials: true,
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    const normalizedOrigin = normalizeOrigin(origin);
    if (allowedOrigins.has(normalizedOrigin)) return callback(null, true);
    if (process.env.ALLOW_VERCEL_PREVIEWS !== 'false' && isVercelOrigin(normalizedOrigin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  }
}));

function cleanUser(user) {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}

function otpCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function normalizeEmail(email = '') {
  return String(email).trim().toLowerCase();
}

function requireFields(res, fields) {
  for (const [name, value] of Object.entries(fields)) {
    if (!value) {
      res.status(400).json({ message: `${name} is required.` });
      return false;
    }
  }
  return true;
}

async function createAndSendOtp(email) {
  const code = otpCode();
  const codeHash = await bcrypt.hash(code, 8);
  await deleteMany('otps', { email });
  await insertOne('otps', {
    id: newId('otp'),
    email,
    codeHash,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    used: false
  });
  return await sendOtpEmail(email, code);
}

app.get('/', (_, res) => res.json({ app: 'Uptown API', ok: true }));

app.get('/api/health', async (_, res) => {
  res.json({ ok: true, app: 'Uptown API', database: dbMode(), time: new Date().toISOString() });
});

app.post('/api/auth/start', async (req, res) => {
  try {
    const mode = req.body.mode === 'signup' ? 'signup' : 'login';
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || '');
    const name = String(req.body.name || '').trim();
    if (!requireFields(res, { email, password })) return;
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' });

    let user = await findOne('users', { email });

    if (mode === 'signup') {
      if (user) return res.status(409).json({ message: 'An account already exists. Please log in.' });
      const passwordHash = await bcrypt.hash(password, 10);
      user = await insertOne('users', {
        id: newId('user'),
        name: name || email.split('@')[0],
        email,
        passwordHash,
        authProvider: 'email',
        emailVerified: false
      });
      const emailResult = await createAndSendOtp(email);
      return res.json({ message: emailResult.sent ? 'OTP sent to your email.' : 'OTP created. Check the backend terminal in local test mode.', email });
    } else {
      if (!user || !user.passwordHash) return res.status(404).json({ message: 'No account found. Please sign up first.' });
      const okPassword = await bcrypt.compare(password, user.passwordHash);
      if (!okPassword) return res.status(401).json({ message: 'Incorrect password.' });
      
      user = await updateOne('users', { email }, { lastLoginAt: new Date().toISOString() }, { upsert: false });
      return res.json({ token: makeToken(user), user: cleanUser(user) });
    }
  } catch (err) {
    console.error('auth start error', err);
    res.status(500).json({ message: 'Could not send OTP. Check backend mail settings.' });
  }
});

app.post('/api/auth/verify', async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = String(req.body.otp || '').trim();
    if (!requireFields(res, { email, otp })) return;
    const otpRow = await findOne('otps', { email });
    if (!otpRow || otpRow.used) return res.status(400).json({ message: 'OTP is missing or already used.' });
    if (new Date(otpRow.expiresAt).getTime() < Date.now()) return res.status(400).json({ message: 'OTP expired. Request a new one.' });
    const ok = await bcrypt.compare(otp, otpRow.codeHash);
    if (!ok) return res.status(400).json({ message: 'Wrong OTP.' });

    await updateOne('otps', { id: otpRow.id }, { used: true });
    const user = await updateOne('users', { email }, { emailVerified: true, lastLoginAt: new Date().toISOString() }, { upsert: false });
    const token = makeToken(user);
    res.json({ token, user: cleanUser(user) });
  } catch (err) {
    console.error('verify error', err);
    res.status(500).json({ message: 'Could not verify OTP.' });
  }
});

app.post('/api/auth/google', async (req, res) => {
  try {
    const credential = req.body.credential;
    if (!process.env.GOOGLE_CLIENT_ID) return res.status(500).json({ message: 'Google login is not configured yet.' });
    if (!credential) return res.status(400).json({ message: 'Missing Google credential.' });
    const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const email = normalizeEmail(payload.email);
    let user = await findOne('users', { email });
    if (!user) {
      user = await insertOne('users', {
        id: newId('user'),
        name: payload.name || email.split('@')[0],
        email,
        authProvider: 'google',
        emailVerified: Boolean(payload.email_verified),
        picture: payload.picture || ''
      });
    } else {
      user = await updateOne('users', { email }, { lastLoginAt: new Date().toISOString(), picture: payload.picture || user.picture || '' });
    }
    res.json({ token: makeToken(user), user: cleanUser(user) });
  } catch (err) {
    console.error('google auth error', err);
    res.status(401).json({ message: 'Google login failed.' });
  }
});

app.get('/api/me', authRequired, async (req, res) => {
  const user = await findOne('users', { id: req.user.id });
  res.json({ user: cleanUser(user) });
});

app.get('/api/products/categories', (_, res) => {
  res.json({ categories: categories() });
});

app.get('/api/products', async (req, res) => {
  const cursor = Number(req.query.cursor || 0);
  const limit = Math.min(Number(req.query.limit || 24), 48);
  const category = req.query.category || 'All';
  const segment = req.query.segment || '';
  const q = String(req.query.q || '').trim();
  const data = listProducts({ cursor, limit, category, segment, q });
  res.json(data);
});

app.get('/api/products/:id', async (req, res) => {
  const product = getProductById(req.params.id);
  const reviews = await findMany('reviews', { productKey: product.baseKey }, { sort: { createdAt: -1 }, limit: 30 });
  res.json({ product, related: relatedProducts(product, 12), reviews });
});

app.post('/api/history/search', authRequired, async (req, res) => {
  const query = String(req.body.query || '').trim();
  if (!query) return res.json({ ok: true });
  await insertOne('searches', { id: newId('search'), userId: req.user.id, query });
  res.json({ ok: true });
});

app.get('/api/history/search', authRequired, async (req, res) => {
  const rows = await findMany('searches', { userId: req.user.id }, { sort: { createdAt: -1 }, limit: 30 });
  res.json({ items: rows });
});

app.post('/api/history/views', authRequired, async (req, res) => {
  const product = req.body.product;
  if (!product?.id) return res.json({ ok: true });
  await insertOne('views', { id: newId('view'), userId: req.user.id, product });
  res.json({ ok: true });
});

app.get('/api/history/views', authRequired, async (req, res) => {
  const rows = await findMany('views', { userId: req.user.id }, { sort: { createdAt: -1 }, limit: 30 });
  res.json({ items: rows });
});

app.get('/api/cart', authRequired, async (req, res) => {
  const cart = await findOne('carts', { userId: req.user.id });
  res.json({ items: cart?.items || [] });
});

app.post('/api/cart', authRequired, async (req, res) => {
  const item = req.body.item;
  if (!item?.id) return res.status(400).json({ message: 'Product is missing.' });
  const cart = await findOne('carts', { userId: req.user.id });
  const items = cart?.items || [];
  const key = `${item.id}-${item.size || ''}-${item.color || ''}`;
  const existing = items.find((x) => `${x.id}-${x.size || ''}-${x.color || ''}` === key);
  if (existing) existing.qty = Number(existing.qty || 1) + Number(item.qty || 1);
  else items.push({ ...item, qty: Number(item.qty || 1) });
  await updateOne('carts', { userId: req.user.id }, { items }, { upsert: true });
  res.json({ items });
});

app.put('/api/cart', authRequired, async (req, res) => {
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  await updateOne('carts', { userId: req.user.id }, { items }, { upsert: true });
  res.json({ items });
});

app.delete('/api/cart/:key', authRequired, async (req, res) => {
  const cart = await findOne('carts', { userId: req.user.id });
  const items = (cart?.items || []).filter((x) => x.key !== req.params.key);
  await updateOne('carts', { userId: req.user.id }, { items }, { upsert: true });
  res.json({ items });
});

app.get('/api/wishlist', authRequired, async (req, res) => {
  const list = await findOne('wishlists', { userId: req.user.id });
  res.json({ items: list?.items || [] });
});

app.post('/api/wishlist', authRequired, async (req, res) => {
  const product = req.body.product;
  if (!product?.id) return res.status(400).json({ message: 'Product is missing.' });
  const list = await findOne('wishlists', { userId: req.user.id });
  const items = list?.items || [];
  const exists = items.some((x) => x.id === product.id);
  const next = exists ? items.filter((x) => x.id !== product.id) : [{ ...product, savedAt: new Date().toISOString() }, ...items];
  await updateOne('wishlists', { userId: req.user.id }, { items: next }, { upsert: true });
  res.json({ items: next });
});

app.post('/api/reviews', authRequired, async (req, res) => {
  const { productKey, rating, title, text, photo } = req.body;
  if (!productKey) return res.status(400).json({ message: 'Product is missing.' });
  const user = await findOne('users', { id: req.user.id });
  const review = await insertOne('reviews', {
    id: newId('review'),
    productKey,
    rating: Number(rating || 5),
    title: String(title || 'Loved it').slice(0, 80),
    text: String(text || '').slice(0, 700),
    photo: String(photo || '').slice(0, 200000),
    userName: user?.name || 'Uptown shopper',
    userId: req.user.id
  });
  res.json({ review });
});

function cartTotal(items = []) {
  return items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1), 0);
}

function razorpayReady() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

app.post('/api/payments/create-order', authRequired, async (req, res) => {
  try {
    const cart = await findOne('carts', { userId: req.user.id });
    const items = cart?.items || [];
    if (!items.length) return res.status(400).json({ message: 'Your bag is empty.' });
    const amount = Math.max(cartTotal(items), 1);
    if (!razorpayReady()) {
      const payment = await insertOne('payments', {
        id: newId('pay'),
        userId: req.user.id,
        amount,
        currency: 'INR',
        provider: 'demo',
        status: 'created'
      });
      return res.json({ demo: true, order: { id: payment.id, amount: amount * 100, currency: 'INR' } });
    }
    const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    const order = await razorpay.orders.create({ amount: amount * 100, currency: 'INR', receipt: newId('receipt') });
    await insertOne('payments', { id: order.id, userId: req.user.id, amount, currency: 'INR', provider: 'razorpay', status: 'created' });
    res.json({ demo: false, order });
  } catch (err) {
    console.error('create payment error', err);
    res.status(500).json({ message: 'Could not start payment.' });
  }
});

app.post('/api/payments/verify', authRequired, async (req, res) => {
  try {
    const cart = await findOne('carts', { userId: req.user.id });
    const items = cart?.items || [];
    if (!items.length) return res.status(400).json({ message: 'Your bag is empty.' });

    let paymentStatus = 'paid';
    let paymentId = req.body.razorpay_payment_id || req.body.paymentId || `demo_${Date.now()}`;

    if (!req.body.demo && razorpayReady()) {
      const body = `${req.body.razorpay_order_id}|${req.body.razorpay_payment_id}`;
      const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');
      if (expected !== req.body.razorpay_signature) return res.status(400).json({ message: 'Payment verification failed.' });
      paymentId = req.body.razorpay_payment_id;
    }

    const order = await insertOne('orders', {
      id: newId('order'),
      userId: req.user.id,
      items,
      amount: cartTotal(items),
      paymentId,
      paymentStatus,
      address: req.body.address || {},
      status: 'Order placed'
    });
    await updateOne('carts', { userId: req.user.id }, { items: [] }, { upsert: true });
    res.json({ order });
  } catch (err) {
    console.error('verify payment error', err);
    res.status(500).json({ message: 'Could not verify payment.' });
  }
});

app.get('/api/orders', authRequired, async (req, res) => {
  const orders = await findMany('orders', { userId: req.user.id }, { sort: { createdAt: -1 }, limit: 50 });
  res.json({ orders });
});

app.post('/api/address', authRequired, async (req, res) => {
  const address = await insertOne('addresses', { id: newId('addr'), userId: req.user.id, ...req.body });
  res.json({ address });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong.' });
});

connectDb()
  .then(() => app.listen(PORT, () => console.log(`Uptown API running on http://localhost:${PORT}`)))
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });
