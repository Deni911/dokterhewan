import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stethoscope,
  LogOut,
  AlertCircle,
  ClipboardList,
  BarChart3,
  Moon,
  Sun,
} from "lucide-react";
import { useVet } from "../context/VetContext";
import { useTheme } from "../context/ThemeContext";
import { BookingsTab } from "./VetDashboard/BookingsTab";
import { AnalyticsTab } from "./VetDashboard/AnalyticsTab";

export default function VetDashboard() {
  const navigate = useNavigate();
  const { vet, user, logout, loading: authLoading } = useVet();
  const { isDarkMode, toggleDarkMode } = useTheme();
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
      <div
        className={`pt-20 pb-12 min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            Memverifikasi akses...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className={`pt-20 pb-12 min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
          Redirecting...
        </p>
      </div>
    );
  }

  return (
    <div
      className={`pt-20 pb-12 min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Stethoscope size={32} className="text-blue-600" />
              <div>
                <h1
                  className={`text-3xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Dashboard Dokter Hewan
                </h1>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Selamat datang, {vet?.name}
                </p>
              </div>
            </div>
            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              Kelola booking dan lihat statistik layanan
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => toggleDarkMode(e)}
              className={`p-2 rounded-lg transition relative ${
                isDarkMode
                  ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
              title={
                isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          className={`mb-6 flex gap-4 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <button
            onClick={() => {
              setActiveTab("bookings");
              setError("");
            }}
            className={`px-6 py-3 font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === "bookings"
                ? "border-blue-600 text-blue-600"
                : isDarkMode
                ? "border-transparent text-gray-400 hover:text-gray-300"
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
                : isDarkMode
                ? "border-transparent text-gray-400 hover:text-gray-300"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <BarChart3 size={20} /> Analytics
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className={`border rounded-lg p-4 mb-6 ${
              isDarkMode
                ? "bg-red-900 border-red-700"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertCircle size={20} className="text-red-600" />
              <p
                className={`font-semibold ${
                  isDarkMode ? "text-red-300" : "text-red-700"
                }`}
              >
                {error}
              </p>
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
