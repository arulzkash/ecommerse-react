const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Simpan data produk dalam array untuk sementara (pengganti database)
let products = [];

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});


// Endpoint untuk mendapatkan semua produk
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Endpoint untuk menambah produk baru
app.post('/api/products', (req, res) => {
  const newProduct = req.body;
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Endpoint untuk memperbarui produk
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const updatedProduct = req.body;
  products = products.map((product) => (product.id === id ? updatedProduct : product));
  res.json(updatedProduct);
});

// Endpoint untuk menghapus produk
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  products = products.filter((product) => product.id !== id);
  res.status(204).end();
});

// Jalankan server pada port 5000
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
