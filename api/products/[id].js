const mongoose = require('mongoose');
const Product = require('../models/product');
const dbURI = 'mongodb+srv://arulzkash:kashidota@cluster0.up4ol.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0';

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
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Error updating product' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await Product.findByIdAndDelete(id);
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ message: 'Error deleting product' });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
