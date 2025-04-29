import React from 'react';
import { Link } from 'wouter';
import { 
  Smartphone, 
  Laptop, 
  ShirtIcon, 
  Home as HomeIcon, 
  Tv, 
  Heart, 
  BookOpen, 
  Watch, 
  Baby
} from 'lucide-react';

interface Category {
  id: number;
  name: string;
  icon: React.ReactNode;
  link: string;
}

const categories: Category[] = [
  {
    id: 1,
    name: 'Home',
    icon: <HomeIcon className="text-2xl text-secondary" />,
    link: '/shop?category=home'
  },
  {
    id: 2,
    name: 'Smartphones',
    icon: <Smartphone className="text-2xl text-secondary" />,
    link: '/shop?category=smartphones'
  },
  {
    id: 3,
    name: 'Laptops',
    icon: <Laptop className="text-2xl text-secondary" />,
    link: '/shop?category=laptops'
  },
  {
    id: 4,
    name: 'Fashion',
    icon: <ShirtIcon className="text-2xl text-secondary" />,
    link: '/shop?category=fashion'
  },
  {
    id: 5,
    name: 'Electronics',
    icon: <Tv className="text-2xl text-secondary" />,
    link: '/shop?category=electronics'
  },
  {
    id: 6,
    name: 'Beauty',
    icon: <Heart className="text-2xl text-secondary" />,
    link: '/shop?category=beauty'
  },
  {
    id: 7,
    name: 'Books',
    icon: <BookOpen className="text-2xl text-secondary" />,
    link: '/shop?category=books'
  },
  {
    id: 8,
    name: 'Watches',
    icon: <Watch className="text-2xl text-secondary" />,
    link: '/shop?category=watches'
  },
  {
    id: 9,
    name: 'Kids',
    icon: <Baby className="text-2xl text-secondary" />,
    link: '/shop?category=kids'
  }
];

const CategorySection: React.FC = () => {
  return (
    <section className="py-6 px-4 max-w-7xl mx-auto">
      <h2 className="text-lg md:text-xl font-semibold mb-4">Shop by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.slice(0, 6).map((category) => (
          <Link key={category.id} href={category.link}>
            <div className="flex flex-col items-center text-center p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-2">
                {category.icon}
              </div>
              <span className="text-sm md:text-base text-neutral-800 font-medium">{category.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
