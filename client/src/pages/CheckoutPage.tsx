import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/hooks/use-auth';
import CartSummary from '@/components/cart/CartSummary';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import RazorpayPayment from '@/components/checkout/RazorpayPayment';
import { AlertCircle, ChevronLeft, Lock, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const CheckoutPage: React.FC = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [location, navigate] = useLocation();
  const [showPayment, setShowPayment] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [mockLoginEnabled, setMockLoginEnabled] = useState(false);
  const { toast } = useToast();

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleCheckoutSubmit = (values: any) => {
    setFormData(values);
    
    if (values.paymentMethod === 'cod') {
      // For COD, process order directly without payment gateway
      handleCashOnDeliveryOrder(values);
    } else {
      // For Razorpay, show payment component
      setShowPayment(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Handle COD order creation
  const handleCashOnDeliveryOrder = async (values: any) => {
    try {
      // Prepare address string that includes all address details
      const fullAddress = `${values.name}, ${values.phone}, ${values.address}, ${values.city}, ${values.state} - ${values.pincode}`;
      
      // Create the order with COD payment method using our dedicated endpoint
      const response = await fetch('/api/payment/process-cod', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 2, // Using the logged-in user ID
          totalAmount: totalPrice,
          shippingAddress: fullAddress,
          specialInstructions: values.specialInstructions || '',
          items: cartItems.map(item => ({
            productId: item.productId,
            name: item.product.name,
            price: item.product.discountedPrice || item.product.price,
            quantity: item.quantity
          }))
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to create order');
      }
      
      const order = await response.json();
      
      // Show success message
      toast({
        title: "Order Placed Successfully",
        description: "Your Cash on Delivery order has been confirmed!",
        duration: 5000
      });
      
      // Clear cart and navigate to success page
      clearCart();
      navigate('/order-confirmation?orderId=' + order.orderId + '&paymentMethod=cod');
      
    } catch (error) {
      console.error('Error creating COD order:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      
      // Show error message to user with toast
      toast({
        title: "Order Creation Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000
      });
    }
  };

  if (cartItems.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <Helmet>
        <title>Checkout - Blinkeach</title>
        <meta name="description" content="Complete your purchase securely with our easy checkout process." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <Link href="/cart">
            <a className="text-secondary hover:underline flex items-center text-sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Cart
            </a>
          </Link>
          <h1 className="text-2xl font-bold text-neutral-800 mt-2">Checkout</h1>
        </div>

        {/* Authentication Warning */}
        {!isAuthenticated && !mockLoginEnabled && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>
              You need to be logged in to complete checkout. For testing purposes, you can 
              <Button 
                variant="link" 
                className="p-0 h-auto font-semibold text-primary" 
                onClick={() => {
                  // Create fake auth token
                  localStorage.setItem('auth_token', 'test_token_for_demo');
                  setMockLoginEnabled(true);
                  toast({
                    title: "Test Mode Enabled",
                    description: "You are now in test mode for checkout. This is not a real login.",
                    duration: 3000
                  });
                }}
              >
                &nbsp;enable test mode
              </Button>.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Security Banner */}
        <div className="bg-green-50 border border-green-100 rounded-lg p-3 mb-6 flex items-center">
          <Lock className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
          <p className="text-green-800 text-sm">
            <span className="font-medium">Secure Checkout:</span> Your payment information is encrypted and secure.
            {mockLoginEnabled && <span className="ml-1 bg-amber-200 text-amber-800 px-1 py-0.5 text-xs rounded">TEST MODE</span>}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Checkout Form or Payment */}
          <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
            {showPayment ? (
              <RazorpayPayment orderDetails={formData} />
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-4">Shipping & Payment Details</h2>
                <CheckoutForm onSubmit={handleCheckoutSubmit} isSubmitting={false} />
              </>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:w-80">
            <CartSummary showCheckoutButton={false} />
            
            {/* Order Benefits */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-4 space-y-4">
              <h3 className="font-medium mb-2">Order Benefits</h3>
              
              <div className="flex items-start">
                <ShieldCheck className="h-5 w-5 text-secondary mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">100% Secure Payments</p>
                  <p className="text-xs text-neutral-500">All major credit & debit cards accepted</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Truck className="h-5 w-5 text-secondary mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Fast Delivery</p>
                  <p className="text-xs text-neutral-500">3-7 business days nationwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items Summary */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="divide-y">
            {cartItems.map((item) => (
              <div key={item.id} className="py-4 flex items-center">
                <div className="w-16 h-16 bg-white p-2 rounded border border-neutral-200 mr-4 flex-shrink-0">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-neutral-800 line-clamp-2">
                    {item.product.name}
                  </h3>
                  <p className="text-xs text-neutral-500">Quantity: {item.quantity}</p>
                </div>
                <div className="font-medium text-sm">
                  ₹{((item.product.discountedPrice || item.product.price) * item.quantity / 100).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex justify-between">
            <span className="font-medium">Total Amount:</span>
            <span className="font-bold">₹{(totalPrice / 100).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
