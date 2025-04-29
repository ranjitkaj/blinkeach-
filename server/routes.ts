import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import productController from "./controllers/product";
import userController from "./controllers/user";
import orderController from "./controllers/order";
import paymentController from "./controllers/payment";
import chatbotController from "./controllers/chatbot";
import categoryController from "./controllers/category";
import adminController from "./controllers/admin";
import uploadController, { upload } from "./controllers/upload";
import supportController from "./controllers/support";
import contactController from "./controllers/contact";
import cartController from "./controllers/cart";
import { setupAuth } from "./auth";
import ChatServer from "./chat";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  const { isAuthenticated, isAdmin } = setupAuth(app);
  
  // Prefix all routes with /api
  
  // Product routes
  app.get("/api/products", productController.getAllProducts);
  app.get("/api/products/deals", productController.getDeals);
  app.get("/api/products/top-selling", productController.getTopSellingProducts);
  app.get("/api/products/category/:category", productController.getProductsByCategory);
  app.get("/api/products/:id/related", productController.getRelatedProducts);
  app.get("/api/products/:id", productController.getProductById);
  app.post("/api/products", isAdmin, productController.createProduct);
  app.put("/api/products/:id", isAdmin, productController.updateProduct);
  app.delete("/api/products/:id", isAdmin, productController.deleteProduct);
  
  // Legacy User routes - to be replaced with auth routes
  // These will be deprecated in favor of the /api/auth/* routes
  app.post("/api/users/register", userController.register);
  app.post("/api/users/login", userController.login);
  app.get("/api/users/profile", isAuthenticated, userController.getProfile);
  app.put("/api/users/profile", isAuthenticated, userController.updateProfile);
  
  // Auth routes
  app.get("/api/auth/user", (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // Remove sensitive data before sending to client
    const { password, ...userWithoutPassword } = req.user as any;
    res.json(userWithoutPassword);
  });
  
  // New user profile routes
  app.get("/api/user/profile", isAuthenticated, (req, res) => {
    // The user object is already attached to req by the auth middleware
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    // Remove sensitive data before sending to client
    const { password, ...userWithoutPassword } = req.user as any;
    res.json(userWithoutPassword);
  });
  
  app.put("/api/user/profile", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const userId = (req.user as any).id;
      
      // Extract only the fields we want to allow updating
      const { fullName, phone, address, city, state, pincode } = req.body;
      const userData = { fullName, phone, address, city, state, pincode };
      
      // Update user in database
      const updatedUser = await storage.updateUser(userId, userData);
      
      if (!updatedUser) {
        return res.status(500).json({ message: "Failed to update profile" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
  
  // Profile picture upload route
  // This would typically use multer or another middleware for handling file uploads
  app.post("/api/user/profile-picture", isAuthenticated, async (req, res) => {
    try {
      // In a real implementation, we would:
      // 1. Use multer to handle the file upload
      // 2. Store the file in a cloud storage service or local filesystem
      // 3. Update the user profile with the file URL
      
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      // For now, we'll simulate a successful upload with a placeholder URL
      const userId = (req.user as any).id;
      const profilePictureUrl = `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`;
      
      const updatedUser = await storage.updateUser(userId, {
        profilePicture: profilePictureUrl
      });
      
      if (!updatedUser) {
        return res.status(500).json({ message: "Failed to update profile picture" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      res.status(500).json({ message: "Failed to upload profile picture" });
    }
  });
  
  // Order routes
  app.get("/api/orders", isAdmin, orderController.getAllOrders);
  
  // Current authenticated user's orders
  app.get("/api/orders/user", (req, res) => {
    // This now uses a dedicated method that checks authentication internally
    return orderController.getCurrentUserOrders(req, res);
  });
  
  // Get orders for a specific user (admin or the user themselves)
  app.get("/api/orders/user/:userId", isAuthenticated, orderController.getOrdersByUser);
  
  // Get a specific order by ID
  // This must come after the /api/orders/user routes to avoid route conflicts
  app.get("/api/orders/:id", isAuthenticated, orderController.getOrderById);
  
  // Create a new order
  app.post("/api/orders", orderController.createOrder);
  
  // Update order status (admin only)
  app.put("/api/orders/:id/status", isAdmin, orderController.updateOrderStatus);
  
  // Payment routes
  // For testing purposes, we're temporarily removing authentication check
  app.post("/api/payment/create-order", paymentController.createOrder);
  app.post("/api/payment/verify", paymentController.verifyPayment);
  app.post("/api/payment/process-cod", paymentController.processCodOrder);
  
  // Chatbot route
  app.post("/api/chatbot", chatbotController.processMessage);
  
  // Category routes
  app.get("/api/categories", categoryController.getAllCategories);
  app.get("/api/categories/slug/:slug", categoryController.getCategoryBySlug);
  app.get("/api/categories/:id", categoryController.getCategoryById);
  app.get("/api/categories/:id/subcategories", categoryController.getSubcategories);
  app.get("/api/categories/:id/products", categoryController.getCategoryProducts);
  app.post("/api/categories", isAdmin, categoryController.createCategory);
  app.put("/api/categories/:id", isAdmin, categoryController.updateCategory);
  app.delete("/api/categories/:id", isAdmin, categoryController.deleteCategory);
  
  // Users management routes
  app.get("/api/users", isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  
  app.post("/api/users", isAdmin, async (req, res) => {
    try {
      // Get data from request body
      const { username, password, email, fullName, phone, isAdmin: isUserAdmin } = req.body;
      
      // Log the received data for debugging
      console.log("Creating new user with data:", {
        username,
        email,
        fullName,
        phone,
        isAdmin: isUserAdmin
      });
      
      // Basic validation
      if (!username || !password || !email || !fullName) {
        console.log("Missing required fields");
        return res.status(400).json({ message: "Required fields missing" });
      }
      
      // Check if user already exists
      const existingUserByUsername = await storage.getUserByUsername(username);
      if (existingUserByUsername) {
        console.log("Username already exists");
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingUserByEmail = await storage.getUserByEmail(email);
      if (existingUserByEmail) {
        console.log("Email already exists");
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Create the user with all required fields from the schema
      const userData = {
        username,
        password, // In a real app, we would hash this password
        email,
        fullName,
        phone: phone || '',
        address: '', // Default empty values for required fields
        city: '',
        state: '',
        pincode: '',
        isAdmin: isUserAdmin || false,
        isActive: true, // New users are active by default
        isGoogleUser: false,
        isFacebookUser: false,
        emailVerified: true, // Auto-verify admin-created accounts
        googleId: null,
        facebookId: null,
        profilePicture: null
      };
      
      console.log("Creating user with:", userData);
      const user = await storage.createUser(userData);
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      console.log("User created successfully:", userWithoutPassword);
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user", error: (error as any).message });
    }
  });
  
  app.put("/api/users/:id/status", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { isActive } = req.body;
      
      console.log(`Updating user ${userId} status to isActive=${isActive}`);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Update just the isActive status
      const updatedUser = await storage.updateUser(userId, { isActive });
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      console.log(`User status updated successfully for user ${userId}`);
      res.json({ success: true, user: updatedUser });
    } catch (error) {
      console.error("Error updating user status:", error);
      res.status(500).json({ message: "Failed to update user status", error: (error as any).message });
    }
  });
  
  // Admin data routes
  app.get("/api/admin/dashboard/stats", isAdmin, adminController.getDashboardStats);
  app.get("/api/admin/dashboard/recent-orders", isAdmin, adminController.getRecentOrders);
  app.get("/api/admin/dashboard/top-products", isAdmin, adminController.getTopProducts);
  
  // File upload routes
  app.post("/api/uploads/images", isAdmin, upload.single('image'), uploadController.uploadImage);
  app.post("/api/uploads/multiple-images", isAdmin, upload.array('images', 10), uploadController.uploadMultipleImages);
  
  // Support routes
  app.post("/api/support/callback-request", supportController.submitCallbackRequest);
  app.post("/api/support/email", supportController.submitSupportEmail);
  app.get("/api/support/requests", isAdmin, supportController.getActiveSupportRequests);
  app.put("/api/support/requests/:id/status", isAdmin, supportController.updateSupportRequestStatus);
  
  // Contact routes
  app.post("/api/contact", contactController.submitContactMessage);
  app.get("/api/contact/messages", isAdmin, contactController.getContactMessages);
  app.put("/api/contact/messages/:id/status", isAdmin, contactController.updateMessageStatus);
  
  // Cart routes
  app.get("/api/cart", isAuthenticated, cartController.getCartItems);
  app.post("/api/cart", isAuthenticated, cartController.addToCart);
  app.put("/api/cart/:id", isAuthenticated, cartController.updateCartItemQuantity);
  app.delete("/api/cart/:id", isAuthenticated, cartController.removeFromCart);
  app.delete("/api/cart", isAuthenticated, cartController.clearCart);
  
  // User Address routes
  app.get("/api/user/addresses", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const userId = (req.user as any).id;
      const addresses = await storage.getUserAddresses(userId);
      
      res.json(addresses);
    } catch (error) {
      console.error("Error fetching user addresses:", error);
      res.status(500).json({ message: "Failed to fetch addresses" });
    }
  });
  
  app.get("/api/user/addresses/:id", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const userId = (req.user as any).id;
      const addressId = parseInt(req.params.id);
      
      if (isNaN(addressId)) {
        return res.status(400).json({ message: "Invalid address ID" });
      }
      
      const address = await storage.getUserAddressById(addressId);
      
      if (!address) {
        return res.status(404).json({ message: "Address not found" });
      }
      
      // Security check - ensure user can only access their own addresses
      if (address.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(address);
    } catch (error) {
      console.error("Error fetching user address:", error);
      res.status(500).json({ message: "Failed to fetch address" });
    }
  });
  
  app.post("/api/user/addresses", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const userId = (req.user as any).id;
      
      // Extract address details from request body
      const { 
        fullName, 
        phone, 
        addressLine1, 
        addressLine2, 
        city, 
        state, 
        pincode, 
        country,
        isDefault,
        addressType
      } = req.body;
      
      // Basic validation
      if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
        return res.status(400).json({ message: "Required fields missing" });
      }
      
      // Create the address
      const addressData = {
        userId,
        fullName,
        phone,
        addressLine1,
        addressLine2: addressLine2 || '',
        city,
        state,
        pincode,
        country: country || 'India', // Default to India if not specified
        isDefault: isDefault || false,
        addressType: addressType || 'home'
      };
      
      const address = await storage.createUserAddress(addressData);
      
      res.status(201).json(address);
    } catch (error) {
      console.error("Error creating address:", error);
      res.status(500).json({ message: "Failed to create address" });
    }
  });
  
  app.put("/api/user/addresses/:id", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const userId = (req.user as any).id;
      const addressId = parseInt(req.params.id);
      
      if (isNaN(addressId)) {
        return res.status(400).json({ message: "Invalid address ID" });
      }
      
      // Check if address exists and belongs to user
      const existingAddress = await storage.getUserAddressById(addressId);
      
      if (!existingAddress) {
        return res.status(404).json({ message: "Address not found" });
      }
      
      // Security check - ensure user can only update their own addresses
      if (existingAddress.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Extract address details from request body
      const { 
        fullName, 
        phone, 
        addressLine1, 
        addressLine2, 
        city, 
        state, 
        pincode, 
        country,
        isDefault,
        addressType
      } = req.body;
      
      // Collect fields to update (only include provided fields)
      const addressData: Partial<typeof existingAddress> = {};
      
      if (fullName !== undefined) addressData.fullName = fullName;
      if (phone !== undefined) addressData.phone = phone;
      if (addressLine1 !== undefined) addressData.addressLine1 = addressLine1;
      if (addressLine2 !== undefined) addressData.addressLine2 = addressLine2;
      if (city !== undefined) addressData.city = city;
      if (state !== undefined) addressData.state = state;
      if (pincode !== undefined) addressData.pincode = pincode;
      if (country !== undefined) addressData.country = country;
      if (isDefault !== undefined) addressData.isDefault = isDefault;
      if (addressType !== undefined) addressData.addressType = addressType;
      
      // Update the address
      const updatedAddress = await storage.updateUserAddress(addressId, addressData);
      
      if (!updatedAddress) {
        return res.status(500).json({ message: "Failed to update address" });
      }
      
      res.json(updatedAddress);
    } catch (error) {
      console.error("Error updating address:", error);
      res.status(500).json({ message: "Failed to update address" });
    }
  });
  
  app.delete("/api/user/addresses/:id", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const userId = (req.user as any).id;
      const addressId = parseInt(req.params.id);
      
      if (isNaN(addressId)) {
        return res.status(400).json({ message: "Invalid address ID" });
      }
      
      // Check if address exists and belongs to user
      const existingAddress = await storage.getUserAddressById(addressId);
      
      if (!existingAddress) {
        return res.status(404).json({ message: "Address not found" });
      }
      
      // Security check - ensure user can only delete their own addresses
      if (existingAddress.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Delete the address
      const success = await storage.deleteUserAddress(addressId);
      
      if (!success) {
        return res.status(500).json({ message: "Failed to delete address" });
      }
      
      res.json({ success: true, message: "Address deleted successfully" });
    } catch (error) {
      console.error("Error deleting address:", error);
      res.status(500).json({ message: "Failed to delete address" });
    }
  });
  
  app.post("/api/user/addresses/:id/default", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const userId = (req.user as any).id;
      const addressId = parseInt(req.params.id);
      
      if (isNaN(addressId)) {
        return res.status(400).json({ message: "Invalid address ID" });
      }
      
      // Check if address exists and belongs to user
      const existingAddress = await storage.getUserAddressById(addressId);
      
      if (!existingAddress) {
        return res.status(404).json({ message: "Address not found" });
      }
      
      // Security check - ensure user can only modify their own addresses
      if (existingAddress.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Set as default address
      const success = await storage.setDefaultUserAddress(userId, addressId);
      
      if (!success) {
        return res.status(500).json({ message: "Failed to set default address" });
      }
      
      res.json({ success: true, message: "Default address updated successfully" });
    } catch (error) {
      console.error("Error setting default address:", error);
      res.status(500).json({ message: "Failed to set default address" });
    }
  });
  
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Initialize WebSocket chat server
  new ChatServer(httpServer);
  
  return httpServer;
}
