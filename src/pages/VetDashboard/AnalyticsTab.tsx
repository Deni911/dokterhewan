import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Activity } from "lucide-react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";
import {
  getAnalyticsData,
  type AnalyticsData,
} from "../../services/analyticsService";

interface AnalyticsTabProps {
  onError?: (msg: string) => void;
}

export function AnalyticsTab({ onError }: AnalyticsTabProps) {
  const { isDarkMode } = useTheme();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getAnalyticsData();
      setAnalytics(data);
      console.log("✅ Fetched analytics data:", data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      if (onError) onError("Gagal memuat analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
          Memuat data analytics...
        </p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
          Gagal memuat data analytics
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className={`rounded-lg shadow-md p-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className={`text-sm mb-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Total Booking
              </p>
              <p
                className={`text-4xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {analytics.totalCompletedBookings}
              </p>
              <p
                className={`text-xs mt-2 ${
                  isDarkMode ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Booking yang sudah selesai
              </p>
            </div>
            <Activity size={32} className="text-blue-600" />
          </div>
        </div>

        <div
          className={`rounded-lg shadow-md p-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className={`text-sm mb-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Layanan Paling Populer
              </p>
              <p
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {analytics.mostPopularService?.service || "-"}
              </p>
              <p
                className={`text-xs mt-2 ${
                  isDarkMode ? "text-gray-500" : "text-gray-500"
                }`}
              >
                {analytics.mostPopularService?.count || 0} booking (
                {(analytics.mostPopularService?.percentage || 0).toFixed(1)}%)
              </p>
            </div>
            <TrendingUp size={32} className="text-green-600" />
          </div>
        </div>

        <div
          className={`rounded-lg shadow-md p-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className={`text-sm mb-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Hewan yang Paling Sering Datang
              </p>
              <p
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {analytics.mostCommonPetType?.petType || "-"}
              </p>
              <p
                className={`text-xs mt-2 ${
                  isDarkMode ? "text-gray-500" : "text-gray-500"
                }`}
              >
                {analytics.mostCommonPetType?.count || 0} kunjungan (
                {(analytics.mostCommonPetType?.percentage || 0).toFixed(1)}%)
              </p>
            </div>
            <BarChart3 size={32} className="text-cyan-600" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className={`rounded-lg shadow-md p-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3
            className={`text-lg font-bold mb-6 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Breakdown Layanan
          </h3>
          {analytics.serviceBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.serviceBreakdown as any}
                  dataKey="count"
                  nameKey="service"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={isDarkMode ? { fill: "#f3f4f6" } : undefined}
                >
                  {analytics.serviceBreakdown.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        [
                          "#3b82f6",
                          "#06b6d4",
                          "#8b5cf6",
                          "#ec4899",
                          "#f59e0b",
                          "#10b981",
                        ][index % 6]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={
                    isDarkMode
                      ? {
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "0.5rem",
                          color: "#f3f4f6",
                        }
                      : {}
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p
              className={`text-center py-8 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Belum ada data
            </p>
          )}
        </div>

        <div
          className={`rounded-lg shadow-md p-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3
            className={`text-lg font-bold mb-6 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Breakdown Jenis Hewan
          </h3>
          {analytics.petTypeBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.petTypeBreakdown as any}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDarkMode ? "#374151" : "#e5e7eb"}
                />
                <XAxis
                  dataKey="petType"
                  tick={{ fill: isDarkMode ? "#9ca3af" : "#000" }}
                />
                <YAxis tick={{ fill: isDarkMode ? "#9ca3af" : "#000" }} />
                <Tooltip
                  contentStyle={
                    isDarkMode
                      ? {
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "0.5rem",
                          color: "#f3f4f6",
                        }
                      : {}
                  }
                />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p
              className={`text-center py-8 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Belum ada data
            </p>
          )}
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className={`rounded-lg shadow-md p-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3
            className={`text-lg font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Detail Layanan
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className={`border-b ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <th
                    className={`text-left py-2 px-3 font-semibold ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Layanan
                  </th>
                  <th
                    className={`text-right py-2 px-3 font-semibold ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Total
                  </th>
                  <th
                    className={`text-right py-2 px-3 font-semibold ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    %
                  </th>
                </tr>
              </thead>
              <tbody>
                {analytics.serviceBreakdown.map((service, idx) => (
                  <tr
                    key={idx}
                    className={`border-b transition ${
                      isDarkMode
                        ? "border-gray-700 hover:bg-gray-700"
                        : "border-gray-100 hover:bg-gray-50"
                    }`}
                  >
                    <td
                      className={`py-2 px-3 ${
                        isDarkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {service.service}
                    </td>
                    <td
                      className={`text-right py-2 px-3 font-bold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {service.count}
                    </td>
                    <td
                      className={`text-right py-2 px-3 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {service.percentage.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div
          className={`rounded-lg shadow-md p-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3
            className={`text-lg font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Detail Jenis Hewan
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className={`border-b ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <th
                    className={`text-left py-2 px-3 font-semibold ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Jenis Hewan
                  </th>
                  <th
                    className={`text-right py-2 px-3 font-semibold ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Total
                  </th>
                  <th
                    className={`text-right py-2 px-3 font-semibold ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    %
                  </th>
                </tr>
              </thead>
              <tbody>
                {analytics.petTypeBreakdown.map((petType, idx) => (
                  <tr
                    key={idx}
                    className={`border-b transition ${
                      isDarkMode
                        ? "border-gray-700 hover:bg-gray-700"
                        : "border-gray-100 hover:bg-gray-50"
                    }`}
                  >
                    <td
                      className={`py-2 px-3 ${
                        isDarkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {petType.petType}
                    </td>
                    <td
                      className={`text-right py-2 px-3 font-bold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {petType.count}
                    </td>
                    <td
                      className={`text-right py-2 px-3 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {petType.percentage.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
