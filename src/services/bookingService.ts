import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "../config/firebase";

// Service duration mapping (in minutes)
const SERVICE_DURATION_MAP: Record<string, number> = {
  Vaksinasi: 30,
  Pemeriksaan: 45,
  Grooming: 60,
  Operasi: 120,
  "Perawatan Gigi": 45,
  Konsultasi: 20,
};

export interface Booking {
  userId: string;
  petName: string;
  petType: string;
  ownerName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  service: string;
  duration: number;
  estimatedEndTime: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes: string;
  createdAt?: Timestamp;
}

// Helper function to calculate estimated end time
const calculateEstimatedEndTime = (time: string, duration: number): string => {
  const [hours, minutes] = time.split(":").map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0);

  const endDate = new Date(startDate.getTime() + duration * 60000);
  const endHours = String(endDate.getHours()).padStart(2, "0");
  const endMinutes = String(endDate.getMinutes()).padStart(2, "0");

  return `${endHours}:${endMinutes}`;
};

// Create booking with auto medical record generation
export const createBooking = async (
  booking: Omit<Booking, "duration" | "estimatedEndTime">,
  serviceDuration?: number
) => {
  try {
    // Determine duration from mapping or parameter
    const duration =
      serviceDuration || SERVICE_DURATION_MAP[booking.service] || 30;

    // Calculate estimated end time
    const estimatedEndTime = calculateEstimatedEndTime(booking.time, duration);

    const bookingData: Booking = {
      ...booking,
      duration,
      estimatedEndTime,
    };

    // Save booking
    const docRef = await addDoc(collection(db, "bookings"), {
      ...bookingData,
      createdAt: Timestamp.now(),
    });
    console.log("✅ Booking berhasil dibuat dengan ID:", docRef.id);

    // AUTO-CREATE MEDICAL RECORD
    // Medical record akan langsung dibuat saat booking dibuat
    // Sehingga saat jam estimasi lewat, otomatis bisa ditampilkan di Medical Records
    const medicalRecord = {
      userId: booking.userId,
      petName: booking.petName,
      petType: booking.petType,
      service: booking.service,
      visitDate: booking.date, // "2025-11-26"
      visitTime: booking.time, // "13:00"
      estimatedEndTime: estimatedEndTime, // "13:45"
      diagnosis: "", // Akan diisi dokter nanti
      treatment: "", // Akan diisi dokter nanti
      prescription: "", // Akan diisi dokter nanti
      vetName: "", // Akan diisi dokter nanti
      notes: booking.notes || "",
    };

    await addDoc(collection(db, "medicalRecords"), {
      ...medicalRecord,
      createdAt: Timestamp.now(),
    });
    console.log("✅ Medical record otomatis dibuat untuk booking ini");

    return docRef.id;
  } catch (error) {
    console.error("❌ Error creating booking:", error);
    throw error;
  }
};

// Get user bookings
export const getUserBookings = async (userId: string) => {
  try {
    const q = query(
      collection(db, "bookings"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const bookings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("✅ Bookings retrieved:", bookings);
    return bookings;
  } catch (error) {
    console.error("❌ Error getting bookings:", error);
    throw error;
  }
};

// Export service duration map for use in components
export const getServiceDuration = (service: string): number => {
  return SERVICE_DURATION_MAP[service] || 30;
};
