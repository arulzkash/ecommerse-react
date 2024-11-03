const mongoose = require('mongoose');
const Product = require('./models/product.cjs'); // Pastikan path model benar

const dbURI = process.env.MONGODB_URI; // Jangan lupa set MONGODB_URI di Environment Variables
let isConnected;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  isConnected = true;
  console.log('Connected to MongoDB Atlas');
}

module.exports = async (req, res) => {
  await connectDB();
  
  if (req.method === 'GET') {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Error fetching products' });
    }
  } else if (req.method === 'POST') {
    try {
      const newProduct = new Product(req.body);
      await newProduct.save();
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({ message: 'Error adding product' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
