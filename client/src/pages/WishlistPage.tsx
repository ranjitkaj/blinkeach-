import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/lib/cart';

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  discount?: number;
  inStock: boolean;
}

const WishlistPage: React.FC = () => {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/user');
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (isAuthenticated === false) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view your wishlist",
        variant: "destructive",
      });
      setLocation('/login?redirect=/wishlist');
    }
  }, [isAuthenticated, toast, setLocation]);

  // Load wishlist data
  useEffect(() => {
    if (isAuthenticated) {
      // In a real application, fetch from API
      // const fetchWishlist = async () => {
      //   const response = await fetch('/api/user/wishlist');
      //   const data = await response.json();
      //   setWishlistItems(data);
      //   setIsLoading(false);
      // };
      
      // Simulated API call with mock data for demonstration
      setTimeout(() => {
        const mockWishlistItems: WishlistItem[] = [
          {
            id: 1,
            name: "Smartphone X Pro Max",
            price: 89999,
            originalPrice: 99999,
            image: "https://via.placeholder.com/200",
            discount: 10,
            inStock: true
          },
          {
            id: 2,
            name: "Wireless Noise Cancelling Headphones",
            price: 24999,
            originalPrice: 29999,
            image: "https://via.placeholder.com/200",
            discount: 17,
            inStock: true
          },
          {
            id: 3,
            name: "Ultra HD Smart TV 55-inch",
            price: 59999,
            originalPrice: 69999,
            image: "https://via.placeholder.com/200",
            discount: 14,
            inStock: false
          }
        ];
        
        setWishlistItems(mockWishlistItems);
        setIsLoading(false);
      }, 1000);
    }
  }, [isAuthenticated]);

  const handleRemoveFromWishlist = (id: number) => {
    // In a real app, this would call an API endpoint
    // const removeItem = async () => {
    //   await fetch(\`/api/user/wishlist/${id}\`, { method: 'DELETE' });
    // };
    
    setWishlistItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "Item has been removed from your wishlist",
    });
  };

  const handleAddToCart = (item: WishlistItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1
    });
    
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart`,
    });
  };

  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return `₹${(price / 100).toLocaleString('en-IN')}`;
  };

  // Calculate discount percentage if not provided
  const getDiscountPercentage = (item: WishlistItem) => {
    if (item.discount) return item.discount;
    if (item.originalPrice) {
      return Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
    }
    return 0;
  };

  // Don't render content until authentication check is complete
  if (isAuthenticated === null) {
    return <div className="flex justify-center items-center min-h-[50vh]">Loading...</div>;
  }

  // If not authenticated, we'll redirect (handled in the useEffect)
  if (isAuthenticated === false) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet>
        <title>My Wishlist - Blinkeach</title>
        <meta name="description" content="View and manage your Blinkeach wishlist" />
      </Helmet>

      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-8">
        <Heart className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">My Wishlist</h1>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse text-center">
            <p>Loading your wishlist...</p>
          </div>
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <div className="bg-muted inline-flex p-6 rounded-full mb-2">
            <Heart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold">Your wishlist is empty</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Save items you're interested in by clicking the heart icon on product pages
          </p>
          <Button className="mt-4" asChild>
            <Link to="/products">Explore Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative">
                {item.originalPrice && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    {getDiscountPercentage(item)}% OFF
                  </div>
                )}
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="h-48 w-full object-cover"
                />
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-medium line-clamp-2 mb-2">{item.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold">{formatPrice(item.price)}</span>
                  {item.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(item.originalPrice)}
                    </span>
                  )}
                </div>
                {!item.inStock && (
                  <p className="text-red-500 text-sm mt-2">Out of stock</p>
                )}
              </CardContent>
              
              <CardFooter className="p-4 pt-0 gap-2 flex flex-col">
                <Button
                  className="w-full gap-2"
                  onClick={() => handleAddToCart(item)}
                  disabled={!item.inStock}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 bg-background bg-opacity-70 hover:bg-background"
                  onClick={() => handleRemoveFromWishlist(item.id)}
                >
                  <Trash2 className="h-4 w-4 text-primary" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;