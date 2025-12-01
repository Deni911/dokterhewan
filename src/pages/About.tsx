import { CheckCircle, Users, Award, Globe } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function About() {
  const storyImageRef = useRef<HTMLImageElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);

  const [isStoryVisible, setIsStoryVisible] = useState(false);
  const [isMissionVisible, setIsMissionVisible] = useState(false);
  const [isValuesVisible, setIsValuesVisible] = useState(false);
  const [isTeamVisible, setIsTeamVisible] = useState(false);

  // Parallax effect removed - now using hover zoom instead

  // IntersectionObserver for section visibility
  useEffect(() => {
    const observerOptions = { threshold: 0.2 };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === storyRef.current) setIsStoryVisible(true);
          if (entry.target === missionRef.current) setIsMissionVisible(true);
          if (entry.target === valuesRef.current) setIsValuesVisible(true);
          if (entry.target === teamRef.current) setIsTeamVisible(true);
        }
      });
    };

    const observer = new IntersectionObserver(
      handleIntersection,
      observerOptions
    );

    if (storyRef.current) observer.observe(storyRef.current);
    if (missionRef.current) observer.observe(missionRef.current);
    if (valuesRef.current) observer.observe(valuesRef.current);
    if (teamRef.current) observer.observe(teamRef.current);

    return () => observer.disconnect();
  }, []);
  return (
    <div className="pt-16">
      {/* Hero Section with Animations */}
      <section className="relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl opacity-10"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <style>{`
            .about-hero-title {
              animation: slideDown 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
              opacity: 0;
            }

            .about-hero-subtitle {
              animation: fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards;
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 about-hero-title drop-shadow-lg">
            Tentang Kami
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl about-hero-subtitle drop-shadow-md font-medium">
            Klinik hewan terpercaya yang berdedikasi untuk memberikan perawatan
            kesehatan terbaik bagi hewan kesayangan Anda.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 md:py-20 bg-white" ref={storyRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className={`${isStoryVisible ? "fade-in-left" : "opacity-0"}`}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Sejarah DokterHewan
              </h2>
              <p className="text-gray-600 text-lg mb-4">
                DokterHewan didirikan pada tahun 2010 dengan visi untuk
                memberikan layanan kesehatan hewan berkualitas tinggi di
                Tangerang. Kami memulai dengan klinik kecil dan terus berkembang
                hingga menjadi salah satu klinik hewan terpercaya di kota.
              </p>
              <p className="text-gray-600 text-lg mb-4">
                Dengan pengalaman lebih dari 13 tahun, kami telah melayani
                ribuan hewan peliharaan dari berbagai jenis dan kondisi
                kesehatan.
              </p>
              <p className="text-gray-600 text-lg">
                Komitmen kami adalah terus berinovasi dan meningkatkan kualitas
                layanan untuk kepuasan pelanggan dan kesehatan hewan kesayangan
                Anda.
              </p>
            </div>
            <div
              className={`overflow-hidden rounded-lg shadow-lg story-image-wrapper ${
                isStoryVisible ? "fade-in-right" : "opacity-0"
              }`}
            >
              <img
                ref={storyImageRef}
                src="/images/Dokter-Hewan-sejarah.jpg"
                alt="Sejarah DokterHewan"
                className="object-cover w-full h-96 zoom-on-hover"
                onError={(e) => {
                  e.currentTarget.src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23dbeafe" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="18" fill="%230369a1"%3ESejarah DokterHewan%3C/text%3E%3Ctext x="50%25" y="60%25" text-anchor="middle" dy=".3em" font-size="48"%3E🏥%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
          </div>

          <style>{`
            .fade-in-left {
              animation: fadeInLeft 0.8s ease-out forwards;
              opacity: 0;
            }

            .fade-in-right {
              animation: fadeInRight 0.8s ease-out forwards;
              opacity: 0;
            }

            .story-image-wrapper {
              overflow: hidden;
            }

            .zoom-on-hover {
              transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
              will-change: transform;
            }

            .story-image-wrapper:hover .zoom-on-hover {
              transform: scale(1.08);
            }

            @keyframes fadeInLeft {
              from {
                opacity: 0;
                transform: translateX(-30px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }

            @keyframes fadeInRight {
              from {
                opacity: 0;
                transform: translateX(30px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
          `}</style>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-20 bg-gray-50" ref={missionRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <style>{`
            .mission-vision-title {
              animation: ${
                isMissionVisible ? "fadeInScale" : "none"
              } 0.8s ease-out forwards;
              opacity: ${isMissionVisible ? "1" : "0"};
            }

            .mission-vision-card {
              animation: ${
                isMissionVisible ? "slideUp" : "none"
              } 0.8s ease-out forwards;
              opacity: ${isMissionVisible ? "1" : "0"};
            }

            .mission-vision-card:nth-child(1) {
              animation-delay: 0.1s;
            }

            .mission-vision-card:nth-child(2) {
              animation-delay: 0.3s;
            }

            .mission-vision-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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

            @keyframes slideUp {
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

          <h2
            className={`text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center mission-vision-title`}
          >
            Misi & Visi Kami
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="mission-vision-card bg-white p-8 rounded-lg border border-gray-200 shadow-md text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Globe size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Misi Kami
              </h3>
              <p className="text-gray-600 text-lg">
                Memberikan pelayanan kesehatan hewan peliharaan yang
                profesional, berkualitas, dan terjangkau dengan menggunakan
                teknologi dan pengetahuan terkini untuk meningkatkan
                kesejahteraan hewan kesayangan Anda.
              </p>
            </div>

            <div className="mission-vision-card bg-white p-8 rounded-lg border border-gray-200 shadow-md text-center">
              <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Award size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Visi Kami
              </h3>
              <p className="text-gray-600 text-lg">
                Menjadi klinik hewan terdepan di Indonesia yang dikenal karena
                keunggulan layanan, kepercayaan pelanggan, dan inovasi dalam
                perawatan kesehatan hewan peliharaan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-20 bg-white" ref={valuesRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className={`text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center ${
              isValuesVisible ? "section-title" : "opacity-0"
            }`}
          >
            Nilai-Nilai Kami
          </h2>

          <style>{`
            .section-title {
              animation: ${
                isValuesVisible ? "fadeInScale" : "none"
              } 0.8s ease-out;
            }

            .values-card {
              animation: ${
                isValuesVisible ? "bounceIn" : "none"
              } 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
              opacity: ${isValuesVisible ? "1" : "0"};
            }

            .values-card:nth-child(1) {
              animation-delay: 0s;
            }

            .values-card:nth-child(2) {
              animation-delay: 0.1s;
            }

            .values-card:nth-child(3) {
              animation-delay: 0.2s;
            }

            .values-card:hover .values-icon {
              transform: scale(1.1) rotate(5deg);
            }

            .values-icon {
              transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              display: inline-block;
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

            @keyframes bounceIn {
              0% {
                opacity: 0;
                transform: translateY(20px) scale(0.9);
              }
              50% {
                opacity: 1;
              }
              100% {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
          `}</style>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <CheckCircle size={32} />,
                title: "Profesionalisme",
                desc: "Tim profesional terlatih dengan sertifikasi internasional",
              },
              {
                icon: <Users size={32} />,
                title: "Kepedulian",
                desc: "Peduli terhadap kesehatan dan kesejahteraan hewan Anda",
              },
              {
                icon: <Award size={32} />,
                title: "Kualitas",
                desc: "Standar kualitas tinggi dalam setiap layanan",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="values-card bg-gray-50 p-8 rounded-lg text-center border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center text-blue-600 mb-4 values-icon">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-20 bg-gray-50" ref={teamRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className={`text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center ${
              isTeamVisible ? "section-title-team" : "opacity-0"
            }`}
          >
            Tim Profesional Kami
          </h2>

          <style>{`
            .section-title-team {
              animation: ${
                isTeamVisible ? "fadeInScale" : "none"
              } 0.8s ease-out;
            }

            .team-card {
              position: relative;
              overflow: hidden;
              height: 320px;
              border-radius: 8px;
              background-size: cover;
              background-position: center;
              display: flex;
              align-items: flex-end;
              cursor: pointer;
              border: 1px solid #e5e7eb;
              animation: ${
                isTeamVisible ? "slideInUp" : "none"
              } 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
              opacity: ${isTeamVisible ? "1" : "0"};
              transition: all 0.3s ease;
            }

            .team-card:nth-child(1) {
              animation-delay: ${isTeamVisible ? "0s" : "0"};
            }

            .team-card:nth-child(2) {
              animation-delay: ${isTeamVisible ? "0.1s" : "0"};
            }

            .team-card:nth-child(3) {
              animation-delay: ${isTeamVisible ? "0.2s" : "0"};
            }

            .team-card::before {
              content: '';
              position: absolute;
              inset: 0;
              background: rgba(0, 0, 0, 0.4);
              z-index: 1;
              transition: background 0.3s ease;
            }

            .team-card:hover {
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            }

            .team-card:hover::before {
              background: rgba(0, 0, 0, 0.5);
            }

            .team-info {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              padding: 24px;
              color: white;
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              z-index: 2;
            }

            .team-info h3 {
              font-size: 1.25rem;
              font-weight: bold;
              margin: 0 0 8px 0;
            }

            .team-info p {
              font-size: 0.95rem;
              margin: 0;
              opacity: 0.95;
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Drh. Budi Santoso",
                role: "Dokter Hewan Umum",
                image: "drhbudisantoso.webp",
                backgroundPosition: "center 10%",
              },
              {
                name: "Drh. Memei",
                role: "Dokter Hewan Spesialis Bedah",
                image: "drhsitinurhaliza.webp",
                backgroundPosition: "center center",
              },
              {
                name: "Drh. Owi",
                role: "Dokter Hewan Spesialis Gigi",
                image: "drhandiwijaya.webp",
                backgroundPosition: "center center",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="team-card"
                style={{
                  backgroundImage: `url('/images/${member.image}')`,
                  backgroundPosition: member.backgroundPosition,
                }}
                onError={(e) => {
                  e.currentTarget.style.backgroundImage =
                    "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)";
                }}
              >
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
