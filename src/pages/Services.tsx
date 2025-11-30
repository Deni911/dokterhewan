import { CheckCircle, Clock, Users, Award } from "lucide-react";
import {
  FaVirus,
  FaHeart,
  FaDroplet,
  FaKitMedical,
  FaTooth,
  FaBandage,
} from "react-icons/fa6";
import { useState, useEffect, useRef } from "react";

export default function Services() {
  const [isServicesVisible, setIsServicesVisible] = useState(false);
  const [isFeaturesVisible, setIsFeaturesVisible] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsServicesVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (servicesRef.current) {
      observer.observe(servicesRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsFeaturesVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const services = [
    {
      icon: FaVirus,
      name: "Vaksinasi",
      desc: "Program vaksinasi lengkap untuk hewan peliharaan kesayangan Anda",
      details: [
        "Vaksin rabies",
        "Vaksin DHPP (untuk anjing)",
        "Vaksin FVRCP (untuk kucing)",
        "Vaksin lainnya sesuai kebutuhan",
      ],
    },
    {
      icon: FaHeart,
      name: "Pemeriksaan Kesehatan",
      desc: "Pemeriksaan menyeluruh untuk memastikan kesehatan optimal hewan Anda",
      details: [
        "Pemeriksaan fisik lengkap",
        "Tes darah",
        "USG (Ultrasonografi)",
        "Konsultasi dengan dokter",
      ],
    },
    {
      icon: FaDroplet,
      name: "Grooming",
      desc: "Layanan perawatan dan kebersihan hewan dengan standar profesional",
      details: [
        "Mandi dan shampo",
        "Potong kuku",
        "Pembersihan telinga",
        "Perawatan rambut",
      ],
    },
    {
      icon: FaKitMedical,
      name: "Operasi",
      desc: "Layanan operasi dengan teknologi modern dan anestesi yang aman",
      details: [
        "Operasi sterilisasi",
        "Operasi tumor",
        "Operasi darurat",
        "Penanganan fraktur",
      ],
    },
    {
      icon: FaTooth,
      name: "Perawatan Gigi",
      desc: "Pembersihan dan perawatan gigi untuk kesehatan mulut hewan",
      details: [
        "Scaling gigi",
        "Pencabutan gigi",
        "Perawatan gusi",
        "Konsultasi oral health",
      ],
    },
    {
      icon: FaBandage,
      name: "Obat-Obatan",
      desc: "Penyediaan obat-obatan berkualitas untuk berbagai kondisi kesehatan",
      details: ["Obat resep", "Suplemen vitamin", "Obat cacing", "Obat kulit"],
    },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-16 md:py-20">
        <style>{`
          .hero-title {
            animation: fadeInDown 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            opacity: 0;
          }

          .hero-subtitle {
            animation: fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards;
            opacity: 0;
          }

          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
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

          @keyframes bounceInScale {
            0% {
              opacity: 0;
              transform: scale(0.8) translateY(20px);
            }
            50% {
              opacity: 1;
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          /* Service cards animation */
          .service-card {
            opacity: 0;
          }

          .service-card.animate {
            animation: slideInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }

          .service-card:nth-child(1).animate {
            animation-delay: 0s;
          }

          .service-card:nth-child(2).animate {
            animation-delay: 0.1s;
          }

          .service-card:nth-child(3).animate {
            animation-delay: 0.2s;
          }

          .service-card:nth-child(4).animate {
            animation-delay: 0.3s;
          }

          .service-card:nth-child(5).animate {
            animation-delay: 0.4s;
          }

          .service-card:nth-child(6).animate {
            animation-delay: 0.5s;
          }

          /* Features cards animation */
          .feature-card {
            opacity: 0;
          }

          .feature-card.animate {
            animation: slideInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }

          .feature-card:nth-child(1).animate {
            animation-delay: 0s;
          }

          .feature-card:nth-child(2).animate {
            animation-delay: 0.1s;
          }

          .feature-card:nth-child(3).animate {
            animation-delay: 0.2s;
          }

          .feature-card:nth-child(4).animate {
            animation-delay: 0.3s;
          }
        `}</style>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 hero-title">
            Layanan Kami
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl hero-subtitle">
            Berbagai layanan kesehatan hewan komprehensif untuk memastikan
            kesehatan optimal hewan kesayangan Anda.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-20 bg-white" ref={servicesRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className={`bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition duration-300 service-card ${
                  isServicesVisible ? "animate" : ""
                }`}
              >
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 text-center border-b border-gray-200">
                  <div className="text-5xl mb-4 text-blue-600">
                    <service.icon />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {service.name}
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-6">{service.desc}</p>
                  <ul className="space-y-3">
                    {service.details.map((detail, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle
                          size={20}
                          className="text-blue-600 mr-3 mt-0.5 flex-shrink-0"
                        />
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-gray-50" ref={featuresRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Keunggulan Layanan Kami
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              className={`bg-white p-8 rounded-lg border border-gray-200 flex items-start feature-card ${
                isFeaturesVisible ? "animate" : ""
              }`}
            >
              <Clock
                size={32}
                className="text-blue-600 mr-4 mt-1 flex-shrink-0"
              />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Layanan 24 Jam
                </h3>
                <p className="text-gray-600">
                  Kami siap melayani Anda kapan saja, termasuk hari libur dan
                  malam hari untuk keadaan darurat.
                </p>
              </div>
            </div>

            <div
              className={`bg-white p-8 rounded-lg border border-gray-200 flex items-start feature-card ${
                isFeaturesVisible ? "animate" : ""
              }`}
            >
              <Award
                size={32}
                className="text-cyan-600 mr-4 mt-1 flex-shrink-0"
              />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Dokter Berpengalaman
                </h3>
                <p className="text-gray-600">
                  Tim dokter hewan profesional dengan pengalaman puluhan tahun
                  di bidang kesehatan hewan.
                </p>
              </div>
            </div>

            <div
              className={`bg-white p-8 rounded-lg border border-gray-200 flex items-start feature-card ${
                isFeaturesVisible ? "animate" : ""
              }`}
            >
              <Users
                size={32}
                className="text-purple-600 mr-4 mt-1 flex-shrink-0"
              />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Perawatan Personal
                </h3>
                <p className="text-gray-600">
                  Setiap hewan mendapatkan perhatian dan perawatan khusus sesuai
                  dengan kebutuhan mereka.
                </p>
              </div>
            </div>

            <div
              className={`bg-white p-8 rounded-lg border border-gray-200 flex items-start feature-card ${
                isFeaturesVisible ? "animate" : ""
              }`}
            >
              <CheckCircle
                size={32}
                className="text-green-600 mr-4 mt-1 flex-shrink-0"
              />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Teknologi Modern
                </h3>
                <p className="text-gray-600">
                  Menggunakan peralatan medis terkini untuk diagnosis dan
                  perawatan yang akurat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Info */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Harga Terjangkau untuk Layanan Berkualitas
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Kami menawarkan paket layanan yang kompetitif tanpa mengorbankan
              kualitas perawatan hewan Anda.
            </p>
            <p className="text-blue-100">
              Hubungi kami untuk informasi harga lengkap dan paket bundling yang
              tersedia.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
