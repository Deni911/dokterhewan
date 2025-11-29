import { db } from "../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

export interface VetBooking {
  id: string;
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
  notes: string;
  status: "pending" | "completed";
  createdAt?: Timestamp;
}

export interface MedicalRecordUpdate {
  diagnosis: string;
  treatment: string;
  prescription: string;
  vetName: string;
}

// Get all pending bookings untuk dokter (yang belum di-handle)
export async function getPendingBookings(): Promise<VetBooking[]> {
  try {
    const q = query(
      collection(db, "bookings"),
      where("status", "==", "pending")
    );

    const querySnapshot = await getDocs(q);
    const bookings: VetBooking[] = [];

    querySnapshot.forEach((doc) => {
      bookings.push({
        id: doc.id,
        ...doc.data(),
      } as VetBooking);
    });

    // Sort by date & time
    bookings.sort((a, b) => {
      const dateTimeA = new Date(`${a.date} ${a.time}`).getTime();
      const dateTimeB = new Date(`${b.date} ${b.time}`).getTime();
      return dateTimeA - dateTimeB;
    });

    return bookings;
  } catch (error) {
    console.error("Error fetching pending bookings:", error);
    throw error;
  }
}

// Update booking status menjadi completed
export async function completeBooking(bookingId: string): Promise<void> {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, {
      status: "completed",
    });
    console.log("✅ Booking marked as completed");
  } catch (error) {
    console.error("Error completing booking:", error);
    throw error;
  }
}

// Update medical record dengan diagnosis, treatment, dll
export async function updateMedicalRecord(
  recordId: string,
  data: MedicalRecordUpdate
): Promise<void> {
  try {
    const recordRef = doc(db, "medicalRecords", recordId);
    await updateDoc(recordRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
    console.log("✅ Medical record updated");
  } catch (error) {
    console.error("Error updating medical record:", error);
    throw error;
  }
}

// Find medical record by booking userId, petName, visitDate, visitTime
export async function findMedicalRecordByBooking(
  userId: string,
  petName: string,
  visitDate: string,
  visitTime: string
): Promise<any> {
  try {
    const q = query(
      collection(db, "medicalRecords"),
      where("userId", "==", userId),
      where("petName", "==", petName)
    );

    const querySnapshot = await getDocs(q);

    // Find matching record by date & time
    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data();
      if (data.visitDate === visitDate && data.visitTime === visitTime) {
        return { id: docSnap.id, ...data };
      }
    }

    return null;
  } catch (error) {
    console.error("Error finding medical record:", error);
    throw error;
  }
}
