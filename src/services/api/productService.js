import productsData from "@/services/mockData/products.json";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const productService = {
  getAll: async () => {
    await delay(300);
    return [...productsData];
  },

  getById: async (id) => {
    await delay(200);
    const product = productsData.find((item) => item.Id === parseInt(id));
    return product ? { ...product } : null;
  },

  getByCategory: async (category) => {
    await delay(250);
    if (!category || category === "All Products") {
      return [...productsData];
    }
    return productsData.filter((item) => item.category === category);
  },

  searchProducts: async (query) => {
    await delay(200);
    const searchTerm = query.toLowerCase();
    return productsData.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm)
    );
  }
};

export default productService;