import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

const Navbar = ({ cartCount }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 w-full z-50 transition-all duration-500 
      ${scrolled ? 'bg-[#F8F2EC] py-2 shadow-sm' : 'bg-[#F8F2EC] py-3'}`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">

        {/* FLEX CONTAINER */}
        <div className="flex items-center justify-between w-full">

          {/* LEFT - LOGO */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="https://i.ibb.co/99XT05ZF/New-Logo-Tinny-transparent.png"
                alt="Earth & Harvest Logo"
                className="h-10 sm:h-12 lg:h-16 w-auto object-contain"
              />
            </Link>
          </div>

          {/* CENTER NAV LINKS (hidden on mobile, visible on md+) */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#benefits" className="text-foreground font-medium text-sm hover:text-primary transition">
              Benefits
            </a>
            <a href="#ingredients" className="text-foreground font-medium text-sm hover:text-primary transition">
              Ingredients
            </a>
            <a href="#reviews" className="text-foreground font-medium text-sm hover:text-primary transition">
              Reviews
            </a>
            <a href="#faq" className="text-foreground font-medium text-sm hover:text-primary transition">
              FAQ
            </a>
          </div>

          {/* RIGHT SIDE - CART + BUY BUTTON */}
          <div className="flex items-center space-x-3">

            {/* Cart */}
            <button className="relative p-2 text-foreground hover:text-primary transition">
              <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />

              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-accent text-primary-foreground 
                  text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            {/* CTA */}
            <Link
              to="/product"
              className="bg-[#C8945C] text-black hover:bg-white hover:text-[#C8945C] 
              px-4 sm:px-6 py-2 lg:py-2.5 rounded-lg font-semibold transition-all 
              shadow-premium text-sm"
            >
              Buy Now
            </Link>

          </div>
        </div>

        {/* MOBILE NAV LINKS (visible on mobile, centered under main row)
        <div className="flex flex-wrap justify-center gap-4 mt-3 md:hidden">
          <a href="#benefits" className="text-foreground text-sm font-medium hover:text-primary transition">
            Benefits
          </a>
          <a href="#ingredients" className="text-foreground text-sm font-medium hover:text-primary transition">
            Ingredients
          </a>
          <a href="#reviews" className="text-foreground text-sm font-medium hover:text-primary transition">
            Reviews
          </a>
          <a href="#faq" className="text-foreground text-sm font-medium hover:text-primary transition">
            FAQ
          </a>
        </div> */}

      </div>
    </nav>
  );
};

export default Navbar;
