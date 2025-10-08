import productsData from "@/services/mockData/products.json";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const enhanceProductData = (product) => {
  const baseImage = product.image;
  const category = product.category;
  
  const enhancedProduct = {
    ...product,
    images: [
      baseImage,
      baseImage.replace('.jpg', '-2.jpg'),
      baseImage.replace('.jpg', '-3.jpg'),
      baseImage.replace('.jpg', '-4.jpg')
    ],
    fullDescription: `${product.description} This high-quality ${category.toLowerCase()} item is perfect for kids and families. Made with care and attention to detail, it offers great value and lasting durability. Ideal for everyday use or special occasions, this product combines style, comfort, and functionality in one package.`,
    sizes: category === "Kids Clothing" ? ["XS", "S", "M", "L", "XL"] : undefined,
    ageRange: product.subcategory 
      ? product.subcategory 
      : category === "Toys" 
        ? "3-8 years" 
        : category === "Kids Clothing" 
          ? "2-12 years" 
          : "All ages",
    subcategory: product.subcategory
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