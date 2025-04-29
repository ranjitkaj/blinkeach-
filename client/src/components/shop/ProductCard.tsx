import React from 'react';
import { Link } from 'wouter';
import { Heart, ShoppingCart, Star, StarHalf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  discount?: number; // If manually provided, will use this instead of calculating
  badge?: {
    text: string;
    color: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  originalPrice,
  image,
  rating,
  reviewCount,
  discount: providedDiscount,
  badge
}) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  // Calculate discount percentage if original price is provided and no discount was explicitly given
  const calculateDiscount = (): number | undefined => {
    if (!originalPrice || originalPrice <= price) return undefined;
    
    // Calculate discount percentage: (originalPrice - price) / originalPrice * 100
    const discountPercentage = Math.round((originalPrice - price) / originalPrice * 100);
    return discountPercentage > 0 ? discountPercentage : undefined;
  };
  
  // Use provided discount or calculate it
  const discount = providedDiscount || calculateDiscount();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await addToCart(id, 1, name, price, image);
      // Toast notification is now handled inside the addToCart function
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  // Generate stars for rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />);
    }
    
    const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="h-3.5 w-3.5 text-amber-400" />);
    }
    
    return stars;
  };

  return (
    <Link href={`/product/${id}`}>
      <div className="block cursor-pointer">
        <div className="bg-white rounded-md shadow-sm hover:shadow-md transition-shadow p-3 group h-full flex flex-col">
          <div className="relative mb-3">
            {(discount || badge) && (
              <span 
                className={`absolute top-0 left-0 ${badge?.color || 'bg-red-600'} text-white text-xs px-2 py-1 rounded-br-md font-medium`}
              >
                {badge?.text || `-${discount}%`}
              </span>
            )}
            <img 
              src={image} 
              alt={name} 
              className="w-full h-40 object-contain"
              loading="lazy"
            />
            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-white rounded-full p-2 shadow-md hover:bg-neutral-100 h-8 w-8"
              >
                <Heart className="h-4 w-4 text-neutral-700" />
              </Button>
            </div>
          </div>
          
          <h3 className="font-medium text-sm line-clamp-2 mb-1 h-10">{name}</h3>
          <div className="flex items-center mb-1">
            <div className="flex text-amber-400 text-xs">
              {renderStars()}
            </div>
            <span className="text-xs text-neutral-500 ml-1">({reviewCount})</span>
          </div>
          
          <div className="mb-2 mt-auto">
            <div className="flex items-end flex-wrap">
              <span className="font-semibold text-base">₹{(price/100).toLocaleString('en-IN')}</span>
              {originalPrice && originalPrice > price && (
                <>
                  <span className="line-through text-neutral-500 text-sm ml-2">
                    ₹{(originalPrice/100).toLocaleString('en-IN')}
                  </span>
                  {discount && discount > 0 && (
                    <span className="text-red-600 text-xs ml-2 font-medium">
                      {discount}% off
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
          
          <Button 
            onClick={handleAddToCart} 
            className="w-full bg-secondary hover:bg-secondary-dark text-white py-1.5 rounded text-sm font-medium transition-colors"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
