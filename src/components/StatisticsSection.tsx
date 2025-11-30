import { useRef, useState, useEffect } from "react";

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition duration-300 text-center"
        >
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
      ))}
    </div>
  );
}
