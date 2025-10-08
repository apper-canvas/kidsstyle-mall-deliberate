import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ProductCard = ({ product, onAddToCart }) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden group hover:scale-[1.03]"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-error text-white px-4 py-2 rounded-lg font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-display font-semibold text-lg text-gray-800 mb-1 line-clamp-2">
          {product.title}
        </h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-display font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdded}
            size="sm"
            icon={isAdded ? "Check" : "ShoppingCart"}
            className={cn(
              isAdded && "bg-success hover:brightness-100"
            )}
          >
            {isAdded ? "Added!" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;