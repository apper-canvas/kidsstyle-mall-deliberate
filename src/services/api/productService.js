import productsData from "@/services/mockData/products.json";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getSizeRecommendation = (product) => {
  if (product?.sizeRecommendation) {
    return product.sizeRecommendation;
  }
  
  // Default recommendation if not specified
  return "Fits true to size";
};

const getAll = async (filters = {}) => {
  await delay(300);
  let filteredProducts = [...productsData];
if (filters.categoryId) {
    filteredProducts = filteredProducts.filter(
      product => product.categoryId === filters.categoryId
    );
    
    if (filters.subcategoryId) {
      filteredProducts = filteredProducts.filter(
        product => product.subcategoryId === filters.subcategoryId
      );
    }
  }
  
  return filteredProducts;
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

// Complementary product relationships for "Frequently Bought Together"
const complementaryMap = {
  1: [2, 3, 15], // Rainbow Unicorn T-Shirt pairs with shorts, dress, sneakers
  2: [1, 4, 16], // Dinosaur Adventure Shorts pairs with shirts, jacket
  3: [1, 5, 17], // Princess Sparkle Dress pairs with accessories
  4: [2, 6, 18], // Superhero Cape Jacket pairs with casual items
  5: [3, 7, 19], // Ocean Explorer Swimsuit pairs with beach items
  6: [4, 8, 20], // Space Rocket Pajamas pairs with nightwear
  7: [5, 9, 1],  // Butterfly Garden Tutu pairs with dresses
  8: [6, 10, 2], // Monster Truck Hoodie pairs with casual wear
  9: [7, 11, 3], // Fairy Wings Ballet Set pairs with dress-up items
  10: [8, 12, 4] // Dragon Slayer Costume pairs with imaginative play items
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
  },

  getRelatedProducts: async (productId, limit = 6) => {
    await delay(200);
    const currentProduct = productsData.find((item) => item.Id === parseInt(productId));
    if (!currentProduct) return [];

    // Find products in same category with similar price range (±50%)
    const priceMin = currentProduct.price * 0.5;
    const priceMax = currentProduct.price * 1.5;

    const related = productsData
.filter((item) => 
        item.Id !== parseInt(productId) &&
        item.category === currentProduct.category &&
        item.price >= priceMin &&
        item.price <= priceMax
      )
      .sort(() => Math.random() - 0.5) // Randomize order
      .slice(0, limit)
      .map(enhanceProductData);

    return related;
  },

  getComplementaryProducts: async (productId, limit = 4) => {
    await delay(200);
    const currentProduct = productsData.find((item) => item.Id === parseInt(productId));
    if (!currentProduct) return [];

    // Get predefined complementary products
    const complementaryIds = complementaryMap[parseInt(productId)] || [];
    
    const complementary = complementaryIds
      .map(id => productsData.find(item => item.Id === id))
      .filter(Boolean)
      .slice(0, limit)
.map(enhanceProductData);
    // If we don't have enough complementary products, fill with random from different categories
    if (complementary.length < limit) {
      const priceMin = currentProduct?.price ? currentProduct.price * 0.8 : 0;
      const additionalProducts = productsData
        .filter((item) => 
          item.Id !== parseInt(productId) &&
          item.category !== currentProduct.category &&
          item.price >= priceMin
        )
        .sort(() => Math.random() - 0.5)
        .slice(0, limit - complementary.length)
        .map(enhanceProductData);

      complementary.push(...additionalProducts);
    }

    return complementary;
  }
};

export default productService;