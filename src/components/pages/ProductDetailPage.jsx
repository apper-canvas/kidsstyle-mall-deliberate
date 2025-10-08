import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import productService from "@/services/api/productService";
import { cn } from "@/utils/cn";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  async function loadProduct() {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getById(id);
      if (!data) {
        setError("Product not found");
      } else {
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      }
    } catch (err) {
      setError("Failed to load product details. Please try again.");
      console.error("Error loading product:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleAddToCart() {
    if (!product.inStock) return;
    
    if (product.category === "Clothing" && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    setIsAdded(true);
    toast.success(`${product.title} added to cart!`);
    
    setTimeout(() => setIsAdded(false), 2000);
  }

  function handleQuantityChange(change) {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Loading message="Loading product details..." />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Error
            message={error || "Product not found"}
            onRetry={loadProduct}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link
            to="/"
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Home
          </Link>
          <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
          <span className="text-gray-600">{product.category}</span>
          <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
          <span className="text-gray-800 font-semibold line-clamp-1">
            {product.title}
          </span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-card overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={product.images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-error text-white px-6 py-3 rounded-lg font-semibold text-lg">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        "relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200",
                        selectedImage === index
                          ? "border-primary shadow-md scale-105"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <img
                        src={image}
                        alt={`${product.title} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Title and Category */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                    {product.category}
                  </Badge>
                  {product.inStock ? (
                    <Badge className="bg-success/10 text-success border-success/20">
                      In Stock
                    </Badge>
                  ) : (
                    <Badge className="bg-error/10 text-error border-error/20">
                      Out of Stock
                    </Badge>
                  )}
                </div>
                <h1 className="font-display font-bold text-3xl lg:text-4xl text-gray-800 mb-2">
                  {product.title}
                </h1>
                {product.ageRange && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <ApperIcon name="Users" size={18} />
                    <span className="text-sm">
                      Recommended for ages {product.ageRange}
                    </span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-display font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              {/* Description */}
              <div>
                <h2 className="font-display font-semibold text-lg text-gray-800 mb-2">
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {product.fullDescription}
                </p>
              </div>

              {/* Size Selection (for Clothing) */}
              {product.category === "Clothing" && product.sizes && (
                <div>
                  <h3 className="font-display font-semibold text-lg text-gray-800 mb-3">
                    Select Size
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "px-6 py-3 rounded-lg font-semibold transition-all duration-200 min-w-[80px]",
                          selectedSize === size
                            ? "bg-primary text-white shadow-md scale-105"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div>
                <h3 className="font-display font-semibold text-lg text-gray-800 mb-3">
                  Quantity
                </h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-12 h-12 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    <ApperIcon name="Minus" size={20} />
                  </button>
                  <span className="text-2xl font-display font-semibold text-gray-800 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                    className="w-12 h-12 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    <ApperIcon name="Plus" size={20} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAdded}
                  size="lg"
                  icon={isAdded ? "Check" : "ShoppingCart"}
                  className={cn(
                    "flex-1",
                    isAdded && "bg-success hover:brightness-100"
                  )}
                >
                  {isAdded ? "Added to Cart!" : "Add to Cart"}
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  size="lg"
                  icon="ArrowLeft"
                  className="sm:w-auto"
                >
                  Continue Shopping
                </Button>
              </div>

              {/* Product Features */}
              <div className="border-t border-gray-200 pt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <ApperIcon
                    name="Truck"
                    size={20}
                    className="text-secondary mt-1"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      Free Shipping
                    </p>
                    <p className="text-sm text-gray-600">
                      On orders over $50
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ApperIcon
                    name="RotateCcw"
                    size={20}
                    className="text-secondary mt-1"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      Easy Returns
                    </p>
                    <p className="text-sm text-gray-600">
                      30-day return policy
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ApperIcon
                    name="Shield"
                    size={20}
                    className="text-secondary mt-1"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      Secure Payment
                    </p>
                    <p className="text-sm text-gray-600">
                      Your payment is safe
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ProductDetailPage;