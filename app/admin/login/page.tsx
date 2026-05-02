"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace("/admin/mattress");
      } else {
        const data = await res.json();
        setError(data.error ?? "Incorrect password.");
      }
    } catch {
      setError("Request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f9fafb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: "40px 32px",
          width: "100%",
          maxWidth: 380,
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#111827",
            margin: "0 0 4px 0",
          }}
        >
          Admin
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 28px 0" }}>
          Enter your password to continue.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            required
            style={{
              width: "100%",
              padding: "12px 14px",
              border: "1px solid #d1d5db",
              borderRadius: 8,
              fontSize: 15,
              outline: "none",
              boxSizing: "border-box",
              color: "#111827",
            }}
          />

          {error && (
            <p style={{ fontSize: 13, color: "#ef4444", margin: 0 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              padding: "12px 0",
              background: loading || !password ? "#d1d5db" : "#6366f1",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 700,
              cursor: loading || !password ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Checking…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
