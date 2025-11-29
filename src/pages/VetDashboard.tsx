import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stethoscope,
  LogOut,
  AlertCircle,
  ClipboardList,
  BarChart3,
} from "lucide-react";
import { useVet } from "../context/VetContext";
import { BookingsTab } from "./VetDashboard/BookingsTab";
import { AnalyticsTab } from "./VetDashboard/AnalyticsTab";

export default function VetDashboard() {
  const navigate = useNavigate();
  const { vet, user, logout, loading: authLoading } = useVet();
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"bookings" | "analytics">(
    "bookings"
  );

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/vet-login");
    }
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/vet-login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  if (authLoading) {
    return (
      <div className="pt-20 pb-12 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-20 pb-12 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Stethoscope size={32} className="text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Dashboard Dokter Hewan
                </h1>
                <p className="text-sm text-gray-600">
                  Selamat datang, {vet?.name}
                </p>
              </div>
            </div>
            <p className="text-gray-600">
              Kelola booking dan lihat statistik layanan
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex gap-4 border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab("bookings");
              setError("");
            }}
            className={`px-6 py-3 font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === "bookings"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <ClipboardList size={20} /> Manage Booking
          </button>
          <button
            onClick={() => {
              setActiveTab("analytics");
              setError("");
            }}
            className={`px-6 py-3 font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === "analytics"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <BarChart3 size={20} /> Analytics
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle size={20} className="text-red-600" />
              <p className="text-red-700 font-semibold">{error}</p>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === "bookings" && (
          <BookingsTab vetName={vet?.name} onError={setError} />
        )}
        {activeTab === "analytics" && <AnalyticsTab onError={setError} />}
      </div>
    </div>
  );
}
