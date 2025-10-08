import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCart } from "@/App";
import DailyDeals from "@/components/organisms/DailyDeals";
import CartPanel from "@/components/organisms/CartPanel";
import Header from "@/components/organisms/Header";
import ProductGrid from "@/components/organisms/ProductGrid";
import RecentlyViewed from "@/components/organisms/RecentlyViewed";
import productService from "@/services/api/productService";
import categoryService from "@/services/api/categoryService";
function ShopPage() {
  const { addToCart, recentlyViewed } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

useEffect(() => {
loadProducts();
loadCategories();
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

  async function loadCategories() {
    try {
      setCategoriesLoading(true);
      setCategoriesError(null);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      setCategoriesError(err.message);
      toast.error("Failed to load categories");
    } finally {
      setCategoriesLoading(false);
    }
  }

const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchQuery === "" ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
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
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              error={error}
              categories={categories}
              categoriesLoading={categoriesLoading}
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