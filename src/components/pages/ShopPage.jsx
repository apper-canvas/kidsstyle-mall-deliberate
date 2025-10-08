import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import CategorySidebar from "@/components/organisms/CategorySidebar";
import ProductGrid from "@/components/organisms/ProductGrid";
import CartPanel from "@/components/organisms/CartPanel";
import productService from "@/services/api/productService";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productService.getAll();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      setError("Failed to load products. Please try again.");
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (selectedCategory !== "All Products") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, products]);

  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.productId === product.Id.toString()
      );

      if (existingItem) {
        toast.success(`Added another ${product.title} to cart!`);
        return prevItems.map((item) =>
          item.productId === product.Id.toString()
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      toast.success(`${product.title} added to cart!`);
      return [
        ...prevItems,
        {
          productId: product.Id.toString(),
          title: product.title,
          price: product.price,
          quantity: 1,
          image: product.image
        }
      ];
    });
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.productId !== productId)
    );
    toast.info("Item removed from cart");
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleClearFilters = () => {
    setSelectedCategory("All Products");
    setSearchQuery("");
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header
        onSearch={handleSearch}
        cartItemCount={totalCartItems}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="pt-20 sm:pt-24 md:pt-28 pb-8">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <CategorySidebar
            products={products}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />

          <div className="lg:flex lg:gap-8">
            <CategorySidebar
              products={products}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />

            <div className="flex-1 min-w-0">
              <div className="mb-6">
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-gray-800 mb-2">
                  {selectedCategory}
                </h2>
                <p className="text-gray-600">
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1 ? "product" : "products"} found
                </p>
              </div>

              <ProductGrid
                products={filteredProducts}
                loading={loading}
                error={error}
                onAddToCart={handleAddToCart}
                onRetry={handleClearFilters}
              />
            </div>
          </div>
        </div>
      </main>

      <CartPanel
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
};

export default ShopPage;