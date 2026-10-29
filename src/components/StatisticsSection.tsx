import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

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

export default function StatisticsSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const stats = [
    {
      number: 12,
      suffix: "+",
      title: "Tahun Pengalaman",
      description: "Melayani dengan dedikasi penuh",
      color: "text-blue-600",
    },
    {
      number: 5000,
      suffix: "+",
      title: "Hewan Dirawat",
      description: "Dari berbagai jenis dan kondisi",
      color: "text-cyan-600",
    },
    {
      number: 100,
      suffix: "%",
      title: "Kepuasan Pelanggan",
      description: "Komitmen kami untuk excellence",
      color: "text-purple-600",
    },
    {
      number: -1,
      text: "24/7",
      title: "Layanan Darurat",
      description: "Siap kapan saja Anda butuh",
      color: "text-green-600",
    },
  ];

  useGSAP(
    (_, contextSafe) => {
      const cards = gsap.utils.toArray<HTMLElement>(".stat-card");
      gsap.set(cards, { autoAlpha: 0, y: 20 });
      const animateCards = () => {
        gsap.to(cards, {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.1,
          ease: "power2.out",
        });
      };
      const revealCards = contextSafe
        ? contextSafe(animateCards)
        : animateCards;

      ScrollTrigger.create({
        trigger: gridRef.current,
        start: "top 84%",
        once: true,
        onEnter: revealCards,
      });
    },
    { scope: gridRef }
  );

  return (
    <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.995 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
        >
          <div className="stat-card bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition duration-300 text-center">
            <div className={`text-5xl font-bold ${stat.color} mb-3`}>
              {stat.text ? (
                stat.text
              ) : (
                <>
                  <CounterNumber end={stat.number} duration={3000} />
                  {stat.suffix}
                </>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900">{stat.title}</h3>
            <p className="text-gray-600 text-sm mt-2">{stat.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
