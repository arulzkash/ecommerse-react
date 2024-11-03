import React, { useState, useEffect } from "react";
import { CartProvider } from "./context/CartContext";
import { ProductCard } from "./components/ProductCard";
import { Cart } from "./components/Cart";
import { ShoppingCart, Store } from "lucide-react";
import { Toaster } from "react-hot-toast";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  //tambah produk 1-------------
  // const [newProduct, setNewProduct] = useState<Product>({
  //   id: Date.now(),
  //   name: '',
  //   price: 0,
  //   description: '',
  //   image: '',
  //   category: '',
  // });

  // Fetch products from API
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  //tambah produk 2-------------
  // const handleAddProduct = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   fetch('http://localhost:5000/api/products', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(newProduct),
  //   })
  //     .then((response) => response.json())
  //     .then((addedProduct) => {
  //       setProducts([...products, addedProduct]);
  //       setNewProduct({
  //         id: Date.now(),
  //         name: '',
  //         price: 0,
  //         description: '',
  //         image: '',
  //         category: '',
  //       });
  //     })
  //     .catch((error) => console.error('Error adding product:', error));
  // };

  const categories = Array.from(
    new Set(products.map((product) => product.category))
  );

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Store className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">ModernShop</h1>
              </div>
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-full relative">
                <ShoppingCart className="h-6 w-6" />
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {
            //tambah produk 3-------------
            /* Form Input Produk Baru
            <form onSubmit={handleAddProduct} className="mb-6">
              <input
                type="text"
                placeholder="Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
                className="border p-2 mr-2"
              />
              <input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                required
                className="border p-2 mr-2"
              />
              <input
                type="text"
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                required
                className="border p-2 mr-2"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                required
                className="border p-2 mr-2"
              />
              <input
                type="text"
                placeholder="Category"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                required
                className="border p-2 mr-2"
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Add Product
              </button>
            </form> */
          }

          {/* Filter Kategori */}
          <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === null
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}>
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}>
                {category}
              </button>
            ))}
          </div>

          {/* Tampilkan Produk */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </main>

        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </CartProvider>
  );
}

export default App;
