import React, { useState } from "react";
import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

function CompanySetup({ user, onComplete }) {
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleCreate = async () => {
    if (!companyName.trim()) {
      setMessage("Syntravax services .");
      return;
    }
    setLoading(true);
    try {
      const companyId = user.uid;
      await setDoc(doc(db, "companies", companyId), {
        name: companyName.trim(),
        adminEmail: user.email,
        adminName: user.displayName,
        adminUid: user.uid,
        createdAt: new Date().toISOString(),
      });
      onComplete(companyId);
    } catch (error) {
      setMessage("❌ Error: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoWrap}>
  <svg width="64" height="64" viewBox="0 0 116 116" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="hg3" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#1AADFF"/>
        <stop offset="0.5" stopColor="#0A72E8"/>
        <stop offset="1" stopColor="#0044CC"/>
      </linearGradient>
      <linearGradient id="gr3" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#3EE068"/>
        <stop offset="1" stopColor="#18B840"/>
      </linearGradient>
    </defs>
    <polygon points="58,4 106,30 106,82 58,108 10,82 10,30" fill="url(#hg3)"/>
    <rect x="30" y="28" width="52" height="13" rx="6.5" fill="white"/>
    <rect x="30" y="28" width="13" height="32" rx="6.5" fill="white"/>
    <rect x="30" y="49" width="52" height="13" rx="6.5" fill="white"/>
    <rect x="69" y="49" width="13" height="32" rx="6.5" fill="white"/>
    <rect x="30" y="71" width="52" height="13" rx="6.5" fill="white"/>
   </svg>
    </div>
        <h1 style={styles.title}>Welcome to Syntravax</h1>
        <p style={styles.subtitle}>
          Set up your window to get started
        </p>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. ABC Facilities"
            style={styles.input}
          />
        </div>
    
        <button
          onClick={handleCreate}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "Creating..." : "Create Company →"}
        </button>
        {message && (
          <p style={styles.message}>{message}</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f2f5",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    width: "420px",
    textAlign: "center",
  },
  logoWrap: {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 20px",
  },
  
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#6C6C70",
    marginBottom: "28px",
  },
  inputGroup: {
    textAlign: "left",
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    color: "#6C6C70",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    border: "1.5px solid #E5E5EA",
    borderRadius: "10px",
    padding: "12px 16px",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },
  infoBox: {
    backgroundColor: "#F2F2F7",
    borderRadius: "10px",
    padding: "12px 16px",
    marginBottom: "20px",
    textAlign: "left",
  },
  infoText: {
    fontSize: "13px",
    color: "#6C6C70",
    margin: "2px 0",
  },
  button: {
    width: "100%",
    backgroundColor: "#0A84FF",
    color: "#fff",
    border: "none",
    padding: "14px",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  message: {
    marginTop: "12px",
    fontSize: "13px",
    color: "#6C6C70",
  },
};

export default CompanySetup;