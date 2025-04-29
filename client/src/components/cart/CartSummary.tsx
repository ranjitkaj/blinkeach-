import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart';
import { Calculator, CreditCard, TruckIcon } from 'lucide-react';

interface CartSummaryProps {
  showCheckoutButton?: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({ showCheckoutButton = true }) => {
  const { cartItems, totalPrice } = useCart();
  
  // Calculate subtotal, shipping and total
  const subtotal = totalPrice / 100;
  const shipping = subtotal > 0 && subtotal < 499 ? 99 : 0;
  const total = subtotal + shipping;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
      <h2 className="text-lg font-semibold mb-4 border-b pb-2">Order Summary</h2>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
          <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">Shipping Fee</span>
          {shipping > 0 ? (
            <span className="font-medium">₹{shipping.toLocaleString('en-IN')}</span>
          ) : (
            <span className="text-green-600 font-medium">Free</span>
          )}
        </div>
        
        {shipping > 0 && (
          <div className="text-xs text-neutral-500 pt-1">
            <TruckIcon className="h-3.5 w-3.5 inline mr-1" />
            <span>Free shipping on orders above ₹499</span>
          </div>
        )}
      </div>
      
      <div className="border-t border-dashed pt-3 mb-4">
        <div className="flex justify-between font-semibold">
          <span>Total Amount</span>
          <span className="text-lg">₹{total.toLocaleString('en-IN')}</span>
        </div>
        
        {subtotal > 0 && subtotal < 499 && (
          <div className="text-xs text-neutral-500 mt-1">
            <Calculator className="h-3.5 w-3.5 inline mr-1" />
            <span>Add ₹{(499 - subtotal).toLocaleString('en-IN')} more to get free shipping</span>
          </div>
        )}
      </div>
      
      {showCheckoutButton && (
        <Link href="/checkout">
          <Button className="w-full bg-secondary hover:bg-secondary-dark text-white">
            <CreditCard className="h-4 w-4 mr-2" />
            Proceed to Checkout
          </Button>
        </Link>
      )}
      
      {/* Payment methods */}
      <div className="mt-4 text-center text-xs text-neutral-500">
        <p className="mb-2">We accept:</p>
        <div className="flex justify-center space-x-2">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 bg-white rounded p-0.5" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6 bg-white rounded p-0.5" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/512px-Paytm_Logo_%28standalone%29.svg.png" alt="Paytm" className="h-6 bg-white rounded p-0.5" />
          <img src="https://razorpay.com/favicon.png" alt="Razorpay" className="h-6 bg-white rounded p-0.5" />
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
