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

app.listen(PORT, () => {
  console.log(`GETORA Backend API server running on port ${PORT}`);
});
