import React, { useRef, useState } from "react";
import { base44 } from "@/api/base44Client";
import { FileText, Loader2, Upload, RefreshCw } from "lucide-react";

export default function ResumeUpload({ value, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const pick = () => inputRef.current?.click();

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
      onChange({ uri: file_uri, name: file.name });
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf"
        onChange={handleFile}
        className="hidden"
      />
      {value?.uri ? (
        <div className="flex items-center gap-3 rounded-2xl border border-[#2C7A4B]/25 bg-card p-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2C7A4B]/10">
            <FileText className="h-5 w-5 text-[#2C7A4B]" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{value.name || "Resume"}</p>
            <p className="text-sm font-medium text-[#2C7A4B]">Uploaded · stored privately</p>
          </div>
          <button
            type="button"
            onClick={pick}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-foreground/60 press"
            aria-label="Replace resume"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={pick}
          disabled={uploading}
          className="flex w-full flex-col items-center gap-1.5 rounded-2xl border-2 border-dashed border-border bg-muted px-4 py-7 text-center transition press hover:border-primary/50"
        >
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-sm font-semibold text-foreground">Uploading…</span>
            </>
          ) : (
            <>
              <Upload className="h-6 w-6 text-primary" />
              <span className="text-sm font-semibold text-foreground">Upload your resume / CV</span>
              <span className="text-sm text-foreground/45">PDF, DOC or DOCX · stored privately</span>
            </>
          )}
        </button>
      )}
      {error && <p className="mt-2 text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}
