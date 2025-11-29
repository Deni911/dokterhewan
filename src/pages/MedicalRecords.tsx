import { useState, useEffect } from "react";
import { Heart, Stethoscope } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";
import {
  getUserMedicalRecords,
  type MedicalRecord,
} from "../services/medicalRecordService";

export default function MedicalRecords() {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPet, setSelectedPet] = useState<string>("semua");

  useEffect(() => {
    if (user) {
      fetchCompletedRecords();
      // Setup polling setiap 5 detik untuk testing (ganti 5000 dengan 60000 untuk production)
      const interval = setInterval(() => {
        fetchCompletedRecords();
      }, 5000); // 5 detik untuk testing
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchCompletedRecords = async () => {
    try {
      setLoading(true);
      setError("");
      if (!user) return;

      // TESTING: Tampilkan semua medical records (tidak hanya yang completed)
      // Untuk production, ganti ke getCompletedMedicalRecords(user.uid)
      const data = await getUserMedicalRecords(user.uid);
      console.log("📋 Fetched all records (TESTING):", data);
      setRecords(data);
    } catch (err) {
      console.error("Error fetching medical records:", err);
      setError("Gagal memuat riwayat medical. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Check if user is logged in
  if (!user) {
    return (
      <div className="pt-16 pb-12">
        <section className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Riwayat Medical
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl">
              Lihat riwayat kesehatan dan treatment hewan peliharaan Anda.
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
                Anda harus login untuk dapat melihat riwayat medical hewan
                peliharaan Anda.
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

  // Get unique pet names
  const uniquePets = Array.from(new Set(records.map((r) => r.petName)));

  // Filter records
  const filteredRecords =
    selectedPet === "semua"
      ? records
      : records.filter((r) => r.petName === selectedPet);

  return (
    <div className="pt-16 pb-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart size={40} />
            <h1 className="text-4xl md:text-5xl font-bold">Riwayat Medical</h1>
          </div>
          <p className="text-lg text-blue-100 max-w-2xl">
            Pantau kesehatan dan treatment hewan peliharaan Anda secara lengkap.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <p className="text-red-700 font-semibold">{error}</p>
              </div>
            </div>
          )}

          {/* Filter by Pet */}
          {uniquePets.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                Filter Hewan Peliharaan:
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedPet("semua")}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    selectedPet === "semua"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Semua Hewan
                </button>
                {uniquePets.map((petName) => (
                  <button
                    key={petName}
                    onClick={() => setSelectedPet(petName)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      selectedPet === petName
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {petName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Memuat riwayat medical...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredRecords.length === 0 && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Stethoscope size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Belum Ada Riwayat Medical
              </h3>
              <p className="text-gray-600">
                {selectedPet === "semua"
                  ? "Belum ada riwayat medical untuk hewan peliharaan Anda. Riwayat medical akan muncul setelah Anda melakukan kunjungan ke klinik."
                  : `Belum ada riwayat medical untuk ${selectedPet}. Riwayat medical akan muncul setelah kunjungan ke klinik.`}
              </p>
            </div>
          )}

          {/* Medical Records List */}
          {!loading && filteredRecords.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Total {filteredRecords.length} Record Medical
              </h2>

              {filteredRecords.map((record, index) => (
                <div
                  key={record.id || index}
                  className="bg-white border border-gray-200 rounded-lg p-6 mb-4 hover:shadow-md transition"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {record.petName}
                      </h3>
                      <p className="text-blue-600 font-semibold text-sm">
                        {record.service}
                      </p>
                    </div>
                    <span className="inline-block px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold">
                      {record.petType}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 font-semibold">
                          Tanggal Kunjungan
                        </p>
                        <p className="text-gray-900">
                          {new Date(record.visitDate).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-semibold">
                          Waktu Kunjungan
                        </p>
                        <p className="text-gray-900">{record.visitTime}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-semibold">
                          Dokter Hewan
                        </p>
                        <p className="text-gray-900">{record.vetName}</p>
                      </div>
                    </div>

                    {/* Diagnosis */}
                    <div>
                      <p className="text-gray-600 font-semibold">Diagnosa</p>
                      <p className="text-gray-900 bg-gray-50 p-2 rounded">
                        {record.diagnosis}
                      </p>
                    </div>

                    {/* Treatment */}
                    <div>
                      <p className="text-gray-600 font-semibold">Treatment</p>
                      <p className="text-gray-900 bg-gray-50 p-2 rounded">
                        {record.treatment}
                      </p>
                    </div>

                    {/* Prescription */}
                    {record.prescription && (
                      <div>
                        <p className="text-gray-600 font-semibold">Resep</p>
                        <p className="text-gray-900 bg-gray-50 p-2 rounded">
                          {record.prescription}
                        </p>
                      </div>
                    )}

                    {/* Notes */}
                    {record.notes && (
                      <div>
                        <p className="text-gray-600 font-semibold">Catatan</p>
                        <p className="text-gray-900 bg-gray-50 p-2 rounded">
                          {record.notes}
                        </p>
                      </div>
                    )}

                    {/* Created At */}
                    {record.createdAt && (
                      <p className="text-xs text-gray-500 text-right pt-2">
                        Dicatat pada:{" "}
                        {new Date(
                          record.createdAt.toDate?.() || record.createdAt
                        ).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg p-8 border-2 border-blue-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Heart size={32} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Tentang Riwayat Medical
                </h3>
                <p className="text-gray-600 mb-3">
                  Riwayat medical mencatat setiap kunjungan dan treatment yang
                  dilakukan oleh dokter hewan kami. Informasi ini membantu Anda:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Memantau kesehatan hewan peliharaan secara berkala</li>
                  <li>Melihat treatment yang sudah dilakukan sebelumnya</li>
                  <li>Memiliki catatan lengkap untuk referensi medis</li>
                  <li>Membantu dokter hewan memahami riwayat kesehatan pet</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
