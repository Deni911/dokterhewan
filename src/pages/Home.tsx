import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";
import FeaturesSection from "../components/FeaturesSection";
import ServiceCarousel from "../components/ServiceCarousel";
import StatisticsSection from "../components/StatisticsSection";
import PawLottie from "../components/PawLottie";

const MotionLink = motion.create(Link);
const heroBackgrounds = [
  "/images/petbannerfix.webp",
  "/images/petbanner-burung.webp",
  "/images/petbanner-hamster.webp",
  "/images/petbanner-kelinci.webp",
];
const backgroundFadeTransition = {
  opacity: { duration: 1.8, ease: [0.22, 1, 0.36, 1] as const },
  scale: { duration: 8, ease: "linear" as const },
};
const heroContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.08 },
  },
};
const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Home() {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const [isFeatureVisible, setIsFeatureVisible] = useState(false);
  const [isServiceVisible, setIsServiceVisible] = useState(false);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setBackgroundIndex((current) => (current + 1) % heroBackgrounds.length);
    }, 7500);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion]);

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
        className="relative text-white py-16 md:py-24 overflow-hidden min-h-[calc(100svh-4rem)] flex items-center w-full bg-[center_42%] md:bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${heroBackgrounds[0]})`,
        }}
      >
        {heroBackgrounds.map((image, index) => {
          const isActive = index === backgroundIndex;

          return (
            <motion.img
              key={image}
              src={image}
              alt=""
              aria-hidden="true"
              loading="eager"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-[center_42%] md:object-center"
              initial={{ opacity: index === 0 ? 1 : 0, scale: 1 }}
              animate={{
                opacity: isActive ? 1 : 0,
                scale: isActive ? 1.035 : 1,
              }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : backgroundFadeTransition
              }
            />
          );
        })}
        <div
          className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-950/25 to-slate-950/10"
          aria-hidden="true"
        />
        <style>{`
          .btn-pesan-sekarang {
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 14px rgba(37, 99, 235, 0.22);
          }

          .btn-pesan-sekarang::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
          }

          .btn-pesan-sekarang:hover {
            background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
            box-shadow: 0 0 30px rgba(37, 99, 235, 0.6), 0 8px 20px rgba(37, 99, 235, 0.3);
          }

          .btn-pesan-sekarang:hover::before {
            left: 100%;
          }

          .btn-lihat-layanan {
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 14px rgba(15, 23, 42, 0.14);
          }

          .btn-lihat-layanan::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.5s;
          }

          .btn-lihat-layanan:hover {
            background: linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%);
            box-shadow: 0 0 30px rgba(75, 85, 99, 0.4), 0 8px 20px rgba(75, 85, 99, 0.2);
            transform: translateY(-2px);
          }

          .btn-lihat-layanan:hover::before {
            left: 100%;
          }

          .btn-lihat-semua-layanan {
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 14px rgba(37, 99, 235, 0.22);
          }

          .btn-lihat-semua-layanan::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
          }

          .btn-lihat-semua-layanan:hover {
            background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
            box-shadow: 0 0 30px rgba(37, 99, 235, 0.6), 0 8px 20px rgba(37, 99, 235, 0.3);
          }

          .btn-lihat-semua-layanan:hover::before {
            left: 100%;
          }

        `}</style>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.div
              className="relative -top-14 space-y-4 md:top-0"
              variants={heroContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1
                variants={heroItemVariants}
                className="text-4xl md:text-5xl font-bold leading-tight text-white hero-title drop-shadow-lg"
              >
                Kesehatan Hewan Peliharaan Anda adalah Prioritas Kami
              </motion.h1>
              <motion.p
                variants={heroItemVariants}
                className="text-lg text-white hero-subtitle drop-shadow-md font-medium"
              >
                Platform kesehatan hewan peliharaan modern dengan dokter
                berpengalaman dan fasilitas terbaik untuk perawatan hewan
                kesayangan Anda.
              </motion.p>
              <motion.div
                variants={heroItemVariants}
                className="relative top-14 flex flex-col sm:flex-row gap-4 hero-buttons md:top-0"
              >
                <MotionLink
                  to="/booking"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold text-center shadow-md btn-pesan-sekarang transition-all duration-300"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 26 }}
                >
                  Pesan Sekarang
                </MotionLink>
                <MotionLink
                  to="/services"
                  className="px-8 py-3 bg-gray-200 text-blue-600 rounded-lg font-bold text-center flex items-center justify-center shadow-md btn-lihat-layanan transition-all duration-300"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 26 }}
                >
                  Lihat Layanan <ChevronRight size={20} />
                </MotionLink>
              </motion.div>
            </motion.div>
            <div className="hidden md:block">
              <div className="flex justify-center">
                <PawLottie />
              </div>
            </div>
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
            <MotionLink
              to="/services"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-bold btn-lihat-semua-layanan transition-all duration-300"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 26 }}
            >
              Lihat Semua Layanan
            </MotionLink>
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
        <style>{`
          .btn-cta-konsultasi {
            position: relative;
            overflow: hidden;
          }

          .btn-cta-konsultasi::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.5s;
          }

          .btn-cta-konsultasi:hover {
            background: linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%);
            box-shadow: 0 0 30px rgba(75, 85, 99, 0.4), 0 8px 20px rgba(75, 85, 99, 0.2);
          }

          .btn-cta-konsultasi:hover::before {
            left: 100%;
          }
        `}</style>
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
            className="inline-block px-8 py-3 bg-gray-200 text-blue-600 rounded-lg font-bold btn-glow btn-glow-gray-static transition-all duration-300 btn-cta-konsultasi"
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
