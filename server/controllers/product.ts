import { Request, Response } from "express";
import { storage } from "../storage";
import { insertProductSchema } from "@shared/schema";
import { z } from "zod";

const productController = {
  // Get related products based on category and current product ID
  getRelatedProducts: async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.id);
      
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      // First get the product to determine its category
      const product = await storage.getProductById(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const { category } = product;
      
      // Get products in the same category, excluding the current product
      const products = await storage.getProducts({ category });
      
      // Filter out the current product and limit to 5 items
      const relatedProducts = products
        .filter(p => p.id !== productId)
        .slice(0, 5);
      
      res.json(relatedProducts);
    } catch (error) {
      console.error("Error fetching related products:", error);
      res.status(500).json({ message: "Failed to fetch related products" });
    }
  },
  // Get all products with optional filtering and sorting
  getAllProducts: async (req: Request, res: Response) => {
    try {
      const { category, search, minPrice, maxPrice, sortBy } = req.query;
      
      const filters = {
        category: category as string | undefined,
        search: search as string | undefined,
        minPrice: minPrice ? parseInt(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice as string) : undefined,
        sortBy: sortBy as string | undefined
      };
      
      const products = await storage.getProducts(filters);
      
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  },
  
  // Get a specific product by ID
  getProductById: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  },
  
  // Get products by category
  getProductsByCategory: async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      
      if (!category) {
        return res.status(400).json({ message: "Category is required" });
      }
      
      const products = await storage.getProductsByCategory(category);
      
      res.json(products);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  },
  
  // Get deal products (products with discounts)
  getDeals: async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      
      const products = await storage.getDeals(limit);
      
      res.json(products);
    } catch (error) {
      console.error("Error fetching deals:", error);
      res.status(500).json({ message: "Failed to fetch deals" });
    }
  },
  
  // Get top selling products
  getTopSellingProducts: async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      
      const products = await storage.getTopSellingProducts(limit);
      
      res.json(products);
    } catch (error) {
      console.error("Error fetching top selling products:", error);
      res.status(500).json({ message: "Failed to fetch top selling products" });
    }
  },
  
  // Create a new product
  createProduct: async (req: Request, res: Response) => {
    try {
      // Validate product data
      const productData = insertProductSchema.parse(req.body);
      
      const product = await storage.createProduct(productData);
      
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid product data", 
          errors: error.errors 
        });
      }
      
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  },
  
  // Update an existing product
  updateProduct: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const productData = req.body;
      
      const updatedProduct = await storage.updateProduct(id, productData);
      
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  },
  
  // Delete a product
  deleteProduct: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const success = await storage.deleteProduct(id);
      
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  }
};

export default productController;
