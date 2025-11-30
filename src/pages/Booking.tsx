import { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle,
  Zap,
  CheckSquare,
  HeadsetIcon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";
import { createBooking } from "../services/bookingService";

export default function Booking() {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    petName: "",
    petType: "",
    ownerName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    service: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [testMode, setTestMode] = useState(false); // Toggle untuk test dengan 1 menit

  // Check if user is logged in
  if (!user) {
    return (
      <div className="pt-16 pb-12">
        <section className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Booking Layanan
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl">
              Jadwalkan kunjungan hewan Anda ke klinik kami dengan mudah melalui
              form di bawah ini.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Silakan Login Terlebih Dahulu
              </h2>
              <p className="text-gray-600 mb-8">
                Anda harus login atau register untuk dapat melakukan booking
                layanan kami.
              </p>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
              >
                Login / Register
              </button>
            </div>
          </div>
        </section>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      alert("Anda harus login terlebih dahulu");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // Get selected service duration
      const selectedService = services.find((s) => s.name === formData.service);
      let serviceDuration = selectedService?.duration || 30;

      // TEST MODE: Gunakan 1 menit untuk testing
      if (testMode) {
        serviceDuration = 1;
        console.log("🧪 TEST MODE: Duration set to 1 minute");
      }

      // Simpan booking ke Firestore
      await createBooking(
        {
          userId: user.uid,
          petName: formData.petName,
          petType: formData.petType,
          ownerName: formData.ownerName,
          email: formData.email,
          phone: formData.phone,
          date: formData.date,
          time: formData.time,
          service: formData.service,
          notes: formData.notes,
          status: "pending",
        },
        serviceDuration
      );

      console.log("✅ Booking berhasil disimpan ke Firestore!");
      setSubmitted(true);
    } catch (err) {
      console.error("❌ Error saving booking:", err);
      setError("Terjadi error saat menyimpan booking. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const petTypes = [
    "Anjing",
    "Kucing",
    "Kelinci",
    "Hamster",
    "Burung",
    "Lainnya",
  ];
  const services = [
    { name: "Vaksinasi", duration: 30 },
    { name: "Pemeriksaan", duration: 45 },
    { name: "Grooming", duration: 60 },
    { name: "Operasi", duration: 120 },
    { name: "Perawatan Gigi", duration: 45 },
    { name: "Konsultasi", duration: 20 },
  ];
  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
  ];

  // Check if time slot is available (not in the past)
  const isTimeSlotAvailable = (slot: string): boolean => {
    const today = new Date().toISOString().split("T")[0];
    const isToday = formData.date === today;

    if (!isToday) return true; // Jika tanggal bukan hari ini, semua jam tersedia

    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const [slotHours, slotMinutes] = slot.split(":").map(Number);

    // Slot hanya tersedia jika >= dari waktu sekarang
    return (
      slotHours > currentHours ||
      (slotHours === currentHours && slotMinutes >= currentMinutes)
    );
  };

  return (
    <div className="pt-16 pb-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Booking Layanan
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl">
            Jadwalkan kunjungan hewan Anda ke klinik kami dengan mudah melalui
            form di bawah ini.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {submitted ? (
            <div className="bg-gradient-to-br from-green-50 to-cyan-50 border-2 border-green-200 rounded-lg p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Booking Berhasil!
              </h2>
              <p className="text-gray-600 mb-2">
                Terima kasih telah melakukan booking di HealthyPet.
              </p>
              <p className="text-gray-600 mb-8">
                Kami akan mengirimkan konfirmasi ke email Anda dalam beberapa
                menit. Jika ada perubahan, hubungi kami di nomor yang tertera.
              </p>

              <div className="bg-white rounded-lg p-6 text-left mb-8 max-w-md mx-auto border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">
                  Ringkasan Booking:
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <strong>Nama Hewan:</strong> {formData.petName} (
                    {formData.petType})
                  </p>
                  <p>
                    <strong>Nama Pemilik:</strong> {formData.ownerName}
                  </p>
                  <p>
                    <strong>Layanan:</strong> {formData.service}
                  </p>
                  <p>
                    <strong>Tanggal:</strong> {formData.date}
                  </p>
                  <p>
                    <strong>Waktu:</strong> {formData.time}
                  </p>
                  <p>
                    <strong>Email:</strong> {formData.email}
                  </p>
                  <p>
                    <strong>Telepon:</strong> {formData.phone}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setStep(1);
                  setSubmitted(false);
                  setFormData({
                    petName: "",
                    petType: "",
                    ownerName: "",
                    email: "",
                    phone: "",
                    date: "",
                    time: "",
                    service: "",
                    notes: "",
                  });
                }}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
              >
                Buat Booking Baru
              </button>
            </div>
          ) : (
            <>
              {/* Progress Steps */}
              <div className="mb-12">
                <div className="flex items-center justify-center gap-2 md:gap-4 mb-8 overflow-x-auto pb-2">
                  {[1, 2, 3, 4].map((s) => (
                    <div key={s} className="flex items-center flex-shrink-0">
                      <div
                        className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm md:text-lg transition ${
                          step >= s
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {s}
                      </div>
                      {s < 4 && (
                        <div
                          className={`w-6 md:w-16 h-1 mx-1 md:mx-2 transition ${
                            step > s ? "bg-blue-600" : "bg-gray-300"
                          }`}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs md:text-sm">
                  <div className="font-semibold text-gray-600">Data Hewan</div>
                  <div className="font-semibold text-gray-600">
                    Data Pemilik
                  </div>
                  <div className="font-semibold text-gray-600">Jadwal</div>
                  <div className="font-semibold text-gray-600">Konfirmasi</div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* TEST MODE TOGGLE */}
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={testMode}
                      onChange={(e) => setTestMode(e.target.checked)}
                      className="w-5 h-5 accent-yellow-600"
                    />
                    <span className="font-semibold text-yellow-800">
                      🧪 Test Mode (Duration: 1 menit untuk testing)
                    </span>
                  </label>
                  <p className="text-sm text-yellow-700 mt-2 ml-8">
                    Aktifkan ini untuk testing medical records. Booking akan
                    selesai dalam 1 menit.
                  </p>
                </div>

                {/* Step 1: Pet Information */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Informasi Hewan Peliharaan
                    </h2>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        <User size={18} className="inline mr-2" />
                        Nama Hewan Peliharaan
                      </label>
                      <input
                        type="text"
                        name="petName"
                        value={formData.petName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Contoh: Fluffy, Max, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Jenis Hewan
                      </label>
                      <select
                        name="petType"
                        value={formData.petType}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="">-- Pilih Jenis Hewan --</option>
                        {petTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Layanan Diperlukan
                      </label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="">-- Pilih Layanan --</option>
                        {services.map((service) => (
                          <option key={service.name} value={service.name}>
                            {service.name} ({service.duration} menit)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        <MessageSquare size={18} className="inline mr-2" />
                        Catatan Tambahan
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none text-sm md:text-base"
                        placeholder="Jelaskan kondisi atau keluhan hewan Anda..."
                      ></textarea>
                    </div>
                  </div>
                )}

                {/* Step 2: Owner Information */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Informasi Pemilik
                    </h2>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        <User size={18} className="inline mr-2" />
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm md:text-base"
                        placeholder="Masukkan nama lengkap Anda"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        <Mail size={18} className="inline mr-2" />
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm md:text-base"
                        placeholder="email@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        <Phone size={18} className="inline mr-2" />
                        Nomor Telepon
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm md:text-base"
                        placeholder="+62 8XX-XXXX-XXXX"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Schedule */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Pilih Jadwal
                    </h2>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        <Calendar size={18} className="inline mr-2" />
                        Tanggal Kunjungan
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm md:text-base"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Minimum besok, maksimal 30 hari ke depan
                      </p>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        <Clock size={18} className="inline mr-2" />
                        Waktu Kunjungan
                      </label>
                      <select
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm md:text-base"
                      >
                        <option value="">-- Pilih Waktu --</option>
                        {timeSlots.map((slot) => {
                          const available = isTimeSlotAvailable(slot);
                          return (
                            <option
                              key={slot}
                              value={slot}
                              disabled={!available}
                            >
                              {slot} WIB
                              {!available ? " (Sudah lewat)" : ""}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 4: Confirmation */}
                {step === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Konfirmasi Booking
                    </h2>

                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 space-y-4">
                      <h3 className="font-bold text-gray-900">
                        Ringkasan Data Anda:
                      </h3>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Nama Hewan</p>
                          <p className="font-semibold text-gray-900">
                            {formData.petName}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Jenis Hewan</p>
                          <p className="font-semibold text-gray-900">
                            {formData.petType}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Layanan</p>
                          <p className="font-semibold text-gray-900">
                            {formData.service}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Nama Pemilik</p>
                          <p className="font-semibold text-gray-900">
                            {formData.ownerName}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Tanggal</p>
                          <p className="font-semibold text-gray-900">
                            {formData.date}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Waktu</p>
                          <p className="font-semibold text-gray-900">
                            {formData.time} WIB
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Email</p>
                          <p className="font-semibold text-gray-900">
                            {formData.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Telepon</p>
                          <p className="font-semibold text-gray-900">
                            {formData.phone}
                          </p>
                        </div>
                      </div>

                      {formData.notes && (
                        <div>
                          <p className="text-gray-600">Catatan</p>
                          <p className="font-semibold text-gray-900">
                            {formData.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-700 text-sm">
                        ✓ Anda akan menerima konfirmasi via email dan SMS
                      </p>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-700 text-sm font-semibold">
                      ❌ {error}
                    </p>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-8">
                  <button
                    type="button"
                    onClick={() => setStep(Math.max(1, step - 1))}
                    disabled={step === 1 || loading}
                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sebelumnya
                  </button>

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          step === 1 &&
                          (!formData.petName ||
                            !formData.petType ||
                            !formData.service)
                        ) {
                          alert("Mohon lengkapi semua field");
                          return;
                        }
                        if (
                          step === 2 &&
                          (!formData.ownerName ||
                            !formData.email ||
                            !formData.phone)
                        ) {
                          alert("Mohon lengkapi semua field");
                          return;
                        }
                        if (step === 3 && (!formData.date || !formData.time)) {
                          alert("Mohon pilih tanggal dan waktu");
                          return;
                        }
                        setStep(step + 1);
                      }}
                      disabled={loading}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Lanjutkan
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Memproses...
                        </>
                      ) : (
                        "Konfirmasi Booking"
                      )}
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <Zap size={24} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Cepat & Mudah</h3>
              <p className="text-gray-600 text-sm">
                Booking hanya membutuhkan waktu kurang dari 5 menit
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                <CheckSquare size={24} className="text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">
                Konfirmasi Instan
              </h3>
              <p className="text-gray-600 text-sm">
                Dapatkan konfirmasi langsung setelah booking
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                <HeadsetIcon size={24} className="text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Dukungan 24/7</h3>
              <p className="text-gray-600 text-sm">
                Tim kami siap membantu jika ada pertanyaan
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
