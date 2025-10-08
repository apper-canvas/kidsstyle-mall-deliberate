import { Link } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import { useCart } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Badge from "@/components/atoms/Badge";

// Categories array - matches CategorySidebar for consistency
const categories = [
  { id: "all", name: "All Products", icon: "Grid3x3" },
  { id: "flash-sales", name: "Flash Sales", icon: "Flame" },
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
const Header = ({ onSearch, onOpenCart }) => {
  const { totalItems } = useCart();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
<div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <ApperIcon name="ShoppingBag" className="text-white" size={24} />
            </div>
            <span className="ml-2 text-xl font-bold font-display text-gray-800 hidden sm:block">
              Kids Clothing Store
            </span>
          </Link>

          {/* Categories Dropdown - Desktop */}
          <div className="relative hidden lg:block" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onMouseEnter={() => setIsDropdownOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-medium hover:shadow-lg transition-all duration-200"
            >
              <ApperIcon name="Grid3x3" size={20} />
              <span>Categories</span>
              <ApperIcon 
                name={isDropdownOpen ? "ChevronUp" : "ChevronDown"} 
                size={16} 
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div 
                className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <div className="py-2">
                  {categories.map((category) => (
                    <div key={category.id}>
                      {category.subcategories ? (
                        <div className="group relative">
                          <Link
                            to={`/?category=${category.id}`}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/10 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <ApperIcon name={category.icon} size={20} className="text-primary" />
                            <span className="font-medium text-gray-700">{category.name}</span>
                            <ApperIcon name="ChevronRight" size={16} className="ml-auto text-gray-400" />
                          </Link>
                          {/* Subcategories */}
                          <div className="hidden group-hover:block absolute left-full top-0 ml-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2">
                            {category.subcategories.map((sub) => (
                              <Link
                                key={sub.id}
                                to={`/?category=${category.id}&subcategory=${sub.id}`}
                                className="flex items-center gap-3 px-4 py-2 hover:bg-secondary/10 transition-colors"
                                onClick={() => setIsDropdownOpen(false)}
                              >
                                <ApperIcon name={sub.icon} size={18} className="text-secondary" />
                                <span className="text-gray-700">{sub.name}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link
                          to={`/?category=${category.id}`}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/10 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <ApperIcon name={category.icon} size={20} className="text-primary" />
                          <span className="font-medium text-gray-700">{category.name}</span>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Categories Button - Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 hover:bg-secondary/10 rounded-lg transition-all duration-200"
          >
            <ApperIcon name="Menu" size={24} className="text-gray-700" />
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <SearchBar onSearch={onSearch} placeholder="Search for toys, clothing, and more..." />
          </div>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative p-3 hover:bg-secondary/10 rounded-lg transition-all duration-200 group shrink-0"
          >
            <ApperIcon
              name="ShoppingCart"
              size={28}
              className="text-gray-700 group-hover:text-primary transition-colors"
            />
            {totalItems > 0 && (
              <Badge className="absolute -top-1 -right-1 animate-bounce">
                {totalItems}
              </Badge>
            )}
          </button>
        </div>

        {/* Mobile Categories Modal */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 lg:hidden animate-in fade-in duration-200">
            <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-2xl animate-in slide-in-from-left duration-300">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold font-display text-gray-800">Categories</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={24} className="text-gray-600" />
                </button>
              </div>
              <div className="overflow-y-auto h-[calc(100vh-73px)] py-2">
                {categories.map((category) => (
                  <div key={category.id} className="border-b border-gray-100 last:border-0">
                    <Link
                      to={`/?category=${category.id}`}
                      className="flex items-center gap-3 px-4 py-4 hover:bg-secondary/10 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <ApperIcon name={category.icon} size={24} className="text-primary" />
                      <span className="font-medium text-gray-700 text-lg">{category.name}</span>
                    </Link>
                    {category.subcategories && (
                      <div className="bg-gray-50 pl-8">
                        {category.subcategories.map((sub) => (
                          <Link
                            key={sub.id}
                            to={`/?category=${category.id}&subcategory=${sub.id}`}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/10 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <ApperIcon name={sub.icon} size={20} className="text-secondary" />
                            <span className="text-gray-600">{sub.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Search */}
        <div className="pb-4 md:hidden">
          <SearchBar onSearch={onSearch} placeholder="Search products..." />
        </div>
      </div>
    </header>
  );
};

export default Header;