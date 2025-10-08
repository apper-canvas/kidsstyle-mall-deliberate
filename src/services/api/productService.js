import productsData from "@/services/mockData/products.json";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getSizeRecommendation = (product) => {
  if (product.category !== "Kids Clothing") return undefined;
  
  // Return size recommendation from product data if available
  if (product.sizeRecommendation) {
    return product.sizeRecommendation;
  }
  
  // Default recommendation if not specified
  return "Fits true to size";
};

const enhanceProductData = (product) => {
const baseImage = product.image;
  const category = product.category;
  const sizeRecommendation = getSizeRecommendation(product);
  
  // Calculate stock status
  const stockLevel = product.stockLevel || 0;
  let stockStatus = 'out-of-stock';
  if (stockLevel > 5) {
    stockStatus = 'in-stock';
  } else if (stockLevel > 0) {
    stockStatus = 'low-stock';
  }
  
  const enhancedProduct = {
...product,
    images: [
      baseImage,                                    // Main front view
      baseImage.replace('.jpg', '-2.jpg'),         // Side angle
      baseImage.replace('.jpg', '-3.jpg'),         // Back view
      baseImage.replace('.jpg', '-lifestyle.jpg'), // Lifestyle shot (in use)
      baseImage.replace('.jpg', '-detail.jpg')     // Close-up detail shot
    ],
    fullDescription: `${product.description} This high-quality ${category.toLowerCase()} item is perfect for kids and families. Made with care and attention to detail, it offers great value and lasting durability. Ideal for everyday use or special occasions, this product combines style, comfort, and functionality in one package.`,
    sizes: category === "Kids Clothing" ? ["XS", "S", "M", "L", "XL"] : undefined,
    sizeRecommendation: sizeRecommendation,
    ageRange: product.subcategory 
      ? product.subcategory 
      : category === "Toys" 
        ? "3-8 years" 
        : category === "Kids Clothing" 
          ? "2-12 years" 
          : "All ages",
    subcategory: product.subcategory,
    stockLevel: stockLevel,
    stockStatus: stockStatus,
    sizeStock: product.sizeStock
  };
  
  return enhancedProduct;
};

const productService = {
  getAll: async () => {
    await delay(300);
    return productsData.map(enhanceProductData);
  },

  getById: async (id) => {
    await delay(200);
    const product = productsData.find((item) => item.Id === parseInt(id));
    return product ? enhanceProductData(product) : null;
  },

  getByCategory: async (category) => {
    await delay(250);
    if (!category || category === "All Products") {
      return productsData.map(enhanceProductData);
    }
    return productsData
      .filter((item) => item.category === category)
      .map(enhanceProductData);
  },

  searchProducts: async (query) => {
    await delay(200);
    const searchTerm = query.toLowerCase();
    return productsData
      .filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm) ||
          item.category.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm)
      )
      .map(enhanceProductData);
  }
};

export default productService;