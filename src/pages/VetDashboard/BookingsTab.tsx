import { useState, useEffect } from "react";
import {
  ClipboardList,
  Check,
  User,
  Phone,
  Calendar,
  Clock,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import {
  getPendingBookings,
  findMedicalRecordByBooking,
  updateMedicalRecord,
  completeBooking,
  type VetBooking,
} from "../../services/vetService";

interface MedicalData {
  diagnosis: string;
  treatment: string;
  prescription: string;
  vetName: string;
}

interface BookingsTabProps {
  vetName?: string;
  onError: (msg: string) => void;
}

export function BookingsTab({ vetName = "", onError }: BookingsTabProps) {
  const { isDarkMode } = useTheme();
  const [bookings, setBookings] = useState<VetBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<VetBooking | null>(
    null
  );
  const [medicalRecordId, setMedicalRecordId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<MedicalData>({
    diagnosis: "",
    treatment: "",
    prescription: "",
    vetName: vetName,
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getPendingBookings();
      setBookings(data);
      console.log("✅ Fetched pending bookings:", data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      onError("Gagal memuat booking. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBooking = async (booking: VetBooking) => {
    try {
      setSelectedBooking(booking);
      setFormData({
        diagnosis: "",
        treatment: "",
        prescription: "",
        vetName: vetName,
      });

      const medicalRecord = await findMedicalRecordByBooking(
        booking.userId,
        booking.petName,
        booking.date,
        booking.time
      );

      if (medicalRecord) {
        setMedicalRecordId(medicalRecord.id);
        setFormData({
          diagnosis: medicalRecord.diagnosis || "",
          treatment: medicalRecord.treatment || "",
          prescription: medicalRecord.prescription || "",
          vetName: medicalRecord.vetName || vetName,
        });
      }
    } catch (err) {
      console.error("Error selecting booking:", err);
      onError("Gagal memuat medical record");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!medicalRecordId) {
      onError("Medical record tidak ditemukan");
      return;
    }

    if (!formData.diagnosis || !formData.treatment || !formData.vetName) {
      onError("Mohon isi semua field (Diagnosis, Treatment, Nama Dokter)");
      return;
    }

    try {
      setSubmitting(true);
      await updateMedicalRecord(medicalRecordId, formData);

      if (selectedBooking) {
        await completeBooking(selectedBooking.id);
      }

      setSelectedBooking(null);
      setFormData({
        diagnosis: "",
        treatment: "",
        prescription: "",
        vetName: vetName,
      });
      setMedicalRecordId(null);

      await fetchBookings();
    } catch (err) {
      console.error("Error submitting:", err);
      onError("Gagal menyimpan data. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Bookings List */}
      <div className="lg:col-span-1">
        <div
          className={`rounded-lg shadow-md p-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList size={24} className="text-blue-600" />
            <h2
              className={`text-xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Booking Pending
            </h2>
          </div>

          {loading && (
            <p
              className={`text-center py-8 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Memuat data...
            </p>
          )}

          {!loading && bookings.length === 0 && (
            <p
              className={`text-center py-8 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Tidak ada booking pending
            </p>
          )}

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {bookings.map((booking) => (
              <button
                key={booking.id}
                onClick={() => handleSelectBooking(booking)}
                className={`w-full text-left p-4 rounded-lg border-2 transition ${
                  selectedBooking?.id === booking.id
                    ? isDarkMode
                      ? "bg-blue-900 border-blue-500"
                      : "bg-blue-50 border-blue-600"
                    : isDarkMode
                    ? "bg-gray-700 border-gray-600 hover:border-blue-400"
                    : "bg-gray-50 border-gray-200 hover:border-blue-400"
                }`}
              >
                <p
                  className={`font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {booking.petName}
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {booking.ownerName}
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  {booking.date} {booking.time}
                </p>
                <p className="text-xs text-blue-600 font-semibold">
                  {booking.service}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Detail & Form */}
      <div className="lg:col-span-2">
        {!selectedBooking ? (
          <div
            className={`rounded-lg shadow-md p-12 text-center ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <ClipboardList
              size={48}
              className={`mx-auto mb-4 ${
                isDarkMode ? "text-gray-600" : "text-gray-300"
              }`}
            />
            <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
              Pilih booking untuk mengisi medical record
            </p>
          </div>
        ) : (
          <div
            className={`rounded-lg shadow-md p-6 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            {/* Booking Details */}
            <div
              className={`mb-8 pb-8 border-b ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <h3
                className={`text-xl font-bold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Detail Booking
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Nama Hewan
                  </p>
                  <p
                    className={`font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedBooking.petName}
                  </p>
                  <p
                    className={`text-xs ${
                      isDarkMode ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    {selectedBooking.petType}
                  </p>
                </div>

                <div>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Layanan
                  </p>
                  <p
                    className={`font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedBooking.service}
                  </p>
                  <p
                    className={`text-xs ${
                      isDarkMode ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    {selectedBooking.duration} menit
                  </p>
                </div>

                <div>
                  <p
                    className={`text-sm flex items-center gap-1 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <User size={14} /> Pemilik
                  </p>
                  <p
                    className={`font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedBooking.ownerName}
                  </p>
                </div>

                <div>
                  <p
                    className={`text-sm flex items-center gap-1 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <Phone size={14} /> Kontak
                  </p>
                  <p
                    className={`font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedBooking.phone}
                  </p>
                </div>

                <div className="col-span-2">
                  <p
                    className={`text-sm flex items-center gap-1 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <Calendar size={14} /> Jadwal
                  </p>
                  <p
                    className={`font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedBooking.date}{" "}
                    <Clock size={14} className="inline" />{" "}
                    {selectedBooking.time} WIB
                  </p>
                </div>

                {selectedBooking.notes && (
                  <div className="col-span-2">
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Catatan Pasien
                    </p>
                    <p
                      className={isDarkMode ? "text-gray-300" : "text-gray-900"}
                    >
                      {selectedBooking.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Medical Record Form */}
            <form onSubmit={handleSubmit}>
              <h3
                className={`text-xl font-bold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Isi Medical Record
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Nama Dokter Hewan *
                  </label>
                  <input
                    type="text"
                    value={formData.vetName}
                    onChange={(e) =>
                      setFormData({ ...formData, vetName: e.target.value })
                    }
                    required
                    className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                      isDarkMode
                        ? "bg-gray-700 border border-gray-600 text-white"
                        : "border border-gray-300 text-gray-900"
                    }`}
                    placeholder="Dr. Budiman Santoso"
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Diagnosa *
                  </label>
                  <textarea
                    value={formData.diagnosis}
                    onChange={(e) =>
                      setFormData({ ...formData, diagnosis: e.target.value })
                    }
                    required
                    rows={3}
                    className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none ${
                      isDarkMode
                        ? "bg-gray-700 border border-gray-600 text-white"
                        : "border border-gray-300 text-gray-900"
                    }`}
                    placeholder="Jelaskan diagnosa pasien..."
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Treatment/Penanganan *
                  </label>
                  <textarea
                    value={formData.treatment}
                    onChange={(e) =>
                      setFormData({ ...formData, treatment: e.target.value })
                    }
                    required
                    rows={3}
                    className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none ${
                      isDarkMode
                        ? "bg-gray-700 border border-gray-600 text-white"
                        : "border border-gray-300 text-gray-900"
                    }`}
                    placeholder="Jelaskan treatment yang diberikan..."
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Resep/Obat
                  </label>
                  <textarea
                    value={formData.prescription}
                    onChange={(e) =>
                      setFormData({ ...formData, prescription: e.target.value })
                    }
                    rows={2}
                    className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none ${
                      isDarkMode
                        ? "bg-gray-700 border border-gray-600 text-white"
                        : "border border-gray-300 text-gray-900"
                    }`}
                    placeholder="Resep/obat yang diberikan (opsional)"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                  }`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  {submitting ? "Menyimpan..." : "Simpan & Selesaikan"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
