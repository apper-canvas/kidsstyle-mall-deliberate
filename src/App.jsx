import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import React, { createContext, useContext, useEffect, useState } from "react";
import recentlyViewedService from "@/services/api/recentlyViewedService";
import Error from "@/components/ui/Error";
import ShopPage from "@/components/pages/ShopPage";
import ProductDetailPage from "@/components/pages/ProductDetailPage";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

function App() {
const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    loadRecentlyViewed();
  }, []);

  const loadRecentlyViewed = async () => {
    const products = await recentlyViewedService.getAll();
    setRecentlyViewed(products);
  };

  const trackProductView = (productId) => {
    recentlyViewedService.trackView(productId);
    loadRecentlyViewed();
  };

  const clearRecentlyViewed = () => {
    recentlyViewedService.clear();
    setRecentlyViewed([]);
  };
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const cartValue = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    totalItems,
    recentlyViewed,
    trackProductView,
    clearRecentlyViewed
  };

  return (
<CartContext.Provider value={cartValue}>
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Routes>
          <Route path="/" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </BrowserRouter>
    </CartContext.Provider>
  );
}

export default App;