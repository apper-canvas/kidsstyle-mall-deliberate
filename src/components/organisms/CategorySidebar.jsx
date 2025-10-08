import React, { useEffect, useState } from "react";
import CategoryButton from "@/components/molecules/CategoryButton";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
const categories = [
  { id: "all", name: "All Products", icon: "Grid3x3" },
  { 
    id: "kids-clothing", 
    name: "Kids Clothing", 
    icon: "Shirt",
    subcategories: [
      { id: "baby", name: "Baby (0-2)", icon: "Baby" },
      { id: "toddler", name: "Toddler (2-4)", icon: "Smile" },
      { id: "kids", name: "Kids (4-8)", icon: "User" },
      { id: "teen", name: "Teen (8+)", icon: "UserCircle" }
    ]
  },
  { id: "accessories", name: "Accessories", icon: "Watch" },
  { id: "toys", name: "Toys", icon: "Gamepad2" },
  { id: "home-goods", name: "Home Goods", icon: "Home" },
  { id: "mom-dad", name: "Mom & Dad", icon: "Users" }
];

const CategorySidebar = ({ products, selectedCategory, selectedSubcategory, onCategoryChange, onSubcategoryChange }) => {
  const [categoryCounts, setCategoryCounts] = useState({});
  const [expandedCategory, setExpandedCategory] = useState(null);
useEffect(() => {
    const counts = {};
    const subcategoryCounts = {};
    
    if (products && Array.isArray(products)) {
      products.forEach((product) => {
        const category = product.category;
        counts[category] = (counts[category] || 0) + 1;
        
        if (product.subcategory) {
          const subKey = `${category}-${product.subcategory}`;
          subcategoryCounts[subKey] = (subcategoryCounts[subKey] || 0) + 1;
        }
      });
    }
    
    setCategoryCounts({ ...counts, ...subcategoryCounts });
  }, [products]);

const getCategoryCount = (categoryName, subcategory = null) => {
    if (categoryName === "All Products") {
      return products?.length || 0;
    }
    
    if (subcategory) {
      const subKey = `${categoryName}-${subcategory}`;
      return categoryCounts[subKey] || 0;
    }
    
    return categoryCounts[categoryName] || 0;
  };

  const handleCategoryClick = (category) => {
    if (category.subcategories) {
      if (expandedCategory === category.name) {
        setExpandedCategory(null);
      } else {
        setExpandedCategory(category.name);
        onCategoryChange(category.name);
      }
    } else {
      setExpandedCategory(null);
      onCategoryChange(category.name);
    }
  };

  const handleSubcategoryClick = (categoryName, subcategory) => {
    onSubcategoryChange(categoryName, subcategory);
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
            <div key={category.id}>
              <div className="relative">
                <CategoryButton
                  category={category.name}
                  icon={category.icon}
                  isActive={selectedCategory === category.name && !selectedSubcategory}
                  onClick={() => handleCategoryClick(category)}
                  count={getCategoryCount(category.name)}
                />
                {category.subcategories && (
                  <button
                    onClick={() => setExpandedCategory(expandedCategory === category.name ? null : category.name)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded transition-all"
                  >
                    <ApperIcon
                      name="ChevronDown"
                      size={16}
                      className={cn(
                        "transition-transform duration-200",
                        expandedCategory === category.name && "rotate-180",
                        selectedCategory === category.name && !selectedSubcategory ? "text-white" : "text-gray-500"
                      )}
                    />
                  </button>
                )}
              </div>
              
              {category.subcategories && expandedCategory === category.name && (
                <div className="ml-4 mt-1 space-y-1 overflow-hidden">
                  {category.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleSubcategoryClick(category.name, sub.name)}
                      className={cn(
                        "flex items-center gap-2 w-full px-4 py-2 rounded-lg transition-all duration-200 text-sm",
                        "hover:bg-secondary/10",
                        selectedSubcategory === sub.name
                          ? "bg-secondary text-white shadow-md"
                          : "bg-white text-gray-600 shadow-card"
                      )}
                    >
                      <ApperIcon
                        name={sub.icon}
                        size={16}
                        className={selectedSubcategory === sub.name ? "text-white" : "text-secondary"}
                      />
                      <span className="flex-1 text-left font-medium">{sub.name}</span>
                      <span
                        className={cn(
                          "text-xs font-semibold px-2 py-0.5 rounded-full",
                          selectedSubcategory === sub.name
                            ? "bg-white/20"
                            : "bg-secondary/10 text-secondary"
                        )}
                      >
                        {getCategoryCount(category.name, sub.name)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Mobile Category Pills */}
<div className="lg:hidden overflow-x-auto pb-4 -mx-4 px-4">
        <div className="flex gap-2 min-w-max">
          {categories.map((category) => (
            <React.Fragment key={category.id}>
              <button
                onClick={() => handleCategoryClick(category)}
                className={cn(
                  "px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 flex items-center gap-2",
                  selectedCategory === category.name && !selectedSubcategory
                    ? "bg-primary text-white shadow-md scale-105"
                    : "bg-white text-gray-700 shadow-card hover:bg-secondary/10"
                )}
              >
                <ApperIcon name={category.icon} size={16} />
                {category.name}
                <span
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded-full",
                    selectedCategory === category.name && !selectedSubcategory
                      ? "bg-white/20"
                      : "bg-primary/10 text-primary"
                  )}
                >
                  {getCategoryCount(category.name)}
                </span>
                {category.subcategories && (
                  <ApperIcon
                    name="ChevronDown"
                    size={14}
                    className={cn(
                      "transition-transform duration-200",
                      expandedCategory === category.name && "rotate-180"
                    )}
                  />
                )}
              </button>
              
              {category.subcategories && expandedCategory === category.name && (
                <>
                  {category.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleSubcategoryClick(category.name, sub.name)}
                      className={cn(
                        "px-3 py-2 rounded-full font-medium text-xs whitespace-nowrap transition-all duration-200 flex items-center gap-1.5",
                        selectedSubcategory === sub.name
                          ? "bg-secondary text-white shadow-md scale-105"
                          : "bg-white text-gray-600 shadow-card hover:bg-secondary/10"
                      )}
                    >
                      <ApperIcon name={sub.icon} size={14} />
                      {sub.name}
                      <span
                        className={cn(
                          "text-xs px-1.5 py-0.5 rounded-full",
                          selectedSubcategory === sub.name
                            ? "bg-white/20"
                            : "bg-secondary/10 text-secondary"
                        )}
                      >
                        {getCategoryCount(category.name, sub.name)}
                      </span>
                    </button>
                  ))}
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

export default CategorySidebar;