"use client";
import { useState, useEffect } from "react";

function formatBytes(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/New_York",
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  }) + " ET";
}

function StatusBadge({ status }) {
  const styles = {
    complete: { background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" },
    pending: { background: "#fffbeb", color: "#92400e", border: "1px solid #fde68a" },
  };
  return (
    <span style={{ ...styles[status] || styles.pending, borderRadius: "20px", padding: "3px 10px", fontSize: "12px", fontWeight: "600" }}>
      {status === "complete" ? "✓ Complete" : "⏳ Pending"}
    </span>
  );
}

function SessionCard({ session }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", marginBottom: "12px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
      <div onClick={() => setExpanded(!expanded)} style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: "16px", cursor: "pointer", background: expanded ? "#f8fafc" : "#ffffff" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px", flexWrap: "wrap" }}>
            <span style={{ fontWeight: "700", color: "#0f2342", fontSize: "15px" }}>{session.name || "Unknown"}</span>
            {session.businessName && <span style={{ color: "#6b7280", fontSize: "13px" }}>— {session.businessName}</span>}
            <StatusBadge status={session.status} />
          </div>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "13px", color: "#4b5563" }}>{session.email}</span>
            {session.phone && <span style={{ fontSize: "13px", color: "#4b5563" }}>{session.phone}</span>}
            {session.loanAmount && <span style={{ fontSize: "13px", color: "#2563eb", fontWeight: "600" }}>{session.loanAmount}</span>}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: "12px", color: "#9ca3af" }}>{formatDate(session.createdAt)}</div>
          <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>{session.files?.length || 0} file{session.files?.length !== 1 ? "s" : ""}</div>
          <div style={{ fontSize: "11px", color: "#2563eb", marginTop: "2px" }}>/upload/{session.token}</div>
        </div>
        <div style={{ color: "#9ca3af", fontSize: "18px", flexShrink: 0 }}>{expanded ? "▲" : "▼"}</div>
      </div>
      {expanded && (
        <div style={{ padding: "0 20px 20px", borderTop: "1px solid #f3f4f6" }}>
          <div style={{ paddingTop: "16px" }}>
            {session.files && session.files.length > 0 ? (
              <>
                <div style={{ fontWeight: "600", fontSize: "13px", color: "#374151", marginBottom: "10px" }}>Uploaded Files</div>
                {session.files.map((file, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", background: "#f9fafb", borderRadius: "8px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "20px" }}>📄</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: "600", fontSize: "13px", color: "#0f2342", wordBreak: "break-word" }}>{file.name}</div>
                      {file.size && <div style={{ fontSize: "12px", color: "#9ca3af" }}>{formatBytes(file.size)}</div>}
                    </div>
                    {file.downloadUrl && (
                      <a href={file.downloadUrl} target="_blank" rel="noopener noreferrer" download
                        style={{ background: "#0f2342", color: "#ffffff", textDecoration: "none", borderRadius: "6px", padding: "7px 14px", fontSize: "12px", fontWeight: "600", flexShrink: 0 }}>
                        Download ↓
                      </a>
                    )}
                  </div>
                ))}
                {session.completedAt && <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "8px" }}>Completed: {formatDate(session.completedAt)}</div>}
              </>
            ) : (
              <div style={{ color: "#9ca3af", fontSize: "14px", fontStyle: "italic" }}>No files uploaded yet</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminUploadsPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [filter, setFilter] = useState("all");

  const handleLogin = (e) => {
    e.preventDefault();
    sessionStorage.setItem("adminToken", password);
    setAuthed(true);
    setAuthError(false);
  };

  useEffect(() => {
    if (!authed) return;
    const token = sessionStorage.getItem("adminToken");
    if (!token) return;
    const fetchSessions = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const res = await fetch("/api/admin/uploads", { headers: { Authorization: `Bearer ${token}` } });
        if (res.status === 401) { setAuthed(false); setAuthError(true); return; }
        const data = await res.json();
        setSessions(data.sessions || []);
      } catch {
        setFetchError("Failed to load submissions. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [authed]);

  const filtered = sessions.filter((s) => {
    if (filter === "complete") return s.status === "complete";
    if (filter === "pending") return s.status !== "complete";
    return true;
  });

  if (!authed) {
    return (
      <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f2342 0%, #1a3a5c 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", fontFamily: "'Inter', -apple-system, sans-serif" }}>
        <div style={{ background: "#ffffff", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "380px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{ fontSize: "36px", marginBottom: "8px" }}>🔒</div>
            <h1 style={{ color: "#0f2342", fontSize: "22px", fontWeight: "800", margin: "0 0 4px" }}>Document Vault</h1>
            <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>Small Business Capital — Admin</p>
          </div>
          <form onSubmit={handleLogin}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter admin password" autoFocus
              style={{ width: "100%", padding: "12px 14px", border: `1px solid ${authError ? "#fca5a5" : "#d1d5db"}`, borderRadius: "8px", fontSize: "15px", marginBottom: "12px", outline: "none", boxSizing: "border-box", background: authError ? "#fef2f2" : "#ffffff" }} />
            {authError && <p style={{ color: "#dc2626", fontSize: "13px", margin: "-4px 0 12px" }}>Incorrect password</p>}
            <button type="submit" style={{ width: "100%", background: "#0f2342", color: "#ffffff", border: "none", borderRadius: "8px", padding: "13px", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}>
              Access Vault →
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ background: "#0f2342", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ color: "#ffffff", fontWeight: "800", fontSize: "16px" }}>Small Business Capital</span>
          <span style={{ color: "#7fb3d3", fontSize: "14px", marginLeft: "12px" }}>Document Vault</span>
        </div>
        <button onClick={() => { setAuthed(false); sessionStorage.removeItem("adminToken"); }}
          style={{ background: "transparent", border: "1px solid #ffffff40", color: "#ffffff", borderRadius: "6px", padding: "6px 12px", fontSize: "13px", cursor: "pointer" }}>
          Sign Out
        </button>
      </div>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "24px" }}>
          {[
            { label: "Total Submissions", value: sessions.length },
            { label: "Complete", value: sessions.filter((s) => s.status === "complete").length, color: "#16a34a" },
            { label: "Pending", value: sessions.filter((s) => s.status !== "complete").length, color: "#d97706" },
          ].map((stat) => (
            <div key={stat.label} style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "28px", fontWeight: "800", color: stat.color || "#0f2342" }}>{stat.value}</div>
              <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>{stat.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          {["all", "complete", "pending"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ background: filter === f ? "#0f2342" : "#ffffff", color: filter === f ? "#ffffff" : "#374151", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "7px 16px", fontSize: "13px", fontWeight: "600", cursor: "pointer", textTransform: "capitalize" }}>
              {f === "all" ? `All (${sessions.length})` : f === "complete" ? `Complete (${sessions.filter(s => s.status === "complete").length})` : `Pending (${sessions.filter(s => s.status !== "complete").length})`}
            </button>
          ))}
        </div>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#9ca3af" }}>Loading submissions…</div>
        ) : fetchError ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#dc2626" }}>{fetchError}</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#9ca3af" }}>{sessions.length === 0 ? "No submissions yet" : "No submissions match this filter"}</div>
        ) : (
          filtered.map((session) => <SessionCard key={session.sessionId} session={session} />)
        )}
      </div>
    </main>
  );
}