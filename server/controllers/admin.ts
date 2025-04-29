import { Request, Response } from 'express';
import { storage } from '../storage';
import { sendEmail } from '../services/email';

// Admin notification email
const ADMIN_EMAIL = 'blinkeach@gmail.com';
const COMPANY_NAME = 'Blinkeach';

const adminController = {
  // Dashboard stats for admin panel
  getDashboardStats: async (req: Request, res: Response) => {
    try {
      const orders = await storage.getOrders();
      const users = await storage.getAllUsers();
      const products = await storage.getProducts();
      
      // Calculate revenue from orders
      const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      
      // Calculate last month's revenue for growth calculation
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      
      const lastMonthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= lastMonth && orderDate < now;
      });
      
      const twoMonthsAgoOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= twoMonthsAgo && orderDate < lastMonth;
      });
      
      const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      const twoMonthsAgoRevenue = twoMonthsAgoOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      
      // Calculate revenue growth percentage
      const revenueGrowth = twoMonthsAgoRevenue > 0 
        ? Math.round(((lastMonthRevenue - twoMonthsAgoRevenue) / twoMonthsAgoRevenue) * 100) 
        : 0;
      
      // Calculate orders growth percentage
      const lastMonthOrderCount = lastMonthOrders.length;
      const twoMonthsAgoOrderCount = twoMonthsAgoOrders.length;
      const ordersGrowth = twoMonthsAgoOrderCount > 0 
        ? Math.round(((lastMonthOrderCount - twoMonthsAgoOrderCount) / twoMonthsAgoOrderCount) * 100) 
        : 0;
      
      // Calculate customer (user) growth
      const lastMonthUsers = users.filter(user => {
        const userCreatedDate = new Date(user.createdAt);
        return userCreatedDate >= lastMonth && userCreatedDate < now;
      });
      
      const twoMonthsAgoUsers = users.filter(user => {
        const userCreatedDate = new Date(user.createdAt);
        return userCreatedDate >= twoMonthsAgo && userCreatedDate < lastMonth;
      });
      
      const customersGrowth = twoMonthsAgoUsers.length > 0 
        ? Math.round(((lastMonthUsers.length - twoMonthsAgoUsers.length) / twoMonthsAgoUsers.length) * 100) 
        : 0;
      
      // Count low stock products (products with stock < 10)
      const lowStockProducts = products.filter(product => product.stock < 10).length;
      
      res.json({
        revenue: {
          total: totalRevenue,
          growth: revenueGrowth
        },
        orders: {
          total: orders.length,
          growth: ordersGrowth
        },
        customers: {
          total: users.length,
          growth: customersGrowth
        },
        products: {
          total: products.length,
          lowStock: lowStockProducts
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
    }
  },

  // Recent orders for admin dashboard
  getRecentOrders: async (req: Request, res: Response) => {
    try {
      const allOrders = await storage.getOrders();
      
      // Sort by creation date (newest first) and take the first 5
      const recentOrders = allOrders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map(async (order) => {
          // Get user details for each order
          const user = await storage.getUser(order.userId);
          
          return {
            id: order.id,
            customerName: user ? user.fullName : 'Unknown Customer',
            date: order.createdAt,
            amount: order.totalAmount,
            status: order.status
          };
        });
      
      const orders = await Promise.all(recentOrders);
      res.json(orders);
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      res.status(500).json({ error: 'Failed to fetch recent orders' });
    }
  },

  // Top selling products for admin dashboard
  getTopProducts: async (req: Request, res: Response) => {
    try {
      const topProducts = await storage.getTopSellingProducts(5);
      
      const formattedProducts = topProducts.map(product => ({
        id: product.id,
        name: product.name,
        sku: `PROD-${product.id}`,
        category: product.category || 'Uncategorized',
        price: product.price,
        sales: 0 // Default value since this field might not exist in the schema
      }));
      
      res.json(formattedProducts);
    } catch (error) {
      console.error('Error fetching top products:', error);
      res.status(500).json({ error: 'Failed to fetch top products' });
    }
  },

  // Send notification email to admin about new order
  sendOrderNotification: async (order: any, user: any) => {
    try {
      const orderItems = await storage.getOrderItems(order.id);
      
      // Format order date
      const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      // Get product info for items
      const items = await Promise.all(orderItems.map(async (item) => {
        const product = await storage.getProductById(item.productId);
        return {
          ...item,
          productName: product?.name || 'Unknown Product'
        };
      }));
      
      // Format address
      const address = order.shippingAddress || 'No address provided';
      
      // Create item list HTML
      const itemsHtml = items.map(item => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e1e1e1;">${item.productName}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e1e1e1;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e1e1e1; text-align: right;">₹${(item.price/100).toLocaleString('en-IN')}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e1e1e1; text-align: right;">₹${((item.price * item.quantity)/100).toLocaleString('en-IN')}</td>
        </tr>
      `).join('');
      
      // Format shipping cost
      const shippingCost = order.shippingCost || 0;
      
      // Create email content
      const subject = `New Order #${order.id} - ${COMPANY_NAME} Admin Alert`;
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1F51A9; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Order Received!</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e1e1e1; border-top: none;">
            <p>A new order has been placed on your store.</p>
            
            <h2 style="margin-top: 30px;">Order Details</h2>
            <p><strong>Order Number:</strong> #${order.id}</p>
            <p><strong>Order Date:</strong> ${orderDate}</p>
            <p><strong>Order Status:</strong> ${order.status}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            
            <h2 style="margin-top: 30px;">Customer Information</h2>
            <p><strong>Name:</strong> ${user.fullName}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phone || 'Not provided'}</p>
            
            <h2 style="margin-top: 30px;">Shipping Address</h2>
            <p>${address}</p>
            
            <h2 style="margin-top: 30px;">Order Items</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f5f5f5;">
                  <th style="padding: 8px; text-align: left; border-bottom: 2px solid #e1e1e1;">Product</th>
                  <th style="padding: 8px; text-align: left; border-bottom: 2px solid #e1e1e1;">Quantity</th>
                  <th style="padding: 8px; text-align: right; border-bottom: 2px solid #e1e1e1;">Price</th>
                  <th style="padding: 8px; text-align: right; border-bottom: 2px solid #e1e1e1;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 8px; text-align: right; font-weight: bold;">Subtotal:</td>
                  <td style="padding: 8px; text-align: right;">₹${((order.totalAmount - shippingCost)/100).toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 8px; text-align: right; font-weight: bold;">Shipping:</td>
                  <td style="padding: 8px; text-align: right;">₹${(shippingCost/100).toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 8px; text-align: right; font-weight: bold; border-top: 2px solid #e1e1e1;">Total:</td>
                  <td style="padding: 8px; text-align: right; font-weight: bold; border-top: 2px solid #e1e1e1;">₹${(order.totalAmount/100).toLocaleString('en-IN')}</td>
                </tr>
              </tfoot>
            </table>
            
            <div style="margin-top: 30px; background-color: #f9f9f9; padding: 15px; border-radius: 4px;">
              <p><strong>Special Instructions:</strong> ${order.specialInstructions || 'None'}</p>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
              <a href="https://blinkeach.com/admin/orders" style="display: inline-block; background-color: #1F51A9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">View Order in Admin Panel</a>
            </div>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e1e1e1; font-size: 12px; color: #777; text-align: center;">
              <p>This is an automated notification from your ${COMPANY_NAME} admin system.</p>
              <p>© ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.</p>
            </div>
          </div>
        </div>
      `;
      
      // Plain text version
      const text = `
        New Order Received!
        
        A new order has been placed on your store.
        
        Order Details
        Order Number: #${order.id}
        Order Date: ${orderDate}
        Order Status: ${order.status}
        Payment Method: ${order.paymentMethod}
        
        Customer Information
        Name: ${user.fullName}
        Email: ${user.email}
        Phone: ${user.phone || 'Not provided'}
        
        Shipping Address
        ${address}
        
        Order Items
        ${items.map(item => `- ${item.productName} x${item.quantity} - ₹${((item.price * item.quantity)/100).toLocaleString('en-IN')}`).join('\n')}
        
        Subtotal: ₹${((order.totalAmount - shippingCost)/100).toLocaleString('en-IN')}
        Shipping: ₹${(shippingCost/100).toLocaleString('en-IN')}
        Total: ₹${(order.totalAmount/100).toLocaleString('en-IN')}
        
        Special Instructions: ${order.specialInstructions || 'None'}
        
        View this order in your admin panel: https://blinkeach.com/admin/orders
        
        This is an automated notification from your ${COMPANY_NAME} admin system.
        © ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.
      `;
      
      // Send email
      const emailSent = await sendEmail({
        to: ADMIN_EMAIL,
        subject,
        text,
        html
      });
      
      return emailSent;
    } catch (error) {
      console.error('Error sending admin notification email:', error);
      return false;
    }
  }
};

export default adminController;