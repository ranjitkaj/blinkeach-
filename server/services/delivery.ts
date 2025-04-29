import { Order } from '@shared/schema';

// Delivery service configuration
interface DeliveryConfig {
  apiKey: string;
  baseUrl: string;
  webhook: string;
  serviceName: string;
  trackingUrlTemplate: string;
}

// Delivery partner options
type DeliveryPartner = 'delhivery' | 'ekart' | 'bluedart' | 'express' | 'custom';

// Delivery request parameters
interface DeliveryRequest {
  orderId: number;
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  deliveryAddress: string;
  city: string;
  state: string;
  pincode: string;
  weight: number; // in kg
  dimensions?: {
    length: number; // in cm
    width: number; // in cm
    height: number; // in cm
  };
  orderValue: number; // in paise
  isCod: boolean;
  items: Array<{
    name: string;
    quantity: number;
    price: number; // in paise
  }>;
}

// Delivery response from courier partner
interface DeliveryResponse {
  success: boolean;
  trackingId?: string;
  trackingUrl?: string;
  estimatedDelivery?: Date;
  message?: string;
  errors?: string[];
}

// Default delivery configuration
const defaultConfig: Record<DeliveryPartner, DeliveryConfig> = {
  delhivery: {
    apiKey: process.env.DELHIVERY_API_KEY || '',
    baseUrl: 'https://track.delhivery.com/api',
    webhook: '/webhooks/delhivery',
    serviceName: 'Delhivery',
    trackingUrlTemplate: 'https://track.delhivery.com/p/{trackingId}'
  },
  ekart: {
    apiKey: process.env.EKART_API_KEY || '',
    baseUrl: 'https://ekart-api.flipkart.com/api',
    webhook: '/webhooks/ekart',
    serviceName: 'Ekart Logistics',
    trackingUrlTemplate: 'https://ekartlogistics.com/shipmentTracking/{trackingId}'
  },
  bluedart: {
    apiKey: process.env.BLUEDART_API_KEY || '',
    baseUrl: 'https://api.bluedart.com',
    webhook: '/webhooks/bluedart',
    serviceName: 'Blue Dart',
    trackingUrlTemplate: 'https://www.bluedart.com/tracking/{trackingId}'
  },
  express: {
    apiKey: process.env.EXPRESS_API_KEY || '',
    baseUrl: 'https://express.api.com',
    webhook: '/webhooks/express',
    serviceName: 'Express Delivery',
    trackingUrlTemplate: 'https://track.expressdelivery.in/{trackingId}'
  },
  custom: {
    apiKey: process.env.CUSTOM_DELIVERY_API_KEY || '',
    baseUrl: process.env.CUSTOM_DELIVERY_BASE_URL || '',
    webhook: '/webhooks/custom',
    serviceName: process.env.CUSTOM_DELIVERY_NAME || 'Custom Delivery',
    trackingUrlTemplate: process.env.CUSTOM_DELIVERY_TRACKING_URL || 'https://track.delivery.com/{trackingId}'
  }
};

// Main delivery service class
export class DeliveryService {
  private config: DeliveryConfig;
  private partner: DeliveryPartner;
  
  constructor(partner: DeliveryPartner = 'delhivery') {
    this.partner = partner;
    this.config = defaultConfig[partner];
    
    // Check if the API key is set
    if (!this.config.apiKey) {
      console.warn(`${this.config.serviceName} API key is not set. Delivery service will not work.`);
    }
  }
  
  /**
   * Create a delivery shipment for an order
   */
  async createShipment(request: DeliveryRequest): Promise<DeliveryResponse> {
    // In a real implementation, this would make an API call to the delivery partner
    try {
      // Check if API key is available
      if (!this.config.apiKey) {
        return {
          success: false,
          message: `${this.config.serviceName} API key is not configured`
        };
      }
      
      // Mock the API call for now (in production, we would use fetch/axios to call the API)
      console.log(`Creating shipment with ${this.config.serviceName} for order #${request.orderId}`);
      
      // Generate a mock tracking ID
      const trackingId = `${this.partner.toUpperCase()}-${Date.now()}-${request.orderId}`;
      
      // Generate tracking URL
      const trackingUrl = this.config.trackingUrlTemplate.replace('{trackingId}', trackingId);
      
      // Mock a successful response
      return {
        success: true,
        trackingId,
        trackingUrl,
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        message: 'Shipment created successfully'
      };
    } catch (error) {
      console.error(`Error creating shipment with ${this.config.serviceName}:`, error);
      return {
        success: false,
        message: `Failed to create shipment with ${this.config.serviceName}`,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }
  
  /**
   * Get tracking information for a shipment
   */
  async getTrackingInfo(trackingId: string): Promise<any> {
    // In a real implementation, this would make an API call to the delivery partner
    try {
      // Check if API key is available
      if (!this.config.apiKey) {
        return {
          success: false,
          message: `${this.config.serviceName} API key is not configured`
        };
      }
      
      // Mock the API call for now
      console.log(`Getting tracking info from ${this.config.serviceName} for tracking ID ${trackingId}`);
      
      // Mock tracking data
      return {
        success: true,
        trackingId,
        status: 'in_transit',
        currentLocation: 'Mumbai Sorting Center',
        updates: [
          {
            timestamp: new Date(),
            status: 'in_transit',
            location: 'Mumbai Sorting Center',
            description: 'Shipment has been processed at sorting center'
          },
          {
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
            status: 'picked_up',
            location: 'Seller Warehouse',
            description: 'Shipment has been picked up from seller'
          }
        ],
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      };
    } catch (error) {
      console.error(`Error getting tracking info from ${this.config.serviceName}:`, error);
      return {
        success: false,
        message: `Failed to get tracking info from ${this.config.serviceName}`,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }
  
  /**
   * Cancel a shipment
   */
  async cancelShipment(trackingId: string): Promise<any> {
    // In a real implementation, this would make an API call to the delivery partner
    try {
      // Check if API key is available
      if (!this.config.apiKey) {
        return {
          success: false,
          message: `${this.config.serviceName} API key is not configured`
        };
      }
      
      // Mock the API call for now
      console.log(`Cancelling shipment with ${this.config.serviceName} for tracking ID ${trackingId}`);
      
      // Mock a successful response
      return {
        success: true,
        trackingId,
        status: 'cancelled',
        message: 'Shipment has been cancelled successfully'
      };
    } catch (error) {
      console.error(`Error cancelling shipment with ${this.config.serviceName}:`, error);
      return {
        success: false,
        message: `Failed to cancel shipment with ${this.config.serviceName}`,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }
  
  /**
   * Get tracking URL for a shipment
   */
  getTrackingUrl(trackingId: string): string {
    return this.config.trackingUrlTemplate.replace('{trackingId}', trackingId);
  }
  
  /**
   * Convert order to delivery request
   */
  static orderToDeliveryRequest(order: Order, user: any, items: any[]): DeliveryRequest {
    // Parse shipping address (in real app, this might be a structured object or split fields)
    const addressParts = order.shippingAddress.split(', ');
    
    // Extract city, state, and pincode (extremely simplified; in real app would be proper fields)
    const pincode = addressParts[addressParts.length - 1] || '400001';
    const state = addressParts[addressParts.length - 2] || 'Maharashtra';
    const city = addressParts[addressParts.length - 3] || 'Mumbai';
    const streetAddress = addressParts.slice(0, addressParts.length - 3).join(', ') || order.shippingAddress;
    
    // Calculate total weight (mocked for now)
    const weight = items.reduce((total, item) => total + (item.quantity * 0.5), 0.5);
    
    return {
      orderId: order.id,
      recipientName: user.fullName,
      recipientPhone: user.phone,
      recipientEmail: user.email,
      deliveryAddress: streetAddress,
      city,
      state,
      pincode,
      weight,
      orderValue: order.totalAmount,
      isCod: order.paymentMethod === 'cod',
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    };
  }
}

// Export delivery service
export const deliveryService = new DeliveryService(
  (process.env.DELIVERY_PARTNER as DeliveryPartner) || 'delhivery'
);

// Export a utility function to more easily access the static method
export const orderToDeliveryRequest = DeliveryService.orderToDeliveryRequest;

export default deliveryService;