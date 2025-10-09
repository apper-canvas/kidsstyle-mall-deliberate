import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import CategorySidebar from "@/components/organisms/CategorySidebar";
import CartPanel from "@/components/organisms/CartPanel";
import Header from "@/components/organisms/Header";
import ProductGrid from "@/components/organisms/ProductGrid";
import RecentlyViewed from "@/components/organisms/RecentlyViewed";
import productService from "@/services/api/productService";
import categoryService from "@/services/api/categoryService";

const ShopPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  const subcategoryId = searchParams.get("subcategory");
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addToCart, recentlyViewed } = useCart();

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAll({
        categoryId,
        subcategoryId
      });
      setProducts(data || []);
    } catch (err) {
      console.error("Failed to load products:", err);
      setError(err?.message || "Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      const data = await categoryService.getAll();
      setCategories(data || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [categoryId, subcategoryId]);

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCategoryChange = (category) => {
    const params = new URLSearchParams();
    if (category && category !== "All") {
      params.set("category", category);
    }
    navigate(`/?${params.toString()}`);
  };

  const handleSubcategoryChange = (categoryName, subcategory) => {
    const params = new URLSearchParams();
    if (categoryName) {
      params.set("category", categoryName);
    }
    if (subcategory) {
      params.set("subcategory", subcategory);
    }
    navigate(`/?${params.toString()}`);
  };
const handleClearFilter = () => {
    navigate("/");
  };

  const getActiveCategoryName = () => {
    if (!categoryId || !categories.length) return null;
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return null;
    
    if (subcategoryId && category.subcategories) {
      const subcategory = category.subcategories.find(sub => sub.id === subcategoryId);
      return subcategory ? `${category.name} > ${subcategory.name}` : category.name;
    }
    return category.name;
  };

  const filteredProducts = products.filter(product => {
    if (!product) return false;
    
    const matchesSearch =
      searchQuery === "" ||
      product?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product?.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });
return (
    <div className="min-h-screen bg-background">
      <Header
        onSearch={setSearchQuery}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {categoryId && (
          <div className="mb-4 flex items-center gap-3 bg-secondary/10 rounded-lg px-4 py-3">
            <ApperIcon name="Filter" size={20} className="text-secondary" />
            <span className="text-sm font-medium text-gray-700">
              Filtered by: {getActiveCategoryName()}
            </span>
            <button
              onClick={handleClearFilter}
              className="ml-auto flex items-center gap-2 text-sm text-secondary hover:text-secondary/80 transition-colors"
            >
              <ApperIcon name="X" size={16} />
              Clear Filter
            </button>
          </div>
        )}
        
<div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64 flex-shrink-0">
            <CategorySidebar
              products={products}
              categories={categories}
              categoriesLoading={categoriesLoading}
              selectedCategory={categoryId}
              selectedSubcategory={subcategoryId}
              onCategoryChange={handleCategoryChange}
              onSubcategoryChange={handleSubcategoryChange}
            />
          </aside>
          
          <main className="flex-1">
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              error={error}
            />
          </main>
        </div>
</div>

      <CartPanel
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <RecentlyViewed 
          products={recentlyViewed} 
          onAddToCart={addToCart}
        />
      </div>
    </div>
  );
};

export default ShopPage;