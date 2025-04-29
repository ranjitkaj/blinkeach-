import React from 'react';
import { Helmet } from 'react-helmet';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

const AboutUsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Helmet>
        <title>About Us - Blinkeach</title>
        <meta name="description" content="Learn more about Blinkeach and our mission to provide the best shopping experience in India." />
      </Helmet>

      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-6">About Blinkeach</h1>
      
      <div className="prose max-w-none">
        <h2>Our Story</h2>
        <p>
          Founded in 2023, Blinkeach was born from a simple idea: to create an online shopping 
          experience that truly understands and serves the diverse needs of Indian consumers. 
          What began as a small venture has grown into one of India's most trusted e-commerce 
          platforms, offering a wide range of products across multiple categories.
        </p>
        
        <h2>Our Mission</h2>
        <p>
          At Blinkeach, our mission is to revolutionize the way India shops online by providing 
          a seamless, secure, and personalized shopping experience that caters to the unique 
          preferences and requirements of our customers.
        </p>
        
        <h2>Our Values</h2>
        <ul>
          <li>
            <strong>Customer First:</strong> Every decision we make is driven by what's best for our customers.
          </li>
          <li>
            <strong>Quality Assurance:</strong> We rigorously verify all products to ensure they meet the highest standards.
          </li>
          <li>
            <strong>Innovation:</strong> We constantly explore new technologies and approaches to enhance the shopping experience.
          </li>
          <li>
            <strong>Inclusivity:</strong> We make our platform accessible to all Indians through multiple regional languages and interfaces.
          </li>
          <li>
            <strong>Social Responsibility:</strong> We are committed to sustainable practices and supporting local communities.
          </li>
        </ul>
        
        <h2>Our Team</h2>
        <p>
          Blinkeach is powered by a diverse team of passionate professionals who bring together 
          their expertise in technology, retail, customer service, and logistics to create an 
          exceptional shopping platform. Our team is united by a shared commitment to innovation 
          and customer satisfaction.
        </p>
        
        <h2>Our Achievements</h2>
        <p>
          Since our inception, we have served millions of customers across India, delivering 
          countless products right to their doorsteps. We have been recognized for our excellence 
          in customer service, our user-friendly platform, and our commitment to empowering 
          sellers across the country.
        </p>
        
        <h2>Join Us on Our Journey</h2>
        <p>
          We invite you to be a part of the Blinkeach family, whether as a customer, seller, or team member. 
          Together, we can continue to transform the e-commerce landscape in India and beyond.
        </p>
      </div>
    </div>
  );
};

export default AboutUsPage;