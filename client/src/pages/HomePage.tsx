import React from 'react';
import HeroSlider from '@/components/home/HeroSlider';
import CategorySection from '@/components/home/CategorySection';
import DealsSection from '@/components/home/DealsSection';
import PromotionalBanners from '@/components/home/PromotionalBanners';
import TopSellingSection from '@/components/home/TopSellingSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import AppDownloadBanner from '@/components/home/AppDownloadBanner';
import { Helmet } from 'react-helmet';

const HomePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Blinkeach - Online Shopping for Everyone</title>
        <meta name="description" content="Shop online for electronics, fashion, home appliances, and more. Great deals, fast delivery, easy returns. India's favorite shopping destination." />
      </Helmet>

      <main>
        {/* Hero Slider */}
        <HeroSlider />

        {/* Feature Categories */}
        <CategorySection />

        {/* Deal of the Day */}
        <DealsSection />

        {/* Promotional Banners */}
        <PromotionalBanners />

        {/* Top Selling Products */}
        <TopSellingSection />

        {/* Features */}
        <FeaturesSection />

        {/* App Download Banner */}
        <AppDownloadBanner />
      </main>
    </>
  );
};

export default HomePage;
