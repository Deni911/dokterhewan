import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import "./Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        mobileMenuRef.current &&
        menuButtonRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <nav className="fixed w-full bg-white/30 backdrop-blur-md shadow-sm z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <img
              src="/images/veterinary.png"
              alt="DokterHewan Logo"
              className="h-14 w-14 object-cover rounded-md"
              onError={(e) => {
                e.currentTarget.src =
                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23e0f2fe" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" font-size="28" fill="%230369a1" font-weight="bold"%3E🐾%3C/text%3E%3C/svg%3E';
              }}
            />
            <span className="hidden sm:block font-bold text-xl text-gray-900">
              HealthyPet
            </span>
          </Link>

          {/* Desktop & Tablet Menu */}
          <div className="hidden xl:flex items-center space-x-1 flex-wrap gap-2">
            <Link
              to="/"
              className="px-3 py-2 text-gray-700 hover:text-blue-600 transition duration-300 font-medium"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="px-3 py-2 text-gray-700 hover:text-blue-600 transition duration-300 font-medium"
            >
              About
            </Link>
            <Link
              to="/services"
              className="px-3 py-2 text-gray-700 hover:text-blue-600 transition duration-300 font-medium"
            >
              Services
            </Link>
            <Link
              to="/contact"
              className="px-3 py-2 text-gray-700 hover:text-blue-600 transition duration-300 font-medium"
            >
              Contact
            </Link>

            {/* Medical Records Link - Only visible if logged in */}
            {user && (
              <Link
                to="/medical-records"
                className="px-3 py-2 text-gray-700 hover:text-blue-600 transition duration-300 font-medium"
              >
                Medical
              </Link>
            )}

            {/* Auth Section */}
            {user ? (
              <div className="ml-4 flex items-center gap-2 flex-wrap">
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user.name}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="px-3 lg:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 font-medium flex items-center gap-1 whitespace-nowrap"
                >
                  <span className="hidden lg:inline">Logout</span>
                  <X size={16} className="lg:hidden" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 lg:px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition duration-300 font-medium flex items-center gap-2 whitespace-nowrap"
              >
                <LogIn size={18} />
                <span>Login</span>
              </button>
            )}

            {/* Booking Button - Only visible if logged in */}
            {user && (
              <Link
                to="/booking"
                className="px-4 lg:px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition duration-300 font-medium whitespace-nowrap"
              >
                Booking
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
            onClick={toggleMenu}
            className="xl:hidden p-2 text-gray-700 hover:text-blue-600 transition"
          >
            {isOpen ? (
              <X
                size={24}
                className="animate-spin-fast transition-transform duration-300"
                style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
              />
            ) : (
              <Menu
                size={24}
                className="animate-pulse-slow transition-transform duration-300"
                style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
              />
            )}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`xl:hidden bg-white border-t border-gray-200 origin-top transition-all duration-300 ${
          isOpen
            ? "animate-slide-down opacity-100 visible"
            : "animate-slide-up opacity-0 invisible"
        }`}
        style={{
          maxHeight: isOpen ? "1000px" : "0px",
          overflow: "hidden",
        }}
      >
        {isOpen && (
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-center text-gray-700 hover:text-blue-600 transition font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-center text-gray-700 hover:text-blue-600 transition font-medium"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/services"
              className="block px-3 py-2 text-center text-gray-700 hover:text-blue-600 transition font-medium"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 text-center text-gray-700 hover:text-blue-600 transition font-medium"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>

            {/* Mobile Medical Records Link */}
            {user && (
              <Link
                to="/medical-records"
                className="block px-3 py-2 text-center text-gray-700 hover:text-blue-600 transition font-medium"
                onClick={() => setIsOpen(false)}
              >
                Medical Records
              </Link>
            )}

            {/* Mobile Auth Section */}
            <div className="border-t border-gray-200 pt-2 mt-2">
              {user ? (
                <>
                  <div className="px-3 py-2 flex items-center justify-center gap-2">
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {user.name}
                    </span>
                  </div>
                  <Link
                    to="/booking"
                    className="block w-full px-4 py-2.5 text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg font-medium hover:shadow-lg transition mx-2 my-1 text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Booking
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="block w-full px-4 py-2.5 text-white bg-red-600 rounded-lg font-medium hover:bg-red-700 transition mx-2 my-1 text-center"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setIsOpen(false);
                  }}
                  className="block w-full px-3 py-2 text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg font-medium hover:shadow-lg transition mx-2 my-1 flex items-center justify-center gap-2"
                >
                  <LogIn size={16} />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </nav>
  );
}
