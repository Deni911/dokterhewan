import { db } from "../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { auth } from "../config/firebase";
import { MEDICAL_RECORD_BUCKET, supabase } from "../config/supabase";

export type MedicalRecordAttachment = {
  path: string;
  name: string;
  contentType: string;
  size: number;
};

export const MAX_MEDICAL_RECORD_ATTACHMENT_SIZE = 10 * 1024 * 1024;
export const MAX_MEDICAL_RECORD_ATTACHMENTS = 5;

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
  attachments?: MedicalRecordAttachment[];
  createdAt?: Timestamp | Date | string;
};

const allowedAttachmentTypes = new Set([
  "image/avif",
  "image/bmp",
  "image/gif",
  "image/heic",
  "image/heif",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/webp",
  "application/pdf",
]);

export function isSupportedMedicalRecordAttachment(file: File): boolean {
  return allowedAttachmentTypes.has(file.type);
}

export async function uploadMedicalRecordAttachments(
  recordId: string,
  userId: string,
  files: File[]
): Promise<MedicalRecordAttachment[]> {
  const uploaded: MedicalRecordAttachment[] = [];
  if (files.length === 0) return uploaded;

  const vetUid = auth.currentUser?.uid;
  if (!vetUid) {
    throw new Error("Sesi dokter berakhir. Silakan login kembali.");
  }

  try {
    for (const file of files) {
      if (!isSupportedMedicalRecordAttachment(file)) {
        throw new Error(
          `${file.name}: format file tidak didukung. Gunakan gambar atau PDF.`
        );
      }

      if (file.size > MAX_MEDICAL_RECORD_ATTACHMENT_SIZE) {
        throw new Error(`${file.name}: ukuran file melebihi 10 MB.`);
      }

      const path = `medicalRecords/${recordId}/${userId}/${vetUid}/${crypto.randomUUID()}`;
      const { error } = await supabase.storage
        .from(MEDICAL_RECORD_BUCKET)
        .upload(path, file, {
          contentType: file.type,
          upsert: false,
        });
      if (error) {
        throw error;
      }

      uploaded.push({
        path,
        name: file.name,
        contentType: file.type,
        size: file.size,
      });
    }

    return uploaded;
  } catch (error) {
    if (uploaded.length > 0) {
      const { error: cleanupError } = await supabase.storage
        .from(MEDICAL_RECORD_BUCKET)
        .remove(uploaded.map((attachment) => attachment.path));
      if (cleanupError) {
        console.error(
          "Failed to clean up an incomplete medical attachment:",
          cleanupError
        );
      }
    }
    console.error("Error uploading medical record attachments:", error);
    throw error;
  }
}

export async function deleteMedicalRecordAttachments(
  attachments: MedicalRecordAttachment[]
): Promise<void> {
  if (attachments.length === 0) return;

  const { error } = await supabase.storage
    .from(MEDICAL_RECORD_BUCKET)
    .remove(attachments.map((attachment) => attachment.path));
  if (error) throw error;
}

export async function getMedicalRecordAttachmentBlob(
  attachment: MedicalRecordAttachment
): Promise<Blob> {
  const { data, error } = await supabase.storage
    .from(MEDICAL_RECORD_BUCKET)
    .download(attachment.path);
  if (error) throw error;
  return data;
}

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
