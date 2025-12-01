import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, Briefcase, Building } from "lucide-react";
import { useVet } from "../context/VetContext";

export default function VetLogin() {
  const navigate = useNavigate();
  const { login, register, error, loading } = useVet();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    specialization: "",
    clinic: "",
  });
  const [localError, setLocalError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!formData.email || !formData.password) {
      setLocalError("Email dan password harus diisi");
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate("/vet-dashboard");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (
      !formData.email ||
      !formData.password ||
      !formData.name ||
      !formData.phone ||
      !formData.specialization ||
      !formData.clinic
    ) {
      setLocalError("Mohon isi semua field");
      return;
    }

    if (formData.password.length < 6) {
      setLocalError("Password minimal 6 karakter");
      return;
    }

    try {
      await register(formData.email, formData.password, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        specialization: formData.specialization,
        clinic: formData.clinic,
      });
      navigate("/vet-dashboard");
    } catch (err) {
      console.error("Register failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-cyan-500 relative overflow-x-hidden">
      {/* Animated Background Elements - Fixed */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Floating Bubble 1 */}
        <div className="absolute w-80 h-80 md:w-96 md:h-96 bg-blue-400 rounded-full blur-3xl opacity-10 -top-20 -left-20 animate-float"></div>
        {/* Floating Bubble 2 */}
        <div className="absolute w-72 h-72 md:w-80 md:h-80 bg-cyan-300 rounded-full blur-3xl opacity-10 top-1/3 -right-10 animate-pulse"></div>
        {/* Floating Bubble 3 */}
        <div
          className="absolute w-64 h-64 md:w-72 md:h-72 bg-blue-300 rounded-full blur-3xl opacity-10 bottom-20 left-1/4 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        {/* Floating Bubble 4 */}
        <div
          className="absolute w-56 h-56 md:w-64 md:h-64 bg-cyan-400 rounded-full blur-3xl opacity-10 bottom-1/3 right-1/4 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Logo Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-blue-100 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <img
            src="/images/veterinary.png"
            alt="DokterHewan Logo"
            className="h-12 w-12 object-cover rounded-md"
            onError={(e) => {
              e.currentTarget.src =
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23e0f2fe" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" font-size="28" fill="%230369a1" font-weight="bold"%3E🐾%3C/text%3E%3C/svg%3E';
            }}
          />
          <h2 className="text-xl font-bold text-gray-900">HealhtyPet</h2>
        </div>
      </div>

      {/* Form Container - Scrollable */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
            {/* Header */}
            <div className="text-center mb-8">
              <img
                src="/images/veterinary.png"
                alt="DokterHewan Logo"
                className="h-20 w-20 object-cover rounded-lg mx-auto mb-4"
                onError={(e) => {
                  e.currentTarget.src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23e0f2fe" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" font-size="28" fill="%230369a1" font-weight="bold"%3E🐾%3C/text%3E%3C/svg%3E';
                }}
              />
              <h1 className="text-3xl font-bold text-gray-900">HealthyPet</h1>
              <p className="text-gray-600 mt-2">Portal Dokter Hewan</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => {
                  setIsLogin(true);
                  setLocalError("");
                  setFormData({
                    email: "",
                    password: "",
                    name: "",
                    phone: "",
                    specialization: "",
                    clinic: "",
                  });
                }}
                className={`flex-1 py-2 font-semibold rounded-lg transition ${
                  isLogin
                    ? "bg-blue-600 text-white btn-glow btn-glow-blue transition-all duration-300"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  setLocalError("");
                  setFormData({
                    email: "",
                    password: "",
                    name: "",
                    phone: "",
                    specialization: "",
                    clinic: "",
                  });
                }}
                className={`flex-1 py-2 font-semibold rounded-lg transition ${
                  !isLogin
                    ? "bg-blue-600 text-white btn-glow btn-glow-blue transition-all duration-300"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Daftar
              </button>
            </div>

            {/* Error Message */}
            {(error || localError) && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                {error || localError}
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={isLogin ? handleLogin : handleRegister}
              className="space-y-4"
            >
              {/* Email */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <Mail size={18} /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="dokter@email.com"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <Lock size={18} /> Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="••••••"
                />
              </div>

              {/* Register Fields */}
              {!isLogin && (
                <>
                  {/* Name */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                      <User size={18} /> Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Dr. Budiman Santoso"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                      <Phone size={18} /> No. Telepon
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="+62 8XX-XXXX-XXXX"
                    />
                  </div>

                  {/* Specialization */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                      <Briefcase size={18} /> Spesialisasi
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Bedah, Gigi, Umum, dll"
                    />
                  </div>

                  {/* Clinic */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                      <Building size={18} /> Klinik/Rumah Sakit
                    </label>
                    <input
                      type="text"
                      name="clinic"
                      value={formData.clinic}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Nama Klinik Hewan"
                    />
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg btn-glow btn-glow-blue transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Memproses..." : isLogin ? "Login" : "Daftar"}
              </button>
            </form>

            {/* Info */}
            <p className="text-center text-gray-600 text-sm mt-6">
              Portal khusus untuk dokter hewan HealthyPet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
