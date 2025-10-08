import React, { useEffect, useState } from "react";
import CategoryButton from "@/components/molecules/CategoryButton";
import ApperIcon from "@/components/atoms/ApperIcon";
import { cn } from "@/utils/cn";
const categories = [
  { id: "all", name: "All Products", icon: "Grid3x3" },
  { id: "kids-clothing", name: "Kids Clothing", icon: "Shirt" },
  { id: "accessories", name: "Accessories", icon: "Watch" },
  { id: "toys", name: "Toys", icon: "Gamepad2" },
  { id: "home-goods", name: "Home Goods", icon: "Home" },
  { id: "mom-dad", name: "Mom & Dad", icon: "Users" }
];

const CategorySidebar = ({ products, selectedCategory, onCategoryChange }) => {
  const [categoryCounts, setCategoryCounts] = useState({});

  useEffect(() => {
    const counts = {};
    products.forEach((product) => {
      const category = product.category;
      counts[category] = (counts[category] || 0) + 1;
    });
    setCategoryCounts(counts);
  }, [products]);

  const getCategoryCount = (categoryName) => {
    if (categoryName === "All Products") {
      return products.length;
    }
    return categoryCounts[categoryName] || 0;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-60 shrink-0">
        <div className="sticky top-24 space-y-2">
          <h2 className="font-display font-bold text-xl text-gray-800 mb-4 px-4">
            Categories
          </h2>
          {categories.map((category) => (
            <CategoryButton
              key={category.id}
              category={category.name}
              icon={category.icon}
              isActive={selectedCategory === category.name}
              onClick={() => onCategoryChange(category.name)}
              count={getCategoryCount(category.name)}
            />
          ))}
        </div>
      </aside>

      {/* Mobile Category Pills */}
      <div className="lg:hidden overflow-x-auto pb-4 -mx-4 px-4">
        <div className="flex gap-2 min-w-max">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.name)}
              className={cn(
                "px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 flex items-center gap-2",
                selectedCategory === category.name
                  ? "bg-primary text-white shadow-md scale-105"
                  : "bg-white text-gray-700 shadow-card hover:bg-secondary/10"
              )}
            >
              <ApperIcon name={category.icon} size={16} />
              {category.name}
              <span
                className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full",
                  selectedCategory === category.name
                    ? "bg-white/20"
                    : "bg-primary/10 text-primary"
                )}
              >
                {getCategoryCount(category.name)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default CategorySidebar;