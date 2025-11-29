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
import {
  getAnalyticsData,
  type AnalyticsData,
} from "../../services/analyticsService";

interface AnalyticsTabProps {
  onError?: (msg: string) => void;
}

export function AnalyticsTab({ onError }: AnalyticsTabProps) {
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
        <p className="text-gray-600">Memuat data analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Gagal memuat data analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Booking</p>
              <p className="text-4xl font-bold text-gray-900">
                {analytics.totalCompletedBookings}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Booking yang sudah selesai
              </p>
            </div>
            <Activity size={32} className="text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                Layanan Paling Populer
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.mostPopularService?.service || "-"}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {analytics.mostPopularService?.count || 0} booking (
                {(analytics.mostPopularService?.percentage || 0).toFixed(1)}%)
              </p>
            </div>
            <TrendingUp size={32} className="text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                Hewan yang Paling Sering Datang
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.mostCommonPetType?.petType || "-"}
              </p>
              <p className="text-xs text-gray-500 mt-2">
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
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
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
                  label
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
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">Belum ada data</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Breakdown Jenis Hewan
          </h3>
          {analytics.petTypeBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.petTypeBreakdown as any}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="petType" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">Belum ada data</p>
          )}
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Detail Layanan
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">
                    Layanan
                  </th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-700">
                    Total
                  </th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-700">
                    %
                  </th>
                </tr>
              </thead>
              <tbody>
                {analytics.serviceBreakdown.map((service, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-2 px-3 text-gray-900">
                      {service.service}
                    </td>
                    <td className="text-right py-2 px-3 font-bold text-gray-900">
                      {service.count}
                    </td>
                    <td className="text-right py-2 px-3 text-gray-600">
                      {service.percentage.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Detail Jenis Hewan
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">
                    Jenis Hewan
                  </th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-700">
                    Total
                  </th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-700">
                    %
                  </th>
                </tr>
              </thead>
              <tbody>
                {analytics.petTypeBreakdown.map((petType, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-2 px-3 text-gray-900">
                      {petType.petType}
                    </td>
                    <td className="text-right py-2 px-3 font-bold text-gray-900">
                      {petType.count}
                    </td>
                    <td className="text-right py-2 px-3 text-gray-600">
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
