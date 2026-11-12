import { useEffect, useState } from "react";
import { Download, FileText } from "lucide-react";
import {
  getMedicalRecordAttachmentBlob,
  type MedicalRecordAttachment,
} from "../services/medicalRecordService";

type LoadedAttachment = {
  attachment: MedicalRecordAttachment;
  url?: string;
  failed?: boolean;
};

export default function MedicalRecordAttachments({
  attachments,
}: {
  attachments: MedicalRecordAttachment[];
}) {
  const attachmentKey = JSON.stringify(attachments);
  const [loadedState, setLoadedState] = useState<{
    key: string;
    attachments: LoadedAttachment[];
  }>({ key: "", attachments: [] });

  useEffect(() => {
    let cancelled = false;
    const objectUrls: string[] = [];
    const requestedAttachments = JSON.parse(
      attachmentKey
    ) as MedicalRecordAttachment[];

    Promise.all(
      requestedAttachments.map(async (attachment) => {
        try {
          const blob = await getMedicalRecordAttachmentBlob(attachment);
          const url = URL.createObjectURL(blob);

          if (cancelled) {
            URL.revokeObjectURL(url);
            return { attachment, failed: true };
          }

          objectUrls.push(url);
          return { attachment, url };
        } catch (error) {
          console.error("Error loading medical record attachment:", error);
          return { attachment, failed: true };
        }
      })
    ).then((results) => {
      if (!cancelled) {
        setLoadedState({ key: attachmentKey, attachments: results });
      }
    });

    return () => {
      cancelled = true;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [attachmentKey]);

  if (attachments.length === 0) return null;
  const loading = loadedState.key !== attachmentKey;

  return (
    <div>
      <p className="mb-2 font-semibold text-gray-600">Lampiran pemeriksaan</p>
      {loading ? (
        <p className="text-sm text-gray-500">Memuat lampiran...</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {loadedState.attachments.map(({ attachment, url, failed }) => (
            <div
              key={attachment.path}
              className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
            >
              {failed || !url ? (
                <p className="p-4 text-sm text-red-600" role="alert">
                  Lampiran {attachment.name} tidak dapat dimuat.
                </p>
              ) : attachment.contentType.startsWith("image/") ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Buka gambar ${attachment.name}`}
                >
                  <img
                    src={url}
                    alt={`Lampiran medical record: ${attachment.name}`}
                    className="max-h-80 w-full bg-white object-contain"
                    loading="lazy"
                  />
                </a>
              ) : (
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-32 flex-col items-center justify-center gap-2 p-4 text-center text-blue-700 hover:bg-blue-50"
                >
                  <FileText size={28} aria-hidden="true" />
                  <span className="break-all text-sm font-semibold">
                    {attachment.name}
                  </span>
                  <span className="text-xs">Buka dokumen PDF</span>
                </a>
              )}
              {url && (
                <div className="flex items-center justify-between gap-2 border-t border-gray-200 px-3 py-2">
                  <span className="min-w-0 truncate text-xs text-gray-600">
                    {attachment.name}
                  </span>
                  <a
                    href={url}
                    download={attachment.name}
                    className="shrink-0 rounded p-1 text-blue-700 hover:bg-blue-100"
                    aria-label={`Unduh ${attachment.name}`}
                  >
                    <Download size={16} aria-hidden="true" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
