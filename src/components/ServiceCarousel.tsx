interface ServiceItem {
  name: string;
  desc: string;
}

interface ServiceCarouselProps {
  isVisible: boolean;
}

export default function ServiceCarousel({ isVisible }: ServiceCarouselProps) {
  const services: ServiceItem[] = [
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
  ];

  // Create duplicated array for seamless loop
  const duplicatedServices = [...services, ...services];

  return (
    <>
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

        .carousel-track {
          display: flex;
          animation: none;
        }

        .carousel-track.animate {
          animation: slide 16s linear infinite;
        }

        .carousel-track:hover {
          animation-play-state: paused;
        }

        .carousel-item {
          min-width: calc(100% / 4);
          padding: 0 12px;
          flex-shrink: 0;
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
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.2) 0%,
            rgba(0, 0, 0, 0.1) 100%
          );
          z-index: 1;
        }

        .service-card-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.3) 100%
          );
          padding: 20px;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          transition: background 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 2;
        }

        .service-card:hover .service-card-overlay {
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.2) 0%,
            rgba(0, 0, 0, 0.85) 100%
          );
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

        /* Mobile: 640px and below - Caption hidden, shown on hover */
        @media (max-width: 640px) {
          .service-card {
            height: 220px;
          }

          .service-card-overlay {
            height: 50%;
            padding: 12px;
            background: linear-gradient(
              180deg,
              rgba(0, 0, 0, 0) 0%,
              rgba(0, 0, 0, 0.5) 100%
            );
          }

          .service-card-overlay h3 {
            font-size: 1rem;
            margin: 0;
          }

          .service-card-overlay p {
            max-height: 0;
            overflow: hidden;
          }

          .service-card:hover .service-card-overlay {
            background: linear-gradient(
              180deg,
              rgba(0, 0, 0, 0.2) 0%,
              rgba(0, 0, 0, 0.8) 100%
            );
          }

          .service-card:hover .service-card-overlay p {
            max-height: 70px;
            margin-top: 6px;
            overflow: visible;
          }
        }

        /* Tablet: 641px to 1024px - 2 columns */
        @media (min-width: 641px) and (max-width: 1024px) {
          .carousel-item {
            min-width: calc(100% / 2);
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
            animation: slide 12s linear infinite;
          }

          .service-card-overlay p {
            max-height: 60px;
            overflow: hidden;
          }

          .service-card:hover .service-card-overlay p {
            max-height: 100px;
          }
        }

        /* Mobile: 480px and below - 1 column */
        @media (max-width: 480px) {
          .carousel-item {
            min-width: calc(100% / 1);
            padding: 0 4px;
          }

          .service-card {
            height: 220px;
          }

          @keyframes slide {
            0% {
              transform: translateX(0);
            }
            25% {
              transform: translateX(calc(-100% / 1));
            }
            50% {
              transform: translateX(calc(-200% / 1));
            }
            75% {
              transform: translateX(calc(-300% / 1));
            }
            100% {
              transform: translateX(0);
            }
          }

          .carousel-track.animate {
            animation: slide 16s linear infinite;
          }
        }
      `}</style>

      <div className="relative overflow-hidden">
        <div className={`carousel-track ${isVisible ? "animate" : ""}`}>
          {duplicatedServices.map((service, index) => (
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
    </>
  );
}
