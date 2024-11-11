import React, { useState, useEffect } from "react";
import { CartProvider } from "./context/CartContext";
import { ProductCard } from "./components/ProductCard";
import { Cart } from "./components/Cart";
import { ShoppingCart, Store } from "lucide-react";
import { Toaster } from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

interface ApiProduct {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortType, setSortType] = useState("priceAsc");
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        if (response.ok) {
          const data: ApiProduct[] = await response.json();
          const mappedProducts: Product[] = data.map((product) => ({
            id: product._id,
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.image,
            category: product.category,
          }));
          setProducts(mappedProducts);
        } else {
          console.error("Failed to fetch products:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Fetch wishlist on component mount
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/wishlist");
        if (response.ok) {
          const data: ApiProduct[] = await response.json();
          const mappedWishlist: Product[] = data.map((product) => ({
            id: product._id,
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.image,
            category: product.category,
          }));
          setWishlist(mappedWishlist);
        } else {
          console.error("Failed to fetch wishlist:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, []);

  const addToWishlist = async (product: Product) => {
    // Cek apakah produk sudah ada di wishlist
    if (wishlist.some(item => item.id === product.id)) {
      console.log("Product is already in wishlist");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: product.id }),
      });
  
      if (response.ok) {
        // Ambil wishlist terbaru setelah menambahkan produk
        const updatedWishlistResponse = await fetch("http://localhost:5000/api/wishlist");
        
        if (updatedWishlistResponse.ok) {
          const updatedWishlistData: ApiProduct[] = await updatedWishlistResponse.json();
          
          // Pemetaan data wishlist dari API ke state `wishlist`
          const mappedWishlist: Product[] = updatedWishlistData.map((product) => ({
            id: product._id,
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.image,
            category: product.category,
          }));
  
          // Update state wishlist dengan data terbaru
          setWishlist(mappedWishlist);
          console.log("Wishlist updated successfully:", mappedWishlist);
        } else {
          console.error("Failed to fetch updated wishlist:", updatedWishlistResponse.statusText);
        }
      } else {
        console.error("Failed to add to wishlist:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };
  
  // Fungsi untuk menghapus produk dari wishlist
  const removeFromWishlist = async (productId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/wishlist/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Fetch ulang wishlist dari backend setelah menghapus produk
        const updatedWishlist: ApiProduct[] = await fetch("http://localhost:5000/api/wishlist").then(res => res.json());
        const mappedWishlist: Product[] = updatedWishlist.map((product) => ({
          id: product._id,
          name: product.name,
          price: product.price,
          description: product.description,
          image: product.image,
          category: product.category,
        }));
        setWishlist(mappedWishlist);
      } else {
        console.error("Failed to remove from wishlist:", response.statusText);
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const categories = Array.from(new Set(products.map((product) => product.category)));

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) =>
      selectedCategory ? product.category === selectedCategory : true
    )
    .filter((product) => 
      product.price >= minPrice && product.price <= maxPrice
    );

  const sortedAndFilteredProducts = filteredProducts.sort((a, b) => {
    if (sortType === "priceAsc") {
      return a.price - b.price;
    }
    if (sortType === "priceDesc") {
      return b.price - a.price;
    }
    if (sortType === "nameAsc") {
      return a.name.localeCompare(b.name);
    }
    if (sortType === "nameDesc") {
      return b.name.localeCompare(a.name);
    }
    return 0;
  });

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
          {/* Input Pencarian */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          {/* Filter Harga */}
          <div className="mb-4">
            <label className="block text-gray-700">Filter Harga:</label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-20 px-2 py-1 border rounded-lg"
                placeholder="Min"
              />
              <span>-</span>
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-20 px-2 py-1 border rounded-lg"
                placeholder="Max"
              />
            </div>
          </div>

          {/* Sorting Produk */}
          <div className="mb-4">
            <label className="block text-gray-700">Urutkan Berdasarkan:</label>
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="priceAsc">Harga Terendah ke Tertinggi</option>
              <option value="priceDesc">Harga Tertinggi ke Terendah</option>
              <option value="nameAsc">Nama Produk (A-Z)</option>
              <option value="nameDesc">Nama Produk (Z-A)</option>
            </select>
          </div>

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
          <h2 className="text-2xl font-bold mb-4">Produk</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedAndFilteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.some(item => item.id === product.id)}
                addToWishlist={addToWishlist}
                removeFromWishlist={removeFromWishlist}
              />
            ))}
          </div>

          {/* Tampilkan Wishlist */}
          <h2 className="text-2xl font-bold mt-8 mb-4">Wishlist</h2>
          {wishlist.length === 0 ? (
            <p className="text-gray-500">Wishlist Anda kosong.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={true}
                  addToWishlist={addToWishlist}
                  removeFromWishlist={removeFromWishlist}
                />
              ))}
            </div>
          )}
        </main>

        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </CartProvider>
  );
}

export default App;
