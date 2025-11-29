import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";

function CounterNumber({
  end,
  duration = 2000,
}: {
  end: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const increment = end / (duration / 50);
    const interval = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(interval);
      } else {
        setCount(Math.floor(start));
      }
    }, 50);

    return () => clearInterval(interval);
  }, [hasStarted, end, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function Home() {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const heroImageRef = useRef<HTMLImageElement>(null);
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
      <section className="relative bg-[#f3f4f6] text-gray-900 py-10 md:py-15 overflow-hidden">
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

          .hero-image {
            animation: zoomIn 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards;
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

          @keyframes zoomIn {
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight hero-title">
                Kesehatan Hewan Peliharaan Anda adalah Prioritas Kami
              </h1>
              <p className="text-lg text-gray-600 hero-subtitle">
                Platform kesehatan hewan peliharaan modern dengan dokter
                berpengalaman dan fasilitas terbaik untuk perawatan hewan
                kesayangan Anda.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 hero-buttons">
                <Link
                  to="/booking"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 hover:shadow-lg transition duration-300 text-center"
                >
                  Pesan Sekarang
                </Link>
                <Link
                  to="/services"
                  className="px-8 py-3 bg-gray-200 text-blue-600 rounded-lg font-bold hover:bg-gray-300 transition duration-300 text-center flex items-center justify-center"
                >
                  Lihat Layanan <ChevronRight size={20} />
                </Link>
              </div>
            </div>
            <div className="w-full">
              {/* Image container - transparent background */}
              <img
                ref={heroImageRef}
                src="/images/petbanner.png"
                alt="Anjing dan Kucing - HealthyPet"
                className="parallax-image object-contain w-full h-64 md:h-96 lg:h-[28rem] hero-image"
                onError={(e) => {
                  e.currentTarget.src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="transparent" width="400" height="300" opacity="0"/%3E%3C/svg%3E';
                }}
              />
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
          </div>

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

            .feature-card {
              position: relative;
              overflow: hidden;
              height: 400px;
              border-radius: 8px;
              background-size: cover;
              background-position: center;
              display: flex;
              align-items: flex-end;
              cursor: pointer;
            }

            .feature-card::before {
              content: '';
              position: absolute;
              inset: 0;
              background: linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 100%);
              z-index: 1;
            }

            .feature-card-overlay {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 50%;
              background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 100%);
              padding: 24px;
              color: white;
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              transform: translateY(0);
              transition: background 0.4s cubic-bezier(0.4, 0, 0.2, 1);
              z-index: 2;
            }

            .feature-card:hover .feature-card-overlay {
              background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.70) 100%);
            }

            .feature-card-overlay h3 {
              font-size: 1.375rem;
              font-weight: bold;
              margin: 0 0 0 0;
            }

            .feature-card-overlay p {
              font-size: 0.95rem;
              line-height: 1.4;
              max-height: 0;
              overflow: hidden;
              margin: 0;
              transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .feature-card:hover .feature-card-overlay p {
              max-height: 100px;
              margin-top: 8px;
            }

            .feature-card {
              animation: slideInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
              opacity: 0;
            }

            .feature-card:nth-child(1) {
              animation-delay: 0.1s;
            }

            .feature-card:nth-child(2) {
              animation-delay: 0.2s;
            }

            .feature-card:nth-child(3) {
              animation-delay: 0.3s;
            }

            /* Conditional animations based on visibility */
            .slide-in-up-1 {
              animation: slideInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both !important;
            }

            .slide-in-up-2 {
              animation: slideInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both !important;
            }

            .slide-in-up-3 {
              animation: slideInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both !important;
            }

            @keyframes slideInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .parallax-image {
              transition: transform 0.1s ease-out;
              will-change: transform;
            }
          `}</style>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 - Dokter Berpengalaman */}
            <div
              className={`feature-card ${
                isFeatureVisible ? "slide-in-up-1" : "opacity-0"
              }`}
              style={{
                backgroundImage: "url('/images/dokterberpengalaman.webp')",
              }}
              onError={(e) => {
                e.currentTarget.style.backgroundImage =
                  "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)";
              }}
            >
              <div className="feature-card-overlay">
                <h3>Dokter Berpengalaman</h3>
                <p>
                  Tim dokter hewan profesional dengan pengalaman lebih dari 15
                  tahun di bidangnya.
                </p>
              </div>
            </div>

            {/* Feature 2 - Perawatan Berkualitas */}
            <div
              className={`feature-card ${
                isFeatureVisible ? "slide-in-up-2" : "opacity-0"
              }`}
              style={{
                backgroundImage: "url('/images/pelayananberkualitas.webp')",
              }}
              onError={(e) => {
                e.currentTarget.style.backgroundImage =
                  "linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)";
              }}
            >
              <div className="feature-card-overlay">
                <h3>Perawatan Berkualitas</h3>
                <p>
                  Menggunakan peralatan modern dan metode perawatan terkini
                  untuk kesehatan optimal.
                </p>
              </div>
            </div>

            {/* Feature 3 - Layanan 24 Jam */}
            <div
              className={`feature-card ${
                isFeatureVisible ? "slide-in-up-3" : "opacity-0"
              }`}
              style={{
                backgroundImage: "url('/images/customerservice.webp')",
              }}
              onError={(e) => {
                e.currentTarget.style.backgroundImage =
                  "linear-gradient(135deg, #a855f7 0%, #6d28d9 100%)";
              }}
            >
              <div className="feature-card-overlay">
                <h3>Layanan 24 Jam</h3>
                <p>
                  Siap melayani Anda kapan saja, baik untuk konsultasi rutin
                  maupun keadaan darurat.
                </p>
              </div>
            </div>
          </div>
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
          </div>

          {/* Carousel Container */}
          <div className="relative overflow-hidden">
            <style>{`
              .service-title {
                animation: fadeInScale 0.8s ease-out;
              }

              .service-subtitle {
                animation: fadeInScale 0.8s ease-out 0.2s both;
              }

              @keyframes slide {
                0% {
                  transform: translateX(0);
                }
                25% {
                  transform: translateX(calc(-100% / 4));
                }
                50% {
                  transform: translateX(calc(-200% / 4));
                }
                75% {
                  transform: translateX(calc(-300% / 4));
                }
                100% {
                  transform: translateX(0);
                }
              }
              
              @keyframes slideInUp {
                from {
                  opacity: 0;
                  transform: translateY(30px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              
              .carousel-track {
                display: flex;
                animation: none;
              }

              /* Apply animation only when service section is visible */
              .carousel-track.animate {
                animation: slide 16s linear infinite;
              }
              
              .carousel-track:hover {
                animation-play-state: paused;
              }
              
              .carousel-item {
                min-width: calc(100% / 4);
                padding: 0 12px;
              }

              /* Service card entrance animation */
              .carousel-item:nth-child(1) .service-card {
                animation: slideInUp 0.6s ease-out;
              }
              
              .carousel-item:nth-child(2) .service-card {
                animation: slideInUp 0.6s ease-out 0.1s both;
              }
              
              .carousel-item:nth-child(3) .service-card {
                animation: slideInUp 0.6s ease-out 0.2s both;
              }
              
              .carousel-item:nth-child(4) .service-card {
                animation: slideInUp 0.6s ease-out 0.3s both;
              }
              
              .service-card {
                position: relative;
                overflow: hidden;
                height: 250px;
                border-radius: 8px;
                background-size: cover;
                background-position: center;
                display: flex;
                align-items: flex-end;
                cursor: pointer;
              }

              .service-card::before {
                content: '';
                position: absolute;
                inset: 0;
                background: linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.1) 100%);
                z-index: 1;
              }

              .service-card-overlay {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 50%;
                background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 100%);
                padding: 20px;
                color: white;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                transition: background 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 2;
              }

              .service-card:hover .service-card-overlay {
                background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.85) 100%);
              }

              .service-card-overlay h3 {
                font-size: 1.25rem;
                font-weight: bold;
                margin: 0;
              }

              .service-card-overlay p {
                font-size: 0.9rem;
                line-height: 1.4;
                max-height: 0;
                overflow: hidden;
                margin: 0;
                transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
              }

              .service-card:hover .service-card-overlay p {
                max-height: 80px;
                margin-top: 6px;
              }
              
              @media (max-width: 1024px) {
                .carousel-item {
                  min-width: calc(100% / 3);
                }

                .carousel-item:nth-child(1) .service-card {
                  animation: slideInUp 0.6s ease-out;
                }
                
                .carousel-item:nth-child(2) .service-card {
                  animation: slideInUp 0.6s ease-out 0.1s both;
                }
                
                .carousel-item:nth-child(3) .service-card {
                  animation: slideInUp 0.6s ease-out 0.2s both;
                }
                
                @keyframes slide {
                  0% {
                    transform: translateX(0);
                  }
                  33.33% {
                    transform: translateX(calc(-100% / 3));
                  }
                  66.66% {
                    transform: translateX(calc(-200% / 3));
                  }
                  100% {
                    transform: translateX(0);
                  }
                }
                
                .carousel-track.animate {
                  animation: slide 12s linear infinite;
                }
              }
              
              @media (max-width: 768px) {
                .carousel-item {
                  min-width: calc(100% / 2);
                }

                .carousel-item:nth-child(1) .service-card {
                  animation: slideInUp 0.6s ease-out;
                }
                
                .carousel-item:nth-child(2) .service-card {
                  animation: slideInUp 0.6s ease-out 0.1s both;
                }
                
                @keyframes slide {
                  0% {
                    transform: translateX(0);
                  }
                  50% {
                    transform: translateX(calc(-100% / 2));
                  }
                  100% {
                    transform: translateX(0);
                  }
                }
                
                .carousel-track.animate {
                  animation: slide 10s linear infinite;
                }
              }
            `}</style>

            <div
              className={`carousel-track ${isServiceVisible ? "animate" : ""}`}
            >
              {[
                {
                  name: "Vaksinasi",
                  desc: "Vaksin lengkap untuk hewan peliharaan",
                },
                {
                  name: "Pemeriksaan",
                  desc: "Pemeriksaan kesehatan menyeluruh",
                },
                {
                  name: "Grooming",
                  desc: "Perawatan rambut profesional",
                },
                {
                  name: "Operasi",
                  desc: "Operasi dengan teknologi terkini",
                },
                // Duplicate items untuk seamless loop
                {
                  name: "Vaksinasi",
                  desc: "Vaksin lengkap untuk hewan peliharaan",
                },
                {
                  name: "Pemeriksaan",
                  desc: "Pemeriksaan kesehatan menyeluruh",
                },
                {
                  name: "Grooming",
                  desc: "Perawatan rambut profesional",
                },
                {
                  name: "Operasi",
                  desc: "Operasi dengan teknologi terkini",
                },
              ].map((service, index) => (
                <div key={index} className="carousel-item">
                  <div
                    className="service-card"
                    style={{
                      backgroundImage: `url('/images/${service.name.toLowerCase()}.webp')`,
                    }}
                    onError={(e) => {
                      e.currentTarget.style.backgroundImage =
                        "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)";
                    }}
                  >
                    <div className="service-card-overlay">
                      <h3>{service.name}</h3>
                      <p>{service.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Stat 1 */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition duration-300 text-center">
              <div className="text-5xl font-bold text-blue-600 mb-3">
                <CounterNumber end={12} duration={3000} />+
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Tahun Pengalaman
              </h3>
              <p className="text-gray-600 text-sm mt-2">
                Melayani dengan dedikasi penuh
              </p>
            </div>

            {/* Stat 2 */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition duration-300 text-center">
              <div className="text-5xl font-bold text-cyan-600 mb-3">
                <CounterNumber end={5000} duration={3000} />+
              </div>
              <h3 className="text-xl font-bold text-gray-900">Hewan Dirawat</h3>
              <p className="text-gray-600 text-sm mt-2">
                Dari berbagai jenis dan kondisi
              </p>
            </div>

            {/* Stat 3 */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition duration-300 text-center">
              <div className="text-5xl font-bold text-purple-600 mb-3">
                100%
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Kepuasan Pelanggan
              </h3>
              <p className="text-gray-600 text-sm mt-2">
                Komitmen kami untuk excellence
              </p>
            </div>

            {/* Stat 4 */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition duration-300 text-center">
              <div className="text-5xl font-bold text-green-600 mb-3">24/7</div>
              <h3 className="text-xl font-bold text-gray-900">
                Layanan Darurat
              </h3>
              <p className="text-gray-600 text-sm mt-2">
                Siap kapan saja Anda butuh
              </p>
            </div>
          </div>
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
