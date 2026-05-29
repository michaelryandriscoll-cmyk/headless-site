"use client";
// app/upload/[token]/page.js
// Standalone secure upload portal — accessed via unique link sent by email.
// URL format: smallbusiness.capital/upload/john-smith-K7X2

import { useEffect, useRef, useState } from "react";
import { use } from "react";

const REQUIRED_DOCS = [
  { id: "bank-statement-1", label: "Bank Statement — Most Recent Month", hint: "Your most recent complete month", required: true },
  { id: "bank-statement-2", label: "Bank Statement — 2nd Most Recent Month", hint: "The month before your most recent", required: true },
  { id: "bank-statement-3", label: "Bank Statement — 3rd Most Recent Month", hint: "Three months back", required: true },
  { id: "merchant-application", label: "Signed Merchant Application", hint: "The application we sent or you downloaded — signed and dated", required: true },
];

const OPTIONAL_DOCS = [
  { id: "voided-check", label: "Voided Check", hint: "For ACH payment setup (if applicable)", required: false },
  { id: "drivers-license", label: "Driver's License / Government ID", hint: "Front side only", required: false },
];

function FileRow({ doc, file, onSelect, onRemove, uploading, uploadProgress, error }) {
  const inputRef = useRef(null);
  const isUploaded = uploadProgress === 100;
  return (
    <div style={{ background: isUploaded ? "#f0fdf4" : error ? "#fef2f2" : file ? "#f0f7ff" : "#ffffff", border: `1px solid ${isUploaded ? "#bbf7d0" : error ? "#fecaca" : file ? "#bfdbfe" : "#e5e7eb"}`, borderRadius: "10px", padding: "14px 16px", marginBottom: "10px", transition: "all 0.2s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: isUploaded ? "#16a34a" : error ? "#dc2626" : file ? "#2563eb" : "#f3f4f6", fontSize: "16px" }}>
          {isUploaded ? "✓" : error ? "!" : file ? "📄" : "📋"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: "600", fontSize: "14px", color: "#0f172a", marginBottom: "2px" }}>
            {doc.label}{doc.required && <span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>}
          </div>
          <div style={{ fontSize: "12px", color: "#6b7280" }}>{file ? file.name : doc.hint}</div>
          {error && <div style={{ fontSize: "12px", color: "#dc2626", marginTop: "2px" }}>{error}</div>}
        </div>
        {!file && !uploading && (
          <>
            <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.heic" style={{ display: "none" }} onChange={(e) => e.target.files[0] && onSelect(doc.id, e.target.files[0])} />
            <button onClick={() => inputRef.current?.click()} style={{ background: "#0f2342", color: "#ffffff", border: "none", borderRadius: "6px", padding: "8px 14px", fontSize: "13px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>Choose File</button>
          </>
        )}
        {file && !uploading && !isUploaded && (
          <button onClick={() => onRemove(doc.id)} style={{ background: "transparent", border: "1px solid #d1d5db", borderRadius: "6px", padding: "6px 10px", fontSize: "12px", color: "#6b7280", cursor: "pointer", flexShrink: 0 }}>Remove</button>
        )}
        {uploading && !isUploaded && <div style={{ fontSize: "12px", color: "#2563eb", flexShrink: 0 }}>{uploadProgress}%</div>}
        {isUploaded && <div style={{ background: "#16a34a", color: "#fff", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", fontWeight: "600", flexShrink: 0 }}>Uploaded ✓</div>}
      </div>
      {uploading && !isUploaded && (
        <div style={{ marginTop: "10px", background: "#e5e7eb", borderRadius: "4px", height: "4px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${uploadProgress}%`, background: "#2563eb", borderRadius: "4px", transition: "width 0.3s ease" }} />
        </div>
      )}
    </div>
  );
}

function DropZone({ onFiles }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);
  const handleDrop = (e) => { e.preventDefault(); setDragging(false); const files = Array.from(e.dataTransfer.files); if (files.length) onFiles(files); };
  return (
    <div onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop} onClick={() => inputRef.current?.click()}
      style={{ border: `2px dashed ${dragging ? "#2563eb" : "#d1d5db"}`, borderRadius: "10px", padding: "24px", textAlign: "center", cursor: "pointer", background: dragging ? "#eff6ff" : "#f9fafb", transition: "all 0.2s ease", marginBottom: "20px" }}>
      <input ref={inputRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.heic" style={{ display: "none" }} onChange={(e) => onFiles(Array.from(e.target.files))} />
      <div style={{ fontSize: "28px", marginBottom: "8px" }}>📂</div>
      <div style={{ fontWeight: "600", color: "#0f2342", marginBottom: "4px" }}>Drag & drop files here, or click to browse</div>
      <div style={{ fontSize: "13px", color: "#6b7280" }}>PDF, JPG, PNG up to 25MB each</div>
    </div>
  );
}

export default function UploadPage({ params }) {
  const { token } = use(params);
  const [session, setSession] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [fileMap, setFileMap] = useState({});
  const [progressMap, setProgressMap] = useState({});
  const [errorMap, setErrorMap] = useState({});
  const [uploadingId, setUploadingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Load session metadata
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/upload/session?token=${token}`);
        if (res.status === 404) { setNotFound(true); return; }
        const data = await res.json();
        if (data.status === "complete") { setDone(true); }
        setSession(data);
      } catch { setNotFound(true); }
    };
    load();
  }, [token]);

  const handleDropFiles = (files) => {
    const allDocs = [...REQUIRED_DOCS, ...OPTIONAL_DOCS];
    let remaining = [...files];
    const newMap = { ...fileMap };
    for (const doc of allDocs) {
      if (remaining.length === 0) break;
      if (!newMap[doc.id]) newMap[doc.id] = remaining.shift();
    }
    setFileMap(newMap);
    setErrorMap({});
  };

  const handleSelect = (docId, file) => { setFileMap((prev) => ({ ...prev, [docId]: file })); setErrorMap((prev) => ({ ...prev, [docId]: null })); };
  const handleRemove = (docId) => {
    setFileMap((prev) => { const next = { ...prev }; delete next[docId]; return next; });
    setProgressMap((prev) => { const next = { ...prev }; delete next[docId]; return next; });
  };

  const uploadFile = async (docId, file, fileIndex) => {
    setUploadingId(docId);
    setProgressMap((prev) => ({ ...prev, [docId]: 0 }));
    try {
      const presignRes = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: token, fileName: file.name, fileType: file.type, fileSize: file.size, fileIndex }),
      });
      const { presignedUrl, error } = await presignRes.json();
      if (error) throw new Error(error);
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", presignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.upload.onprogress = (e) => { if (e.lengthComputable) setProgressMap((prev) => ({ ...prev, [docId]: Math.round((e.loaded / e.total) * 100) })); };
        xhr.onload = () => { if (xhr.status >= 200 && xhr.status < 300) { setProgressMap((prev) => ({ ...prev, [docId]: 100 })); resolve(); } else reject(new Error(`Upload failed: ${xhr.status}`)); };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(file);
      });
    } catch (err) {
      setErrorMap((prev) => ({ ...prev, [docId]: err.message || "Upload failed. Please try again." }));
      setProgressMap((prev) => { const next = { ...prev }; delete next[docId]; return next; });
    } finally { setUploadingId(null); }
  };

  const handleSubmit = async () => {
    const newErrors = {};
    for (const doc of REQUIRED_DOCS) { if (!fileMap[doc.id]) newErrors[doc.id] = "This document is required"; }
    if (Object.keys(newErrors).length > 0) { setErrorMap(newErrors); return; }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const allDocs = [...REQUIRED_DOCS, ...OPTIONAL_DOCS];
      let fileIndex = 0;
      for (const doc of allDocs) {
        const file = fileMap[doc.id];
        if (file && progressMap[doc.id] !== 100) { await uploadFile(doc.id, file, fileIndex); }
        if (file) fileIndex++;
      }
      const completeRes = await fetch("/api/upload/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: token }),
      });
      const completeData = await completeRes.json();
      if (!completeData.success) throw new Error("Failed to finalize upload");
      setDone(true);
    } catch (err) { setSubmitError(err.message || "Something went wrong. Please try again."); }
    finally { setSubmitting(false); }
  };

  const requiredFilled = REQUIRED_DOCS.every((d) => fileMap[d.id]);
  const anyUploading = uploadingId !== null || submitting;

  // Not found
  if (notFound) {
    return (
      <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f2342 0%, #1a3a5c 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", fontFamily: "'Inter', -apple-system, sans-serif" }}>
        <div style={{ background: "#ffffff", borderRadius: "16px", padding: "40px", maxWidth: "440px", width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>🔍</div>
          <h1 style={{ color: "#0f2342", fontSize: "20px", fontWeight: "800", marginBottom: "12px" }}>Upload link not found</h1>
          <p style={{ color: "#4b5563", lineHeight: "1.6", marginBottom: "20px" }}>This link may have expired or been entered incorrectly. Please contact us and we'll send you a new one.</p>
          <a href="tel:18889008979" style={{ display: "inline-block", background: "#0f2342", color: "#fff", textDecoration: "none", borderRadius: "8px", padding: "12px 24px", fontWeight: "700" }}>(888) 900-8979</a>
        </div>
      </main>
    );
  }

  // Loading
  if (!session) {
    return (
      <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f2342 0%, #1a3a5c 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', -apple-system, sans-serif" }}>
        <div style={{ color: "#ffffff", fontSize: "16px" }}>Loading your secure portal…</div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f2342 0%, #1a3a5c 100%)", padding: "40px 16px 80px", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <div style={{ color: "#ffffff", fontSize: "22px", fontWeight: "800", letterSpacing: "-0.5px", marginBottom: "16px" }}>Small Business Capital</div>
          </a>
          <div style={{ fontSize: "13px", color: "#7fb3d3", fontWeight: "500", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Secure Document Portal</div>
          <h1 style={{ color: "#ffffff", fontSize: "28px", fontWeight: "800", margin: "0 0 8px", lineHeight: "1.2" }}>
            {done ? "Documents Received ✓" : `Hi${session.name ? " " + session.name.split(" ")[0] : ""}, upload your documents`}
          </h1>
          {!done && (
            <div style={{ display: "inline-block", background: "rgba(255,255,255,0.1)", borderRadius: "20px", padding: "4px 14px", fontSize: "12px", color: "#93c5fd", marginTop: "4px" }}>
              Upload code: <strong>{token}</strong>
            </div>
          )}
        </div>

        <div style={{ background: "#ffffff", borderRadius: "16px", padding: "32px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          {done ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎉</div>
              <h2 style={{ color: "#0f2342", fontSize: "24px", fontWeight: "800", marginBottom: "12px" }}>You're all set!</h2>
              <p style={{ color: "#4b5563", fontSize: "16px", lineHeight: "1.6", marginBottom: "24px" }}>Your documents have been securely uploaded. Our team will review everything and reach out within <strong>1 business day</strong> with your funding options.</p>
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "16px 20px", marginBottom: "28px", textAlign: "left" }}>
                <div style={{ fontWeight: "700", color: "#166534", marginBottom: "8px" }}>What happens next:</div>
                <ol style={{ margin: 0, paddingLeft: "20px", color: "#166534", lineHeight: "1.8" }}>
                  <li>We review your documents (same business day)</li>
                  <li>We identify the best funding options for you</li>
                  <li>A funding specialist will contact you with your offer</li>
                </ol>
              </div>
              <p style={{ color: "#6b7280", fontSize: "14px" }}>Questions? Call us at <a href="tel:18889008979" style={{ color: "#2563eb", fontWeight: "600" }}>(888) 900-8979</a></p>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "12px 16px", marginBottom: "24px" }}>
                <span style={{ fontSize: "20px" }}>🔒</span>
                <div>
                  <div style={{ fontWeight: "700", color: "#166534", fontSize: "13px" }}>Bank-Level Secure Upload</div>
                  <div style={{ color: "#4b7c5f", fontSize: "12px" }}>Your documents are encrypted in transit and stored in a private, access-controlled vault. Only our funding team can view them.</div>
                </div>
              </div>
              <DropZone onFiles={handleDropFiles} />
              <div style={{ marginBottom: "8px" }}>
                <div style={{ fontWeight: "700", color: "#0f2342", fontSize: "14px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}><span style={{ color: "#dc2626" }}>*</span> Required Documents</div>
                <a href="https://sbc-uploads-portal.nyc3.digitaloceanspaces.com/sbc_merchant_application_fillable.pdf" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "10px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "8px", padding: "12px 16px", marginBottom: "16px", textDecoration: "none" }}>
                  <span style={{ fontSize: "20px" }}>📥</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "700", color: "#1d4ed8", fontSize: "14px" }}>Download Merchant Application</div>
                    <div style={{ fontSize: "12px", color: "#3b82f6" }}>Print, sign, and upload below as "Signed Merchant Application"</div>
                  </div>
                  <div style={{ background: "#2563eb", color: "#fff", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", fontWeight: "700", flexShrink: 0 }}>Download →</div>
                </a>
                {REQUIRED_DOCS.map((doc) => (<FileRow key={doc.id} doc={doc} file={fileMap[doc.id] || null} onSelect={handleSelect} onRemove={handleRemove} uploading={uploadingId === doc.id || (submitting && fileMap[doc.id] && progressMap[doc.id] < 100)} uploadProgress={progressMap[doc.id] || 0} error={errorMap[doc.id] || null} />))}
              </div>
              <div style={{ marginBottom: "24px" }}>
                <div style={{ fontWeight: "700", fontSize: "14px", marginBottom: "12px", color: "#6b7280" }}>Optional Documents</div>
                {OPTIONAL_DOCS.map((doc) => (<FileRow key={doc.id} doc={doc} file={fileMap[doc.id] || null} onSelect={handleSelect} onRemove={handleRemove} uploading={uploadingId === doc.id} uploadProgress={progressMap[doc.id] || 0} error={errorMap[doc.id] || null} />))}
              </div>
              <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", fontSize: "13px", color: "#92400e" }}>
                <strong>Need help?</strong> Call us at <a href="tel:18889008979" style={{ color: "#92400e" }}>(888) 900-8979</a> or email <a href="mailto:michael@smallbusiness.capital" style={{ color: "#92400e" }}>michael@smallbusiness.capital</a>
              </div>
              {submitError && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "12px 16px", marginBottom: "16px", color: "#dc2626", fontSize: "14px" }}>{submitError}</div>}
              <button onClick={handleSubmit} disabled={anyUploading}
                style={{ width: "100%", background: anyUploading ? "#9ca3af" : requiredFilled ? "#00a870" : "#2563eb", color: "#ffffff", border: "none", borderRadius: "10px", padding: "16px", fontSize: "16px", fontWeight: "700", cursor: anyUploading ? "not-allowed" : "pointer", transition: "background 0.2s ease" }}>
                {submitting ? "Uploading your documents…" : "Submit Documents Securely →"}
              </button>
              <p style={{ textAlign: "center", fontSize: "12px", color: "#9ca3af", marginTop: "12px" }}>By submitting, you consent to our team reviewing these documents for your funding application.</p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
