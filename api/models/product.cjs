const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
  category: String,
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
