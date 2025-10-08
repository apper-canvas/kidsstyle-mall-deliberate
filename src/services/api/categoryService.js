import categoriesData from "@/services/mockData/categories.json";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const categoryService = {
  getAll: async () => {
    await delay(250);
    return categoriesData.map(category => ({
      ...category,
      subcategories: category.subcategories ? [...category.subcategories] : []
    }));
  },

  getById: async (id) => {
    await delay(250);
    const category = categoriesData.find((cat) => cat.id === id);
    if (!category) {
      throw new Error(`Category with id ${id} not found`);
    }
    return {
      ...category,
      subcategories: category.subcategories ? [...category.subcategories] : []
    };
  },

  getByName: async (name) => {
    await delay(250);
    const category = categoriesData.find((cat) => cat.name === name);
    if (!category) {
      throw new Error(`Category with name ${name} not found`);
    }
    return {
      ...category,
      subcategories: category.subcategories ? [...category.subcategories] : []
    };
  },

  getSubcategories: async (categoryName) => {
    await delay(250);
    const category = categoriesData.find((cat) => cat.name === categoryName);
    if (!category) {
      throw new Error(`Category with name ${categoryName} not found`);
    }
    return category.subcategories ? [...category.subcategories] : [];
  },

  getCategoryBySubcategory: async (subcategoryName) => {
    await delay(250);
    for (const category of categoriesData) {
      if (category.subcategories) {
        const subcategory = category.subcategories.find(
          (sub) => sub.name === subcategoryName
        );
        if (subcategory) {
          return {
            ...category,
            subcategories: [...category.subcategories]
          };
        }
      }
    }
    throw new Error(`Subcategory with name ${subcategoryName} not found`);
  },

  hasSubcategories: (categoryName) => {
    const category = categoriesData.find((cat) => cat.name === categoryName);
    return category ? (category.subcategories?.length || 0) > 0 : false;
  }
};

export default categoryService;