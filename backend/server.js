const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

// 6. OLA MAPS / KRUTRIM MAPS PROXY ENDPOINTS (Backend Protected Server Key)
const OLA_API_KEY = process.env.OLA_MAPS_API_KEY || '';
const OLA_BASE_URL = 'https://api.olamaps.io';
const OLA_ALLOWED_ORIGIN = process.env.OLA_ALLOWED_ORIGIN || 'https://getora.co.in';

const getOlaHeaders = () => ({
  'Origin': OLA_ALLOWED_ORIGIN,
  'Referer': `${OLA_ALLOWED_ORIGIN}/`,
  'X-Request-Id': `getora-${Date.now()}`
});

app.get('/api/maps/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(OLA_API_KEY && OLA_API_KEY !== 'YOUR_OLA_MAPS_API_KEY' && OLA_API_KEY.trim() !== ''),
    allowedOrigin: OLA_ALLOWED_ORIGIN,
    provider: 'Ola Maps / Krutrim Maps (Backend Proxy)'
  });
});

app.get('/api/maps/autocomplete', async (req, res) => {
  try {
    const { input } = req.query;
    if (!input) return res.status(400).json({ error: 'Missing input parameter' });

    if (!OLA_API_KEY) {
      return res.status(500).json({ error: 'OLA_MAPS_API_KEY is not configured on backend server' });
    }

    const targetUrl = `${OLA_BASE_URL}/places/v1/autocomplete?input=${encodeURIComponent(input)}&api_key=${encodeURIComponent(OLA_API_KEY)}`;
    const response = await fetch(targetUrl, {
      headers: getOlaHeaders()
    });

    const data = await response.json().catch(() => ({ message: 'Non-JSON response from Ola Maps' }));
    console.log(`[OLA PROXY] Autocomplete for "${input}" -> HTTP ${response.status}`);
    return res.status(response.status).json(data);
  } catch (err) {
    console.error('[OLA PROXY ERROR] Autocomplete failed:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/maps/reverse-geocode', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: 'Missing lat/lng parameters' });

    if (!OLA_API_KEY) {
      return res.status(500).json({ error: 'OLA_MAPS_API_KEY is not configured on backend server' });
    }

    const targetUrl = `${OLA_BASE_URL}/places/v1/reverse-geocode?latlng=${lat},${lng}&api_key=${encodeURIComponent(OLA_API_KEY)}`;
    const response = await fetch(targetUrl, {
      headers: getOlaHeaders()
    });

    const data = await response.json().catch(() => ({ message: 'Non-JSON response from Ola Maps' }));
    console.log(`[OLA PROXY] Reverse Geocode (${lat}, ${lng}) -> HTTP ${response.status}`);
    return res.status(response.status).json(data);
  } catch (err) {
    console.error('[OLA PROXY ERROR] Reverse Geocode failed:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/maps/geocode', async (req, res) => {
  try {
    const { address } = req.query;
    if (!address) return res.status(400).json({ error: 'Missing address parameter' });

    if (!OLA_API_KEY) {
      return res.status(500).json({ error: 'OLA_MAPS_API_KEY is not configured on backend server' });
    }

    const targetUrl = `${OLA_BASE_URL}/places/v1/geocode?address=${encodeURIComponent(address)}&api_key=${encodeURIComponent(OLA_API_KEY)}`;
    const response = await fetch(targetUrl, {
      headers: getOlaHeaders()
    });

    const data = await response.json().catch(() => ({ message: 'Non-JSON response from Ola Maps' }));
    console.log(`[OLA PROXY] Geocode "${address}" -> HTTP ${response.status}`);
    return res.status(response.status).json(data);
  } catch (err) {
    console.error('[OLA PROXY ERROR] Geocode failed:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/maps/directions', async (req, res) => {
  try {
    const { origin, destination, mode = 'driving' } = req.query;
    if (!origin || !destination) return res.status(400).json({ error: 'Missing origin/destination parameters' });

    if (!OLA_API_KEY) {
      return res.status(500).json({ error: 'OLA_MAPS_API_KEY is not configured on backend server' });
    }

    const targetUrl = `${OLA_BASE_URL}/routing/v1/directions?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${mode}&api_key=${encodeURIComponent(OLA_API_KEY)}`;
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: getOlaHeaders()
    });

    const data = await response.json().catch(() => ({ message: 'Non-JSON response from Ola Maps' }));
    console.log(`[OLA PROXY] Directions (${origin} -> ${destination}) -> HTTP ${response.status}`);
    return res.status(response.status).json(data);
  } catch (err) {
    console.error('[OLA PROXY ERROR] Directions failed:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/maps/tile-style', async (req, res) => {
  try {
    const { theme = 'dark' } = req.query;
    const styleName = theme === 'light' ? 'default-light-standard' : 'default-dark-standard';

    if (!OLA_API_KEY) {
      return res.status(500).json({ error: 'OLA_MAPS_API_KEY is not configured on backend server' });
    }

    const targetUrl = `${OLA_BASE_URL}/tiles/vector/v1/styles/${styleName}/style.json?api_key=${encodeURIComponent(OLA_API_KEY)}`;
    const response = await fetch(targetUrl, {
      headers: getOlaHeaders()
    });
    const data = await response.json().catch(() => ({ message: 'Non-JSON response from Ola Maps' }));
    console.log(`[OLA PROXY] Tile Style (${styleName}) -> HTTP ${response.status}`);
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`GETORA Backend API server running on port ${PORT}`);
});

