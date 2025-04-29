import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/lib/cart';
import { createRazorpayOrder, initiateRazorpayPayment, verifyPayment } from '@/lib/razorpay';
import { useLocation } from 'wouter';

interface RazorpayPaymentProps {
  orderDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    specialInstructions?: string;
  };
}

const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({ orderDetails }) => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Calculate shipping and total amount
  const subtotal = totalPrice;
  const shipping = subtotal > 0 && subtotal < 499 ? 99 : 0;
  const total = subtotal + shipping;

  useEffect(() => {
    const initializePayment = async () => {
      try {
        // Prepare address string
        const fullAddress = `${orderDetails.address}, ${orderDetails.city}, ${orderDetails.state} - ${orderDetails.pincode}`;

        // Create order in backend with the correct schema
        const orderData = await createRazorpayOrder({
          id: Date.now(), // temporary ID until backend creates real one
          amount: total,
          currency: 'INR',
          orderId: '', // will be filled by backend
          userEmail: orderDetails.email,
          userPhone: orderDetails.phone,
          userName: orderDetails.name,
          address: fullAddress,
          userId: 2, // Using the logged-in user ID
          totalAmount: total,
          shippingAddress: fullAddress,
          paymentMethod: 'razorpay',
          specialInstructions: orderDetails.specialInstructions || '',
          items: cartItems.map(item => ({
            id: item.id,
            productId: item.productId,
            name: item.product.name,
            price: item.product.discountedPrice || item.product.price,
            quantity: item.quantity
          }))
        });

        // Initialize Razorpay
        initiateRazorpayPayment({
          key: 'rzp_test_N5Qz5HPVvDolwl', // Test key - replace with production key from env vars
          amount: total * 100, // Amount in paisa
          currency: 'INR',
          name: 'Blinkeach',
          description: `Order payment for ${cartItems.length} items`,
          order_id: orderData.id,
          prefill: {
            name: orderDetails.name,
            email: orderDetails.email,
            contact: orderDetails.phone
          },
          notes: {
            address: fullAddress
          },
          theme: {
            color: '#1F51A9'
          },
          handler: async function(response: any) {
            try {
              // Verify payment with backend
              const verification = await verifyPayment({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                orderId: parseInt(orderData.id, 10)
              });

              if (verification.success) {
                toast({
                  title: "Payment Successful",
                  description: "Your order has been placed successfully!",
                  duration: 5000
                });
                
                // Clear cart and redirect to order confirmation
                clearCart();
                setLocation('/order-confirmation?orderId=' + response.razorpay_order_id + '&paymentMethod=razorpay');
              } else {
                toast({
                  title: "Payment Verification Failed",
                  description: verification.message || "There was an issue verifying your payment.",
                  variant: "destructive"
                });
              }
            } catch (error) {
              console.error('Payment verification error:', error);
              toast({
                title: "Payment Error",
                description: "There was an error processing your payment. Please try again.",
                variant: "destructive"
              });
            }
          }
        });
      } catch (error) {
        console.error('Razorpay initialization error:', error);
        toast({
          title: "Payment Error",
          description: "Failed to initialize payment. Please try again.",
          variant: "destructive"
        });
      }
    };

    initializePayment();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm">
      <div className="animate-pulse flex flex-col items-center mb-4">
        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold">Initializing Payment...</h2>
        <p className="text-sm text-neutral-500 mt-2 text-center">
          Please wait while we redirect you to the payment gateway.
          Do not refresh or close this page.
        </p>
      </div>
      
      <div className="w-full max-w-md p-4 border border-neutral-200 rounded-md bg-neutral-50">
        <p className="text-xs text-neutral-600 mb-2">Payment Summary:</p>
        <div className="flex justify-between text-sm mb-1">
          <span>Subtotal:</span>
          <span>₹{subtotal.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex justify-between text-sm mb-1">
          <span>Shipping:</span>
          <span>{shipping > 0 ? `₹${shipping.toLocaleString('en-IN')}` : 'Free'}</span>
        </div>
        <div className="flex justify-between font-semibold text-sm border-t pt-1 mt-1">
          <span>Total:</span>
          <span>₹{total.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
};

export default RazorpayPayment;
