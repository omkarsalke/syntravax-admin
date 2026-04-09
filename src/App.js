import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Login from "./Login";
import CompanySetup from "./CompanySetup";
import Dashboard from "./Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await checkCompany(currentUser.uid);
      } else {
        setCompanyId(null);
        setChecking(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const checkCompany = async (uid) => {
    try {
      const snap = await getDoc(doc(db, "companies", uid));
      if (snap.exists()) {
        setCompanyId(uid);
      } else {
        setCompanyId(null);
      }
    } catch (error) {
      console.error(error);
    }
    setChecking(false);
  };

  if (checking) {
    return (
      <div style={loadingStyle}>
        <div style={spinnerStyle} />
      </div>
    );
  }

  if (!user) return <Login />;
  if (!companyId) {
    return (
      <CompanySetup
        user={user}
        onComplete={(id) => setCompanyId(id)}
      />
    );
  }

  return <Dashboard user={user} companyId={companyId} />;
}

const loadingStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: "#f0f2f5",
};

const spinnerStyle = {
  width: "40px",
  height: "40px",
  border: "3px solid #E5E5EA",
  borderTop: "3px solid #0A84FF",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};

export default App;