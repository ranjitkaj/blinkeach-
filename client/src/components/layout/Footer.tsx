import React from 'react';
import { Link } from 'wouter';
import Logo from '@/components/icons/Logo';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-800 text-white pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Blinkeach</h3>
            <p className="text-neutral-400 text-sm mb-4">
              Blinkeach is your one-stop online shopping destination for a wide range of products 
              at unbeatable prices. Our mission is to provide quality products and exceptional 
              service to customers across India.
            </p>
            <div className="flex space-x-3">
              <a href="https://www.facebook.com/blinkeach" target="_blank" rel="noopener noreferrer" className="bg-neutral-700 hover:bg-neutral-600 w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://www.instagram.com/blinkeach?igsh=OGVoOGdzOXozYzlv" target="_blank" rel="noopener noreferrer" className="bg-neutral-700 hover:bg-neutral-600 w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-neutral-400 text-sm">
              <li><Link href="/about-us"><span className="hover:text-white transition-colors cursor-pointer">About Us</span></Link></li>
              <li><Link href="/contact-us"><span className="hover:text-white transition-colors cursor-pointer">Contact Us</span></Link></li>
              <li><Link href="/terms-and-conditions"><span className="hover:text-white transition-colors cursor-pointer">Terms & Conditions</span></Link></li>
              <li><Link href="/privacy-policy"><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></Link></li>
              <li><Link href="/shipping-policy"><span className="hover:text-white transition-colors cursor-pointer">Shipping Policy</span></Link></li>
              <li><Link href="/return-refund-policy"><span className="hover:text-white transition-colors cursor-pointer">Return & Refund Policy</span></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-neutral-400 text-sm">
              <li><Link href="/profile"><span className="hover:text-white transition-colors cursor-pointer">My Account</span></Link></li>
              <li><Link href="/track-order"><span className="hover:text-white transition-colors cursor-pointer">Track Order</span></Link></li>
              <li><Link href="/wishlist"><span className="hover:text-white transition-colors cursor-pointer">Wishlist</span></Link></li>
              <li><Link href="/cart"><span className="hover:text-white transition-colors cursor-pointer">Shopping Cart</span></Link></li>
              <li><Link href="/help-faq"><span className="hover:text-white transition-colors cursor-pointer">Help & FAQ</span></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-neutral-400 text-sm">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-white mt-0.5 mr-3 flex-shrink-0" />
                <span>KB Lane, Panchayati Akhara, Gaya, Bihar - 823001</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-white mr-3 flex-shrink-0" />
                <span>+91 8709144545</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-white mr-3 flex-shrink-0" />
                <span>support@blinkeach.com</span>
              </li>
            </ul>
            
            <h3 className="text-lg font-semibold mt-6 mb-3">Payment Methods</h3>
            <div className="flex flex-wrap gap-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/512px-Paytm_Logo_%28standalone%29.svg.png" alt="Paytm" className="h-6 bg-white rounded p-0.5" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 bg-white rounded p-0.5" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6 bg-white rounded p-0.5" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png" alt="American Express" className="h-6 bg-white rounded p-0.5" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/124px-PayPal.svg.png" alt="PayPal" className="h-6 bg-white rounded p-0.5" />
              <img src="https://razorpay.com/favicon.png" alt="Razorpay" className="h-6 bg-white rounded p-0.5" />
            </div>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 text-sm mb-4 md:mb-0">© {currentYear} Blinkeach. All Rights Reserved.</p>
          <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
            <Link href="/terms-and-conditions"><span className="hover:text-white transition-colors cursor-pointer">Terms</span></Link>
            <Link href="/privacy-policy"><span className="hover:text-white transition-colors cursor-pointer">Privacy</span></Link>
            <Link href="/help-faq"><span className="hover:text-white transition-colors cursor-pointer">Help</span></Link>
            <Link href="/contact-us"><span className="hover:text-white transition-colors cursor-pointer">Contact</span></Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
