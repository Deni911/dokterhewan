import { FaPhone, FaEnvelope, FaLocationDot, FaClock } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleNavigation = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">HealthyPet</h3>
            <p className="text-sm text-gray-400 mb-4">
              Platform kesehatan hewan peliharaan terpercaya dengan layanan
              berkualitas tinggi.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400 transition">
                Facebook
              </a>
              <a href="#" className="hover:text-blue-400 transition">
                Instagram
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  onClick={handleNavigation}
                  className="hover:text-blue-400 transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={handleNavigation}
                  className="hover:text-blue-400 transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  onClick={handleNavigation}
                  className="hover:text-blue-400 transition"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={handleNavigation}
                  className="hover:text-blue-400 transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/services"
                  onClick={handleNavigation}
                  className="hover:text-blue-400 transition"
                >
                  Pemeriksaan Hewan
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  onClick={handleNavigation}
                  className="hover:text-blue-400 transition"
                >
                  Vaksinasi
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  onClick={handleNavigation}
                  className="hover:text-blue-400 transition"
                >
                  Grooming
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  onClick={handleNavigation}
                  className="hover:text-blue-400 transition"
                >
                  Operasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <FaPhone className="text-blue-400" />
                +62 888-8397-757
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-blue-400" />
                info@healthypet.com
              </li>
              <li className="flex items-center gap-2">
                <FaLocationDot className="text-blue-400" />
                Tangerang, Indonesia
              </li>
              <li className="flex items-center gap-2">
                <FaClock className="text-blue-400" />
                08:00 - 20:00 WIB
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} HealthyPet. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
              <a href="#" className="hover:text-blue-400 transition">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-blue-400 transition">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
