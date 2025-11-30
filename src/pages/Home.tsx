import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";
import FeaturesSection from "../components/FeaturesSection";
import ServiceCarousel from "../components/ServiceCarousel";
import StatisticsSection from "../components/StatisticsSection";

export default function Home() {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const [isFeatureVisible, setIsFeatureVisible] = useState(false);
  const [isServiceVisible, setIsServiceVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsFeatureVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsServiceVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (servicesRef.current) {
      observer.observe(servicesRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleBookingClick = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      // Redirect ke booking page
      window.location.href = "/booking";
    }
  };
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section
        className="relative text-gray-900 py-10 md:py-20 overflow-hidden min-h-screen flex items-center w-full"
        style={{
          backgroundImage: "url(/images/petbannerfix.webp)",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <style>{`
          .hero-title {
            animation: slideDown 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            opacity: 0;
          }

          .hero-subtitle {
            animation: fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards;
            opacity: 0;
          }

          .hero-buttons {
            animation: fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s forwards;
            opacity: 0;
          }

          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full -mt-20 md:-mt-40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight hero-title drop-shadow-lg">
                Kesehatan Hewan Peliharaan Anda adalah Prioritas Kami
              </h1>
              <p className="text-lg text-white hero-subtitle drop-shadow-md font-medium">
                Platform kesehatan hewan peliharaan modern dengan dokter
                berpengalaman dan fasilitas terbaik untuk perawatan hewan
                kesayangan Anda.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 hero-buttons">
                <Link
                  to="/booking"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 hover:shadow-lg transition duration-300 text-center shadow-md"
                >
                  Pesan Sekarang
                </Link>
                <Link
                  to="/services"
                  className="px-8 py-3 bg-gray-200 text-blue-600 rounded-lg font-bold hover:bg-gray-300 transition duration-300 text-center flex items-center justify-center shadow-md"
                >
                  Lihat Layanan <ChevronRight size={20} />
                </Link>
              </div>
            </div>
            <div className="hidden md:block" />
          </div>
        </div>
      </section>

      {/* Features Section - Subtle Gradient Background */}
      <section className="py-16 md:py-20 bg-[#f3f4f6]" ref={featuresRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${
                isFeatureVisible ? "fade-in-scale-title" : "opacity-0"
              }`}
            >
              Mengapa Memilih Kami?
            </h2>
            <p
              className={`text-gray-600 text-lg max-w-3xl mx-auto ${
                isFeatureVisible ? "fade-in-text" : "opacity-0"
              }`}
            >
              Kami menyediakan layanan kesehatan hewan terbaik dengan teknologi
              modern dan tim profesional
            </p>

            <style>{`
              .fade-in-scale-title {
                animation: fadeInScale 0.8s ease-out;
              }

              .fade-in-text {
                animation: fadeInScale 0.8s ease-out 0.2s both;
              }

              @keyframes fadeInScale {
                from {
                  opacity: 0;
                  transform: scale(0.95);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
            `}</style>
          </div>

          <FeaturesSection isFeatureVisible={isFeatureVisible} />
        </div>
      </section>

      {/* Services Preview Section - Slider Carousel */}
      <section className="py-16 md:py-20 bg-[#f3f4f6]" ref={servicesRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${
                isServiceVisible ? "service-title" : "opacity-0"
              }`}
            >
              Layanan Kami
            </h2>
            <p
              className={`text-gray-600 text-lg ${
                isServiceVisible ? "service-subtitle" : "opacity-0"
              }`}
            >
              Berbagai layanan kesehatan hewan untuk kebutuhan Anda
            </p>

            <style>{`
              .service-title {
                animation: fadeInScale 0.8s ease-out;
              }

              .service-subtitle {
                animation: fadeInScale 0.8s ease-out 0.2s both;
              }

              @keyframes fadeInScale {
                from {
                  opacity: 0;
                  transform: scale(0.95);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
            `}</style>
          </div>

          <ServiceCarousel isVisible={isServiceVisible} />

          <div className="text-center mt-10">
            <Link
              to="/services"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition duration-300"
            >
              Lihat Semua Layanan
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 md:py-20 bg-[#f3f4f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kepercayaan Ribuan Pelanggan
            </h2>
            <p className="text-gray-600 text-lg">
              Statistik kesuksesan HealthyPet dalam melayani hewan kesayangan
              Anda
            </p>
          </div>

          <StatisticsSection />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Siap Menjaga Kesehatan Hewan Anda?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Hubungi kami sekarang untuk membuat janji temu atau konsultasi
            gratis dengan dokter kami.
          </p>
          <button
            onClick={handleBookingClick}
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-bold hover:shadow-lg transition duration-300"
          >
            Pesan Konsultasi Sekarang
          </button>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
