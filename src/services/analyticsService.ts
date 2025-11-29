import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

export interface ServiceStats {
  service: string;
  count: number;
  percentage: number;
}

export interface PetTypeStats {
  petType: string;
  count: number;
  percentage: number;
}

export interface AnalyticsData {
  totalBookings: number;
  totalCompletedBookings: number;
  mostPopularService: ServiceStats | null;
  mostCommonPetType: PetTypeStats | null;
  serviceBreakdown: ServiceStats[];
  petTypeBreakdown: PetTypeStats[];
}

/**
 * Get analytics data for dashboard
 * Includes service popularity and pet type statistics
 */
export const getAnalyticsData = async (): Promise<AnalyticsData> => {
  try {
    // Fetch all completed bookings
    const bookingsQuery = query(
      collection(db, "bookings"),
      where("status", "==", "completed")
    );
    const bookingsSnapshot = await getDocs(bookingsQuery);
    const bookings = bookingsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];

    const totalBookings = bookings.length;

    // Count services
    const serviceCount: Record<string, number> = {};
    bookings.forEach((booking) => {
      const service = booking.service || "Unknown";
      serviceCount[service] = (serviceCount[service] || 0) + 1;
    });

    // Count pet types
    const petTypeCount: Record<string, number> = {};
    bookings.forEach((booking) => {
      const petType = booking.petType || "Unknown";
      petTypeCount[petType] = (petTypeCount[petType] || 0) + 1;
    });

    // Convert to arrays and calculate percentages
    const serviceBreakdown: ServiceStats[] = Object.entries(serviceCount)
      .map(([service, count]) => ({
        service,
        count,
        percentage: totalBookings > 0 ? (count / totalBookings) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    const petTypeBreakdown: PetTypeStats[] = Object.entries(petTypeCount)
      .map(([petType, count]) => ({
        petType,
        count,
        percentage: totalBookings > 0 ? (count / totalBookings) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    const mostPopularService =
      serviceBreakdown.length > 0 ? serviceBreakdown[0] : null;
    const mostCommonPetType =
      petTypeBreakdown.length > 0 ? petTypeBreakdown[0] : null;

    return {
      totalBookings,
      totalCompletedBookings: totalBookings,
      mostPopularService,
      mostCommonPetType,
      serviceBreakdown,
      petTypeBreakdown,
    };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw error;
  }
};
