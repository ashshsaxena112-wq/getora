const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const { rateLimit } = require('express-rate-limit');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

// ==============================================================================
// 1. STRICT CORS & SECURITY HEADERS
// ==============================================================================
const PRODUCTION_ORIGINS = [
  'https://getora.co.in',
  'https://www.getora.co.in'
];

if (process.env.ALLOWED_ORIGINS) {
  process.env.ALLOWED_ORIGINS.split(',')
    .map((o) => o.trim())
    .filter(Boolean)
    .forEach((o) => {
      if (!PRODUCTION_ORIGINS.includes(o)) PRODUCTION_ORIGINS.push(o);
    });
}

const DEVELOPMENT_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

const allowedOrigins = isProd
  ? PRODUCTION_ORIGINS
  : [...PRODUCTION_ORIGINS, ...DEVELOPMENT_ORIGINS];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, server-side fetch, cURL)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow localhost with any port in non-production environments
    if (!isProd && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    return callback(new Error('CORS policy: This origin is not authorized to access GETORA API'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept', 'X-Request-Id'],
  credentials: true,
  maxAge: 86400
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'GETORA Hyperlocal Backend API', timestamp: new Date().toISOString() });
});

// 1. GET ALL CATEGORIES
app.get('/api/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    res.json({ success: true, categories: data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. GET NEARBY STORES (with optional location radius filter)
app.get('/api/stores', async (req, res) => {
  try {
    const { category, search, lat, lng } = req.query;
    let query = supabase.from('stores').select('*, categories(name, slug)');

    if (category) query = query.eq('category_id', category);
    if (search) query = query.ilike('name', `%${search}%`);

    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, stores: data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. GET STORE BY ID / SLUG & CATALOG
app.get('/api/stores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('*')
      .or(`id.eq.${id},slug.eq.${id}`)
      .single();

    if (storeError) throw storeError;

    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('*')
      .eq('store_id', store.id);

    if (prodError) throw prodError;

    res.json({ success: true, store, products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. CREATE ORDER (Hyperlocal dispatch)
app.post('/api/orders', async (req, res) => {
  try {
    const { store_id, items, delivery_address, payment_method, delivery_instructions } = req.body;

    const orderNumber = `GET-${Math.floor(100000 + Math.random() * 900000)}`;

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          order_number: orderNumber,
          store_id,
          status: 'confirmed',
          delivery_address,
          payment_method: payment_method || 'UPI',
          payment_status: 'paid',
          delivery_instructions,
          subtotal: req.body.subtotal,
          delivery_fee: req.body.delivery_fee,
          platform_fee: 5.0,
          discount: req.body.discount || 0,
          grand_total: req.body.grand_total,
          estimated_delivery_time: new Date(Date.now() + 20 * 60000).toISOString()
        }
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. LIVE ORDER TRACKING
app.get('/api/orders/:id/track', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, stores(name, address, lat, lng)')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==============================================================================
// 6. OLA MAPS / KRUTRIM MAPS HARDENED PROXY (Server-Side Key Protection)
// ==============================================================================
const OLA_API_KEY = process.env.OLA_MAPS_API_KEY || '';
const OLA_BASE_URL = 'https://api.olamaps.io';
const OLA_ALLOWED_ORIGIN = process.env.OLA_ALLOWED_ORIGIN || 'https://getora.co.in';

// Upstream Authentication Headers (Preserved working Ola domain verification)
const getOlaHeaders = (clientReqId) => ({
  'Origin': OLA_ALLOWED_ORIGIN,
  'Referer': `${OLA_ALLOWED_ORIGIN}/`,
  'X-Request-Id': clientReqId || `getora-${Date.now()}`
});

// --- Security Helper Functions ---

/**
 * Mask sensitive credentials from log messages or error output
 */
function maskSecret(str) {
  if (!str || typeof str !== 'string') return str;
  if (OLA_API_KEY && OLA_API_KEY.length > 6) {
    return str.replaceAll(OLA_API_KEY, '***REDACTED_API_KEY***');
  }
  return str;
}

/**
 * Validates a numeric coordinate within valid global ranges
 */
function isValidCoord(val, min, max) {
  if (val === undefined || val === null || val === '') return false;
  const num = Number(val);
  return !isNaN(num) && isFinite(num) && num >= min && num <= max;
}

/**
 * Validates a "latitude,longitude" coordinate string pair
 */
function isValidLatLngPair(str) {
  if (typeof str !== 'string') return false;
  const parts = str.trim().split(',');
  if (parts.length !== 2) return false;
  const lat = Number(parts[0]);
  const lng = Number(parts[1]);
  return isValidCoord(lat, -90, 90) && isValidCoord(lng, -180, 180);
}

/**
 * Sanitizes text input: strips ASCII control characters and enforces length
 */
function sanitizeText(str, minLen = 1, maxLen = 150) {
  if (typeof str !== 'string') return null;
  const clean = str.replace(/[\x00-\x1F\x7F]/g, '').trim();
  if (clean.length < minLen || clean.length > maxLen) return null;
  return clean;
}

/**
 * Executes an upstream request to api.olamaps.io with a strict timeout
 */
async function fetchFromOla(targetUrl, options = {}, timeoutMs = 6000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(targetUrl, {
      ...options,
      signal: controller.signal,
      headers: {
        ...getOlaHeaders(options.headers?.['X-Request-Id']),
        ...(options.headers || {})
      }
    });
    clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({
      message: 'Non-JSON response received from upstream map service'
    }));

    return { status: response.status, data };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return { status: 504, data: { error: 'Upstream map service request timed out' } };
    }
    throw err;
  }
}

// --- Rate Limiting Middlewares (Per-IP) ---

const rateLimitHandler = (message) => (req, res) => {
  res.status(429).json({
    error: 'Too Many Requests',
    message: message || 'You have exceeded the allowed request limit. Please try again shortly.'
  });
};

// General maps limiter: 120 req / min
const generalMapsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('Too many map requests from this IP. Please try again shortly.')
});

// Autocomplete limiter: 60 req / min (prevents automated scraping of address indices)
const autocompleteLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('Too many search requests. Please slow down your typing.')
});

// Directions limiter: 30 req / min (protects computationally expensive route queries)
const directionsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('Directions rate limit exceeded. Please wait a moment before requesting another route.')
});

// Geocode limiter: 60 req / min
const geocodeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('Geocoding rate limit exceeded. Please try again shortly.')
});

// Apply general limiter to all /api/maps endpoints
app.use('/api/maps', generalMapsLimiter);

// --- Whitelisted Map Endpoints ---

// 1. Health & Configuration Status
app.get('/api/maps/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(OLA_API_KEY && OLA_API_KEY !== 'YOUR_OLA_MAPS_API_KEY' && OLA_API_KEY.trim() !== ''),
    allowedOrigin: OLA_ALLOWED_ORIGIN,
    provider: 'Ola Maps / Krutrim Maps (Backend Proxy)',
    rateLimiting: {
      status: 'active',
      general: '120 req/min',
      autocomplete: '60 req/min',
      directions: '30 req/min',
      geocoding: '60 req/min'
    }
  });
});

// 2. Places Autocomplete with Input Validation
app.get('/api/maps/autocomplete', autocompleteLimiter, async (req, res) => {
  const start = Date.now();
  const reqId = `ac-${Date.now()}`;
  try {
    const rawInput = req.query.input;
    const sanitizedInput = sanitizeText(rawInput, 2, 120);

    if (!sanitizedInput) {
      return res.status(400).json({
        error: 'Invalid parameter: "input" must be a non-empty string between 2 and 120 characters.'
      });
    }

    if (!OLA_API_KEY) {
      return res.status(500).json({ error: 'Map service authentication is not configured' });
    }

    const targetUrl = `${OLA_BASE_URL}/places/v1/autocomplete?input=${encodeURIComponent(sanitizedInput)}&api_key=${encodeURIComponent(OLA_API_KEY)}`;
    const { status, data } = await fetchFromOla(targetUrl, { headers: { 'X-Request-Id': reqId } });

    console.log(`[OLA PROXY] [${reqId}] Autocomplete "${sanitizedInput}" -> HTTP ${status} (${Date.now() - start}ms)`);
    return res.status(status).json(data);
  } catch (err) {
    console.error(`[OLA PROXY ERROR] [${reqId}] Autocomplete failed: ${maskSecret(err.message)}`);
    return res.status(500).json({ error: 'Failed to process autocomplete request' });
  }
});

// 3. Reverse Geocode with Coordinate Validation
app.get('/api/maps/reverse-geocode', geocodeLimiter, async (req, res) => {
  const start = Date.now();
  const reqId = `rev-${Date.now()}`;
  try {
    const { lat, lng } = req.query;

    if (!isValidCoord(lat, -90, 90)) {
      return res.status(400).json({
        error: 'Invalid parameter: "lat" must be a valid number between -90 and 90.'
      });
    }
    if (!isValidCoord(lng, -180, 180)) {
      return res.status(400).json({
        error: 'Invalid parameter: "lng" must be a valid number between -180 and 180.'
      });
    }

    if (!OLA_API_KEY) {
      return res.status(500).json({ error: 'Map service authentication is not configured' });
    }

    const numLat = Number(lat);
    const numLng = Number(lng);
    const targetUrl = `${OLA_BASE_URL}/places/v1/reverse-geocode?latlng=${numLat},${numLng}&api_key=${encodeURIComponent(OLA_API_KEY)}`;
    const { status, data } = await fetchFromOla(targetUrl, { headers: { 'X-Request-Id': reqId } });

    console.log(`[OLA PROXY] [${reqId}] Reverse Geocode (${numLat}, ${numLng}) -> HTTP ${status} (${Date.now() - start}ms)`);
    return res.status(status).json(data);
  } catch (err) {
    console.error(`[OLA PROXY ERROR] [${reqId}] Reverse Geocode failed: ${maskSecret(err.message)}`);
    return res.status(500).json({ error: 'Failed to process reverse geocode request' });
  }
});

// 4. Forward Geocode with Address Validation
app.get('/api/maps/geocode', geocodeLimiter, async (req, res) => {
  const start = Date.now();
  const reqId = `geo-${Date.now()}`;
  try {
    const rawAddress = req.query.address;
    const sanitizedAddress = sanitizeText(rawAddress, 3, 200);

    if (!sanitizedAddress) {
      return res.status(400).json({
        error: 'Invalid parameter: "address" must be a non-empty string between 3 and 200 characters.'
      });
    }

    if (!OLA_API_KEY) {
      return res.status(500).json({ error: 'Map service authentication is not configured' });
    }

    const targetUrl = `${OLA_BASE_URL}/places/v1/geocode?address=${encodeURIComponent(sanitizedAddress)}&api_key=${encodeURIComponent(OLA_API_KEY)}`;
    const { status, data } = await fetchFromOla(targetUrl, { headers: { 'X-Request-Id': reqId } });

    console.log(`[OLA PROXY] [${reqId}] Geocode "${sanitizedAddress}" -> HTTP ${status} (${Date.now() - start}ms)`);
    return res.status(status).json(data);
  } catch (err) {
    console.error(`[OLA PROXY ERROR] [${reqId}] Geocode failed: ${maskSecret(err.message)}`);
    return res.status(500).json({ error: 'Failed to process geocode request' });
  }
});

// 5. Routing & Directions with Coordinate Pair & Mode Validation
app.get('/api/maps/directions', directionsLimiter, async (req, res) => {
  const start = Date.now();
  const reqId = `dir-${Date.now()}`;
  try {
    const { origin, destination, mode = 'driving' } = req.query;

    if (!isValidLatLngPair(origin)) {
      return res.status(400).json({
        error: 'Invalid parameter: "origin" must be in format "latitude,longitude" with valid coordinates.'
      });
    }

    if (!isValidLatLngPair(destination)) {
      return res.status(400).json({
        error: 'Invalid parameter: "destination" must be in format "latitude,longitude" with valid coordinates.'
      });
    }

    const ALLOWED_MODES = ['driving', 'walking', 'bicycling', 'two_wheeler'];
    const sanitizedMode = String(mode).toLowerCase().trim();
    if (!ALLOWED_MODES.includes(sanitizedMode)) {
      return res.status(400).json({
        error: `Invalid parameter: "mode" must be one of [${ALLOWED_MODES.join(', ')}].`
      });
    }

    if (!OLA_API_KEY) {
      return res.status(500).json({ error: 'Map service authentication is not configured' });
    }

    const cleanOrigin = origin.trim();
    const cleanDest = destination.trim();
    const targetUrl = `${OLA_BASE_URL}/routing/v1/directions?origin=${encodeURIComponent(cleanOrigin)}&destination=${encodeURIComponent(cleanDest)}&mode=${sanitizedMode}&api_key=${encodeURIComponent(OLA_API_KEY)}`;
    const { status, data } = await fetchFromOla(targetUrl, {
      method: 'POST',
      headers: { 'X-Request-Id': reqId }
    });

    console.log(`[OLA PROXY] [${reqId}] Directions (${cleanOrigin} -> ${cleanDest}) [${sanitizedMode}] -> HTTP ${status} (${Date.now() - start}ms)`);
    return res.status(status).json(data);
  } catch (err) {
    console.error(`[OLA PROXY ERROR] [${reqId}] Directions failed: ${maskSecret(err.message)}`);
    return res.status(500).json({ error: 'Failed to process directions request' });
  }
});

// 6. Vector Tile Style with Theme Validation
app.get('/api/maps/tile-style', generalMapsLimiter, async (req, res) => {
  const start = Date.now();
  const reqId = `tile-${Date.now()}`;
  try {
    const theme = String(req.query.theme || 'dark').toLowerCase().trim();
    if (theme !== 'dark' && theme !== 'light') {
      return res.status(400).json({ error: 'Invalid parameter: "theme" must be either "dark" or "light".' });
    }

    const styleName = theme === 'light' ? 'default-light-standard' : 'default-dark-standard';

    if (!OLA_API_KEY) {
      return res.status(500).json({ error: 'Map service authentication is not configured' });
    }

    const targetUrl = `${OLA_BASE_URL}/tiles/vector/v1/styles/${styleName}/style.json?api_key=${encodeURIComponent(OLA_API_KEY)}`;
    const { status, data } = await fetchFromOla(targetUrl, { headers: { 'X-Request-Id': reqId } });

    console.log(`[OLA PROXY] [${reqId}] Tile Style (${styleName}) -> HTTP ${status} (${Date.now() - start}ms)`);
    return res.status(status).json(data);
  } catch (err) {
    console.error(`[OLA PROXY ERROR] [${reqId}] Tile Style failed: ${maskSecret(err.message)}`);
    return res.status(500).json({ error: 'Failed to process tile style request' });
  }
});

// ==============================================================================
// 7. PREVENT OPEN PROXY ABUSE (Block unsupported or arbitrary proxy paths)
// ==============================================================================
app.all('/api/maps/*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'This endpoint is not supported by the GETORA Map Proxy.'
  });
});

// CORS Error Handler
app.use((err, req, res, next) => {
  if (err.message && err.message.includes('CORS policy')) {
    return res.status(403).json({ error: 'Forbidden', message: err.message });
  }
  next(err);
});

app.listen(PORT, () => {
  console.log(`GETORA Backend API server running on port ${PORT}`);
});

