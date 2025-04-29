import React, { useState } from 'react';
import { X, Plus, Minus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart, CartItem as CartItemType } from '@/lib/cart';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart, isLoading } = useCart();
  const [localLoading, setLocalLoading] = useState(false);
  
  const handleQuantityChange = async (newQuantity: number) => {
    setLocalLoading(true);
    try {
      await updateQuantity(item.id, newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setLocalLoading(false);
    }
  };
  
  const handleRemove = async () => {
    setLocalLoading(true);
    try {
      await removeFromCart(item.id);
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setLocalLoading(false);
    }
  };
  
  // Calculate item price
  const price = item.product?.discountedPrice || item.product?.price || 0;
  const totalPrice = price * item.quantity;
  
  const isItemLoading = isLoading || localLoading;

  return (
    <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b border-neutral-200 relative ${isItemLoading ? 'opacity-60' : ''}`}>
      {isItemLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
      <div className="flex items-center mb-4 sm:mb-0">
        <div className="w-20 h-20 bg-white p-2 rounded border border-neutral-200 mr-4 flex-shrink-0">
          <img 
            src={item.product?.image || ''} 
            alt={item.product?.name || ''} 
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>
        <div>
          <h3 className="text-base font-medium text-neutral-800 mb-1 line-clamp-2">
            {item.product?.name || ''}
          </h3>
          <div className="flex items-center text-sm">
            <span className="font-semibold text-neutral-800">₹{(price/100).toLocaleString('en-IN')}</span>
            {item.product?.originalPrice && item.product.originalPrice > price && (
              <span className="line-through text-neutral-500 ml-2">
                ₹{(item.product.originalPrice/100).toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center border border-neutral-300 rounded-md">
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-r-none"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1 || isItemLoading}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center">{item.quantity}</span>
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-l-none"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={isItemLoading || Boolean(item.product?.stock && item.quantity >= item.product.stock)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="min-w-[100px] text-right">
          <span className="font-semibold text-neutral-800">
            ₹{(totalPrice/100).toLocaleString('en-IN')}
          </span>
        </div>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          className="text-neutral-500 hover:text-accent"
          onClick={handleRemove}
          disabled={isItemLoading}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
