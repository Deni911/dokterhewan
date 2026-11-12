import { createClient } from "@supabase/supabase-js";
import { auth } from "./firebase";

export const MEDICAL_RECORD_BUCKET = "medical-record-attachments";

export const supabase = createClient(
  "https://ywsctouymguigaibvzti.supabase.co",
  "sb_publishable_-rIedg1_9e_X6ZlZwG4F6Q_x0p7LAIp",
  {
    accessToken: async () => {
      const currentUser = auth.currentUser;
      return currentUser ? currentUser.getIdToken() : null;
    },
  }
);
