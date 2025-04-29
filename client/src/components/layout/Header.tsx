import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import TransitionLink from './TransitionLink';
import Logo from '@/components/icons/Logo';
import { 
  Search, 
  User, 
  ShoppingCart, 
  Menu,
  Home as HomeIcon, 
  Phone, 
  ShirtIcon, 
  Tv, 
  
  Utensils,
  Gamepad2,
  Heart,
  LogOut,
  Settings,
  Package,
  ShoppingBag,
  LayoutDashboard
} from 'lucide-react';
import MobileMenu from './MobileMenu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { LanguageSelector } from '@/components/language/LanguageSelector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header: React.FC = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [location] = useLocation();
  const { cartItems } = useCart();
  const { user, logoutMutation } = useAuth();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const categories = [
    { name: 'Home', icon: <HomeIcon className="h-5 w-5" /> },
    { name: 'Mobiles', icon: <Phone className="h-5 w-5" /> },
    { name: 'Fashion', icon: <ShirtIcon className="h-5 w-5" /> },
    { name: 'Electronics', icon: <Tv className="h-5 w-5" /> },
    { name: 'Appliances', icon: <Utensils className="h-5 w-5" /> },
    { name: 'Toys', icon: <Gamepad2 className="h-5 w-5" /> },
    { name: 'Beauty', icon: <Heart className="h-5 w-5" /> }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to shop page with search query
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.fullName) return 'U';
    
    const nameParts = user.fullName.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto">
        {/* Top bar */}
        <div className="bg-secondary p-1 flex justify-between text-white text-xs px-4 md:px-6">
          <p className="hidden sm:block">{t('welcome')} - India's favorite shopping destination!</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:underline">{t('sell_on_blinkeach')}</a>
            <TransitionLink href="/help-faq" className="hover:underline hidden sm:block">{t('customer_service')}</TransitionLink>
            <button 
              onClick={() => {
                if (user) {
                  window.location.href = '/orders';
                } else {
                  window.location.href = '/login?redirect=/orders';
                }
              }} 
              className="hover:underline hidden sm:block text-white bg-transparent border-0 p-0 text-xs cursor-pointer"
            >
              {t('track_order')}
            </button>
          </div>
        </div>
        
        {/* Main header */}
        <div className="flex items-center justify-between p-3 px-4 md:px-6">
          {/* Logo */}
          <div className="flex items-center">
            <TransitionLink href="/">
              <div className="flex items-center">
                <Logo size="medium" />
              </div>
            </TransitionLink>
          </div>
          
          {/* Search */}
          <div className="hidden md:flex flex-1 mx-6">
            <form onSubmit={handleSearch} className="relative w-full max-w-xl">
              <Input
                type="text"
                placeholder={t('search')}
                className="w-full border border-neutral-300 rounded-md py-2 px-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit"
                className="absolute right-0 top-0 h-full px-4 bg-secondary text-white rounded-r-md"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
          
          {/* Nav Icons */}
          <div className="flex items-center space-x-6">
            {/* Language Selector */}
            <LanguageSelector />
            
            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profilePicture || ''} alt={user.fullName} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.fullName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <TransitionLink href="/profile">
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </TransitionLink>
                    <TransitionLink href="/orders">
                      <DropdownMenuItem>
                        <Package className="mr-2 h-4 w-4" />
                        <span>Orders</span>
                      </DropdownMenuItem>
                    </TransitionLink>
                    <TransitionLink href="/wishlist">
                      <DropdownMenuItem>
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        <span>Wishlist</span>
                      </DropdownMenuItem>
                    </TransitionLink>
                    {user.isAdmin && (
                      <TransitionLink href="/admin">
                        <DropdownMenuItem>
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </DropdownMenuItem>
                      </TransitionLink>
                    )}

                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} disabled={logoutMutation.isPending}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{logoutMutation.isPending ? 'Logging out...' : 'Log out'}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="relative cursor-pointer group">
                <TransitionLink href="/login">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-neutral-700" />
                    <span className="ml-1 hidden md:inline">Login</span>
                  </div>
                </TransitionLink>
                
                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-1 w-56 bg-white shadow-lg rounded-md hidden group-hover:block z-10">
                  <div className="p-4 border-b">
                    <div className="flex justify-between">
                      <h3 className="font-medium">New Customer?</h3>
                      <span className="text-secondary hover:underline">
                        <TransitionLink href="/register">Sign Up</TransitionLink>
                      </span>
                    </div>
                  </div>
                  <ul className="py-2">
                    <li>
                      <TransitionLink href="/login">
                        <div className="block px-4 py-2 hover:bg-neutral-100">Login</div>
                      </TransitionLink>
                    </li>
                    <li>
                      <TransitionLink href="/register">
                        <div className="block px-4 py-2 hover:bg-neutral-100">Register</div>
                      </TransitionLink>
                    </li>
                    <li>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          if (user) {
                            window.location.href = '/orders';
                          } else {
                            window.location.href = '/login?redirect=/orders';
                          }
                        }}
                        className="block px-4 py-2 hover:bg-neutral-100 w-full text-left"
                      >
                        Track Orders
                      </button>
                    </li>
                    <li>
                      <TransitionLink href="/help-faq">
                        <div className="block px-4 py-2 hover:bg-neutral-100">Help</div>
                      </TransitionLink>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            
            <div className="cursor-pointer relative">
              <TransitionLink href="/cart">
                <div className="flex items-center">
                  <ShoppingCart className="h-5 w-5 text-neutral-700" />
                  <span className="ml-1 hidden md:inline">Cart</span>
                  {totalItems > 0 && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                      {totalItems}
                    </Badge>
                  )}
                </div>
              </TransitionLink>
            </div>
            
            <Button 
              variant="ghost" 
              className="md:hidden" 
              onClick={() => setShowMobileMenu(true)}
              size="icon"
            >
              <Menu className="h-5 w-5 text-neutral-700" />
            </Button>
          </div>
        </div>
        
        {/* Mobile search */}
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearch} className="relative w-full">
            <Input
              type="text"
              placeholder="Search products..."
              className="w-full border border-neutral-300 rounded-md py-2 px-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit"
              className="absolute right-0 top-0 h-full px-4 bg-secondary text-white rounded-r-md"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
        
        {/* Categories Nav */}
        <nav className="bg-white border-t border-neutral-200 overflow-x-auto whitespace-nowrap">
          <div className="flex px-4 py-2 space-x-8 md:justify-center text-sm md:text-base">
            {categories.map((category, index) => (
              <TransitionLink key={index} href={`/shop?category=${category.name.toLowerCase()}`}>
                <div className="flex flex-col items-center text-neutral-700 hover:text-secondary">
                  <div className="text-xl mb-1">{category.icon}</div>
                  <span>{category.name}</span>
                </div>
              </TransitionLink>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
    </header>
  );
};

export default Header;
