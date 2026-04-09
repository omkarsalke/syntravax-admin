import React from "react";
import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const provider = new GoogleAuthProvider();

function Login() {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Hexagon Logo */}
        <div style={styles.logoWrap}>
          <svg width="72" height="72" viewBox="0 0 116 116" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="hg4" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#1AADFF"/>
                <stop offset="0.5" stopColor="#0A72E8"/>
                <stop offset="1" stopColor="#0044CC"/>
              </linearGradient>
              <linearGradient id="gr4" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#3EE068"/>
                <stop offset="1" stopColor="#18B840"/>
              </linearGradient>
            </defs>
            <polygon points="58,4 106,30 106,82 58,108 10,82 10,30" fill="url(#hg4)"/>
            <rect x="30" y="28" width="52" height="13" rx="6.5" fill="white"/>
            <rect x="30" y="28" width="13" height="32" rx="6.5" fill="white"/>
            <rect x="30" y="49" width="52" height="13" rx="6.5" fill="white"/>
            <rect x="69" y="49" width="13" height="32" rx="6.5" fill="white"/>
            <rect x="30" y="71" width="52" height="13" rx="6.5" fill="white"/>
          </svg>
        </div>

        <h1 style={styles.title}>Syntravax</h1>
        <p style={styles.subtitle}>Workforce Management System</p>

        <button style={styles.button} onClick={handleLogin}>
          <svg width="18" height="18" viewBox="0 0 24 24" style={{marginRight:"10px", verticalAlign:"middle"}}>
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>

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
    borderRadius: "20px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
    textAlign: "center",
    width: "360px",
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0A72E8",
    marginBottom: "6px",
  },
  subtitle: {
    fontSize: "13px",
    color: "#6C6C70",
    marginBottom: "32px",
    letterSpacing: "0.5px",
  },
  button: {
    backgroundColor: "#fff",
    color: "#1C1C1E",
    border: "1.5px solid #E5E5EA",
    padding: "13px 24px",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s",
  },
};

export default Login;