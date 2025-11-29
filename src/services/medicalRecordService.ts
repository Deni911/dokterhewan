import { db } from "../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";

export type MedicalRecord = {
  id?: string;
  userId: string;
  petName: string;
  petType: string;
  service: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  notes: string;
  visitDate: string;
  visitTime: string;
  estimatedEndTime: string; // Waktu estimasi selesai
  vetName: string;
  createdAt?: any;
};

// Get all user medical records (simplified - no orderBy to avoid index)
export async function getUserMedicalRecords(
  userId: string
): Promise<MedicalRecord[]> {
  try {
    const q = query(
      collection(db, "medicalRecords"),
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(q);
    const records: MedicalRecord[] = [];

    querySnapshot.forEach((doc) => {
      records.push({
        id: doc.id,
        ...doc.data(),
      } as MedicalRecord);
    });

    // Sort manually di client-side
    records.sort((a, b) => {
      const dateA = new Date(a.visitDate).getTime();
      const dateB = new Date(b.visitDate).getTime();
      return dateB - dateA; // Descending
    });

    return records;
  } catch (error) {
    console.error("Error fetching medical records:", error);
    throw error;
  }
}

// Get completed medical records (where estimatedEndTime has passed)
export async function getCompletedMedicalRecords(
  userId: string
): Promise<MedicalRecord[]> {
  try {
    const allRecords = await getUserMedicalRecords(userId);
    const now = new Date();

    // Filter records where estimatedEndTime has passed
    const completedRecords = allRecords.filter((record) => {
      try {
        const visitDate = new Date(record.visitDate);
        const [endHours, endMinutes] = record.estimatedEndTime
          .split(":")
          .map(Number);
        const estimatedEndDateTime = new Date(visitDate);
        estimatedEndDateTime.setHours(endHours, endMinutes, 0);

        console.log(
          `📋 Checking ${
            record.petName
          }: now=${now.toLocaleTimeString()}, estimated=${estimatedEndDateTime.toLocaleTimeString()}, passed=${
            now >= estimatedEndDateTime
          }`
        );

        return now >= estimatedEndDateTime; // Tampilkan jika jam estimasi sudah lewat
      } catch (e) {
        console.error("Error parsing date:", e);
        return false;
      }
    });

    console.log(
      `✅ Found ${completedRecords.length} completed medical records`
    );
    return completedRecords;
  } catch (error) {
    console.error("Error fetching completed medical records:", error);
    throw error;
  }
}

// Create medical record
export async function createMedicalRecord(
  record: MedicalRecord
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "medicalRecords"), {
      ...record,
      createdAt: Timestamp.now(),
    });

    console.log("✅ Medical record created with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating medical record:", error);
    throw error;
  }
}
