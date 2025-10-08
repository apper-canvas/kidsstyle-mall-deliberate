import { Link } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { useCart } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Badge from "@/components/atoms/Badge";


const Header = ({ onSearch, onOpenCart }) => {
  const { cart } = useCart();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const totalItems = cart?.items?.reduce((sum, item) => sum + (item?.quantity || 0), 0) || 0;
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
          {/* Categories Button - Mobile */}
          {/* Categories Button - Mobile */}

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
        {/* Mobile Search */}
        <div className="pb-4 md:hidden">
          <SearchBar onSearch={onSearch} placeholder="Search products..." />
        </div>
      </div>
    </header>
  );
};

export default Header;