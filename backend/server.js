const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Koneksi ke MongoDB Atlas
const dbURI = 'mongodb+srv://arulzkash:kashidota@cluster0.up4ol.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => console.error('Error connecting to MongoDB Atlas:', error));

// Skema Produk
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
  category: String,
});

const wishlistSchema = new mongoose.Schema({
  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);


const Product = mongoose.model('Product', productSchema);

// Endpoint untuk mendapatkan semua produk
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    console.log('Data produk yang diambil:', products); // Log untuk debug
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Endpoint untuk menambah produk baru
app.post('/api/products', async (req, res) => {
  console.log('Data diterima dari frontend:', req.body); // Log data yang diterima
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Error adding product' });
  }
});

// Endpoint untuk memperbarui produk
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
});

// Endpoint untuk menghapus produk
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

// Endpoint untuk mendapatkan wishlist umum
app.get('/api/wishlist', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne().populate('productIds');
    res.json(wishlist ? wishlist.productIds : []);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
});

// Endpoint untuk menambah produk ke wishlist
app.post('/api/wishlist', async (req, res) => {
  try {
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne();
    if (!wishlist) {
      wishlist = new Wishlist({ productIds: [productId] });
    } else {
      if (!wishlist.productIds.includes(productId)) {
        wishlist.productIds.push(productId);
      }
    }

    await wishlist.save();
    res.status(200).json(wishlist.productIds);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Error adding to wishlist' });
  }
});

// Endpoint untuk menghapus produk dari wishlist
app.delete('/api/wishlist/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne();
    if (wishlist) {
      wishlist.productIds = wishlist.productIds.filter(id => id.toString() !== productId);
      await wishlist.save();
    }

    res.status(204).end();
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Error removing from wishlist' });
  }
});

app.delete('/api/wishlist', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne();
    if (wishlist) {
      wishlist.productIds = [];
      await wishlist.save();
      res.status(200).json({ message: 'Wishlist cleared successfully.' });
    } else {
      res.status(404).json({ message: 'Wishlist not found.' });
    }
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    res.status(500).json({ message: 'Error clearing wishlist.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
