import { useState, useEffect, useRef } from "react";
import { MapPin, Phone, Clock, Mail, Send } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isFaqVisible, setIsFaqVisible] = useState(false);
  const faqRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsFaqVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (faqRef.current) {
      observer.observe(faqRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Format pesan yang lebih rapi untuk WhatsApp
    const whatsappMessage = `
*FORM HUBUNGI KAMI - HEALTHYPET*

👤 *Nama:* ${formData.name}
📧 *Email:* ${formData.email}
📱 *No. Telepon:* ${formData.phone}

💬 *Pesan:*
${formData.message}

---
_Pesan ini dikirim dari website HealthyPet_
    `.trim();

    // URL WhatsApp dengan nomor dan pesan
    const whatsappURL = `https://wa.me/628888397757?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    // Buka WhatsApp
    window.open(whatsappURL, "_blank");

    console.log("Form submitted:", formData);
    setSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 fade-in-down">
            Hubungi Kami
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl fade-in-up">
            Ada pertanyaan? Hubungi kami dan kami akan merespons secepat
            mungkin.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 md:py-20 bg-white">
        <style>{`
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

          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes bounceInScale {
            0% {
              opacity: 0;
              transform: scale(0.8);
            }
            50% {
              opacity: 1;
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          .fade-in-down {
            animation: slideDown 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            opacity: 0;
          }

          .fade-in-up {
            animation: fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards;
            opacity: 0;
          }

          .contact-card {
            animation: bounceInScale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            opacity: 0;
          }

          .contact-card:nth-child(1) {
            animation-delay: 0s;
          }

          .contact-card:nth-child(2) {
            animation-delay: 0.1s;
          }

          .contact-card:nth-child(3) {
            animation-delay: 0.2s;
          }

          .contact-card:nth-child(4) {
            animation-delay: 0.3s;
          }

          .form-section {
            animation: slideInLeft 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards;
            opacity: 0;
          }

          .map-section {
            animation: slideInRight 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s forwards;
            opacity: 0;
          }

          .faq-title {
            animation: slideDown 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            opacity: 0;
          }

          .faq-item {
            animation: fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            opacity: 0;
          }

          .faq-item:nth-child(1) {
            animation-delay: 0.1s;
          }

          .faq-item:nth-child(2) {
            animation-delay: 0.2s;
          }

          .faq-item:nth-child(3) {
            animation-delay: 0.3s;
          }

          .faq-item:nth-child(4) {
            animation-delay: 0.4s;
          }
        `}</style>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Phone */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 text-center contact-card">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Telepon</h3>
              <p className="text-gray-700 font-semibold">+62 888-8397-757</p>
              <p className="text-sm text-gray-600 mt-1">Tersedia 24/7</p>
            </div>

            {/* Email */}
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-6 rounded-lg border border-cyan-200 text-center contact-card">
              <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-700 font-semibold break-all">
                info@healthypet.com
              </p>
              <p className="text-sm text-gray-600 mt-1">Balas dalam 24 jam</p>
            </div>

            {/* Location */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200 text-center contact-card">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Lokasi</h3>
              <p className="text-gray-700 font-semibold">
                Tangerang, Indonesia
              </p>
              <p className="text-sm text-gray-600 mt-1">Pusat Kota</p>
            </div>

            {/* Hours */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200 text-center contact-card">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Jam Operasional
              </h3>
              <p className="text-gray-700 font-semibold">08:00 - 20:00</p>
              <p className="text-sm text-gray-600 mt-1">Setiap hari</p>
            </div>
          </div>

          {/* Contact Form & Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="form-section">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Kirim Pesan
              </h2>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="text-5xl mb-4">✓</div>
                  <h3 className="text-xl font-bold text-green-700 mb-2">
                    Terima Kasih!
                  </h3>
                  <p className="text-green-600">
                    Pesan Anda telah dikirim. Kami akan menghubungi Anda segera.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-gray-700 font-semibold mb-2"
                    >
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Masukkan nama Anda"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-gray-700 font-semibold mb-2"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-gray-700 font-semibold mb-2"
                      >
                        Nomor Telepon
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="+62"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-gray-700 font-semibold mb-2"
                    >
                      Pesan
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                      placeholder="Tulis pesan Anda di sini..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-3 rounded-lg btn-glow btn-glow-blue-static transition-all duration-300 flex items-center justify-center"
                  >
                    <Send size={20} className="mr-2" />
                    Kirim Pesan
                  </button>
                </form>
              )}
            </div>

            {/* Map/Info */}
            <div className="map-section">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Lokasi Kami
              </h2>
              <div className="rounded-lg overflow-hidden h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.3267170811155!2d106.61206489999998!3d-6.220577699999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ff4d31201dab%3A0xa60720451a2b9935!2sKlinik%20Hewan%20Karawaci!5e0!3m2!1sid!2sid!4v1764424178033!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Informasi Tambahan
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3">✓</span>
                    <span>Parkir gratis tersedia untuk pelanggan</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3">✓</span>
                    <span>Akses mudah dari pusat kota</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3">✓</span>
                    <span>Ruang tunggu yang nyaman dan bersih</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3">✓</span>
                    <span>Staf yang ramah dan profesional</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className={`text-3xl font-bold text-gray-900 mb-12 text-center ${
              isFaqVisible ? "faq-title" : "opacity-0"
            }`}
          >
            Pertanyaan Umum
          </h2>

          <div className="space-y-6" ref={faqRef}>
            {[
              {
                q: "Bagaimana cara membuat janji temu?",
                a: "Anda dapat membuat janji temu melalui halaman Booking, menelepon kami, atau mengirim email. Kami akan mengkonfirmasi jadwal Anda dalam waktu 24 jam.",
              },
              {
                q: "Apakah Anda melayani keadaan darurat?",
                a: "Ya, kami melayani keadaan darurat 24/7. Silakan hubungi nomor telepon kami segera jika hewan Anda membutuhkan perawatan darurat.",
              },
              {
                q: "Berapa biaya layanan dasar?",
                a: "Biaya layanan bervariasi tergantung jenis layanan dan kondisi hewan. Hubungi kami untuk informasi harga spesifik.",
              },
              {
                q: "Apakah saya perlu membawa kartu vaksinasi hewan?",
                a: "Ya, disarankan untuk membawa riwayat medis dan kartu vaksinasi hewan Anda untuk membantu kami memberikan perawatan terbaik.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className={`bg-white p-6 rounded-lg border border-gray-200 ${
                  isFaqVisible ? "faq-item" : "opacity-0"
                }`}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {faq.q}
                </h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
