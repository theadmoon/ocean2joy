import { Link } from 'react-router-dom';
import { FaEnvelope, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import Logo from './Logo';

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 flex flex-col items-start justify-start">
            <div className="mb-6">
              <Logo 
                variant="vertical" 
                className="h-36 w-auto" 
                style={{ 
                  imageRendering: '-webkit-optimize-contrast',
                  WebkitFontSmoothing: 'antialiased'
                }} 
              />
            </div>
            <p className="text-gray-400 text-sm">
              Where video dreams come true. Professional video production services delivered digitally.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-sky-400 transition">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-sky-400 transition">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-sky-400 transition">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-sky-400 transition">
                <FaYoutube className="text-xl" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services" className="text-gray-400 hover:text-sky-400 transition">
                  All Services
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-sky-400 transition">
                  Custom Video Production
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-sky-400 transition">
                  Video Editing
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-sky-400 transition">
                  AI-Generated Videos
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/how-it-works" className="text-gray-400 hover:text-sky-400 transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-sky-400 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/policies/terms" className="text-gray-400 hover:text-sky-400 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/policies/privacy" className="text-gray-400 hover:text-sky-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/legal-information" className="text-gray-400 hover:text-sky-400 transition">
                  Legal Information
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Policies</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/policies/digital_delivery" className="text-gray-400 hover:text-sky-400 transition">
                  Digital Delivery
                </Link>
              </li>
              <li>
                <Link to="/policies/refund" className="text-gray-400 hover:text-sky-400 transition">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/policies/revision" className="text-gray-400 hover:text-sky-400 transition">
                  Revision Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 Ocean2joy.com - All rights reserved. Digital video production services delivered electronically.</p>
          <p className="mt-2">
            <FaEnvelope className="inline mr-2" />
            contact@ocean2joy.com
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
