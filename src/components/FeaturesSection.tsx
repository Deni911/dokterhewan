import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface FeaturesProps {
  isFeatureVisible: boolean;
}

export default function FeaturesSection({ isFeatureVisible }: FeaturesProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const features = [
    {
      title: "Dokter Berpengalaman",
      description:
        "Tim dokter hewan profesional dengan pengalaman lebih dari 15 tahun di bidangnya.",
      image: "/images/dokterberpengalaman.webp",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
    },
    {
      title: "Perawatan Berkualitas",
      description:
        "Menggunakan peralatan modern dan metode perawatan terkini untuk kesehatan optimal.",
      image: "/images/pelayananberkualitas.webp",
      gradient: "linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)",
    },
    {
      title: "Layanan 24 Jam",
      description:
        "Siap melayani Anda kapan saja, baik untuk konsultasi rutin maupun keadaan darurat.",
      image: "/images/customerservice.webp",
      gradient: "linear-gradient(135deg, #a855f7 0%, #6d28d9 100%)",
    },
  ];

  useGSAP(
    (_, contextSafe) => {
      const cards = gsap.utils.toArray<HTMLElement>(".feature-card");
      gsap.set(cards, { autoAlpha: 0, y: 24 });
      const animateCards = () => {
        gsap.to(cards, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.14,
          ease: "power2.out",
        });
      };
      const revealCards = contextSafe
        ? contextSafe(animateCards)
        : animateCards;

      ScrollTrigger.create({
        trigger: gridRef.current,
        start: "top 82%",
        once: true,
        onEnter: revealCards,
      });
    },
    { scope: gridRef }
  );

  return (
    <>
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
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.3) 0%,
            rgba(0, 0, 0, 0.1) 100%
          );
          z-index: 1;
        }

        .feature-card-overlay {
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
          padding: 24px;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          transition: background 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 2;
        }

        .feature-card:hover .feature-card-overlay {
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.2) 0%,
            rgba(0, 0, 0, 0.7) 100%
          );
        }

        .feature-card-overlay h3 {
          font-size: 1.375rem;
          font-weight: bold;
          margin: 0;
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

        @media (max-width: 768px) {
          .feature-card {
            height: 280px;
          }

          .feature-card-overlay h3 {
            font-size: 1.1rem;
          }

          .feature-card-overlay p {
            font-size: 0.85rem;
          }
        }
      `}</style>

      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="h-full"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.995 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            <div
              className={`feature-card ${isFeatureVisible ? "" : "opacity-0"}`}
              style={{
                backgroundImage: `url('${feature.image}')`,
              }}
              onError={(e) => {
                e.currentTarget.style.backgroundImage = feature.gradient;
              }}
            >
              <div className="feature-card-overlay">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
