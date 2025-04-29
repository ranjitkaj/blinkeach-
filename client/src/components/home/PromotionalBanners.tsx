import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

interface BannerProps {
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  colorClass: string;
  textClass: string;
}

const banners: BannerProps[] = [
  {
    title: 'Festival Ready Sale',
    description: 'Get up to 60% off on ethnic wear and accessories',
    image: 'https://images.unsplash.com/photo-1583391733981-8698e5f9deb8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    buttonText: 'Shop Now',
    buttonLink: '/shop?category=fashion&filter=festival',
    colorClass: 'from-secondary to-secondary-light',
    textClass: 'text-secondary'
  },
  {
    title: 'Gadget Galore',
    description: 'Top branded electronics at unbeatable prices',
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    buttonText: 'Explore',
    buttonLink: '/shop?category=electronics',
    colorClass: 'from-accent to-accent-light',
    textClass: 'text-accent'
  }
];

const PromotionalBanners: React.FC = () => {
  return (
    <section className="py-6 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map((banner, index) => (
          <div 
            key={index} 
            className={`bg-gradient-to-r ${banner.colorClass} rounded-lg overflow-hidden shadow-sm`}
          >
            <div className="flex flex-col md:flex-row items-center p-4 md:p-6">
              <div className="md:w-1/2 text-white mb-4 md:mb-0">
                <h3 className="font-bold text-xl md:text-2xl mb-2">{banner.title}</h3>
                <p className="text-white/90 mb-3">{banner.description}</p>
                <Link href={banner.buttonLink}>
                  <Button 
                    className={`bg-white ${banner.textClass} font-medium py-1.5 px-4 rounded hover:bg-neutral-100 transition-colors`}
                  >
                    {banner.buttonText}
                  </Button>
                </Link>
              </div>
              <div className="md:w-1/2">
                <img 
                  src={banner.image} 
                  alt={banner.title} 
                  className="w-full h-36 object-cover rounded"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PromotionalBanners;
