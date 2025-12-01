import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    // Google OAuth login diperlukan untuk production setup Firebase
    // Untuk sekarang, gunakan email/password authentication
    setError("Google login belum dikonfigurasi. Gunakan email/password.");
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      // Login mode
      if (!email || !password) {
        setError("Email dan password harus diisi");
        return;
      }

      const result = await login(email, password);
      if (!result.success) {
        setError(result.message);
        return;
      }

      setEmail("");
      setPassword("");
      setName("");
      onClose();
    } else {
      // Register mode
      if (!email || !password || !name) {
        setError("Semua field harus diisi");
        return;
      }

      const result = await register(email, password, name);
      if (!result.success) {
        setError(result.message);
        return;
      }

      // Auto-switch to login after successful register
      setError(result.message); // Show success message
      setIsLogin(true);
      setEmail("");
      setPassword("");
      setName("");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 min-h-screen">
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-y-auto my-auto"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="sticky top-0 flex justify-between items-center p-6 border-b border-gray-200 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? "Login" : "Register"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 pb-10">
          {/* Error Message */}
          {error && (
            <div
              className={`p-3 rounded-lg text-sm font-medium ${
                error.includes("berhasil")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {error}
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-300 font-medium text-gray-700"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0112 4.25c1.54 0 3.01.293 4.555.957l3.289-3.289A11.36 11.36 0 0012 0C5.441 0 .559 4.881.559 11.44c0 1.49.213 2.944.559 4.33l4.707-5.005z"
              />
              <path
                fill="#34A853"
                d="M16.04 9.594c-.178-.603-.646-1.13-1.147-1.585.467-.377.948-.722 1.47-.922a6.846 6.846 0 012.563 4.164l-4.777-.657z"
              />
              <path
                fill="#4285F4"
                d="M23.48 11.99c0 .775-.07 1.456-.184 2.11H12v-4.141h6.508c-.639-1.591-2.323-2.495-4.065-2.495a6.977 6.977 0 00-5.203 2.27l-4.707-5.005A11.368 11.368 0 0112 0a11.36 11.36 0 018.48 4.047z"
              />
              <path
                fill="#FBBC04"
                d="M5.266 9.765A7.077 7.077 0 0112 4.25v8.882H5.559c0-.83.116-1.632.31-2.377z"
              />
            </svg>
            {isLogin ? "Login dengan Google" : "Register dengan Google"}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Atau</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg btn-glow btn-glow-blue transition-all duration-300 font-semibold"
            >
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="text-center text-sm text-gray-600">
            {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 text-blue-600 hover:text-blue-700 font-semibold"
            >
              {isLogin ? "Register di sini" : "Login di sini"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
