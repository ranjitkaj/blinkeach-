import React from 'react';
import { Link } from 'wouter';
import ProductCard from '@/components/shop/ProductCard';
import { useQuery } from '@tanstack/react-query';

const DealsSection: React.FC = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['/api/products/deals'],
    suspense: false
  });

  // Fallback data for development
  const fallbackProducts = [
    {
      id: 1,
      name: 'OnePlus Nord CE 3 Lite 5G (8GB RAM, 128GB Storage)',
      price: 16999,
      originalPrice: 24999,
      image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      rating: 4.5,
      reviewCount: 2345,
      discount: 45
    },
    {
      id: 2,
      name: 'Fire-Boltt Ninja Smart Watch with Bluetooth Calling',
      price: 1999,
      originalPrice: 3499,
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      rating: 4.0,
      reviewCount: 1234,
      discount: 35
    },
    {
      id: 3,
      name: 'boAt Rockerz 450 Bluetooth On-Ear Headphones',
      price: 1499,
      originalPrice: 2999,
      image: 'https://images.unsplash.com/photo-1600086827875-a63b01f5aff7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      rating: 4.5,
      reviewCount: 3421,
      discount: 50
    },
    {
      id: 4,
      name: 'Campus Men\'s Running Shoes - Lightweight & Comfortable',
      price: 899,
      originalPrice: 1499,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      rating: 3.5,
      reviewCount: 987,
      discount: 40
    },
    {
      id: 5,
      name: 'JBL Flip 5 Waterproof Portable Bluetooth Speaker',
      price: 8499,
      originalPrice: 11999,
      image: 'https://images.unsplash.com/photo-1596460107916-430662021049?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      rating: 5.0,
      reviewCount: 2876,
      discount: 30
    }
  ];

  // Use fallback data if still loading or error
  const displayProducts = (products && products.length > 0) ? products : fallbackProducts;

  return (
    <section className="py-6 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl font-semibold">Deal of the Day</h2>
        <Link href="/shop?filter=deals">
          <span className="text-secondary hover:underline text-sm cursor-pointer">View All</span>
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {displayProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            originalPrice={product.originalPrice}
            image={product.image}
            rating={product.rating}
            reviewCount={product.reviewCount}
            discount={product.discount}
          />
        ))}
      </div>
    </section>
  );
};

export default DealsSection;
