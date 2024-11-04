const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const dbURI = 'mongodb+srv://arulzkash:kashidota@cluster0.up4ol.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0';

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;

  try {
    const db = await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    cachedDb = db;
    console.log('Connected to MongoDB Atlas');
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    throw error;
  }
}

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
  category: String,
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function handler(req, res) {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

module.exports = handler;
