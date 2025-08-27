export interface Category {
  id: string;
  name: string;
}

export const categoryService = {
  // Get all categories
  getAllCategories: async (): Promise<Category[]> => {
    try {
      const response = await fetch('/data/category.csv');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const csvText = await response.text();
      const lines = csvText.trim().split('\n');
      
      const categories: Category[] = [];
      
      // Skip header row and process data rows
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length >= 2) {
          categories.push({
            id: values[0].trim(),
            name: values[1].trim()
          });
        }
      }
      
      return categories;
    } catch (error) {
      console.error('Error loading categories:', error);
      return [];
    }
  }
};
