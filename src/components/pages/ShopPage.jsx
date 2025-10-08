import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import RecentlyViewed from "@/components/organisms/RecentlyViewed";
import { useCart } from "@/App";
import CategorySidebar from "@/components/organisms/CategorySidebar";
import CartPanel from "@/components/organisms/CartPanel";
import Header from "@/components/organisms/Header";
import ProductGrid from "@/components/organisms/ProductGrid";
import DailyDeals from "@/components/organisms/DailyDeals";
import productService from "@/services/api/productService";
function ShopPage() {
  const { addToCart, recentlyViewed } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || 
      (selectedCategory === "Flash Sales" ? product.salePrice : product.category === selectedCategory);
    const matchesSearch =
      searchQuery === "" ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header
        onSearch={setSearchQuery}
        onOpenCart={() => setIsCartOpen(true)}
      />
      
<div className="pt-20 sm:pt-24">
        <DailyDeals products={products} onAddToCart={addToCart} />
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            <CategorySidebar
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>

      <CartPanel
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RecentlyViewed 
          products={recentlyViewed} 
          onAddToCart={addToCart}
        />
      </div>
    </div>
  );
}

export default ShopPage;