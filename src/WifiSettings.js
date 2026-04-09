import React, { useState, useEffect, useCallback } from "react";
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

function WifiSettings({ companyId }) {
  const [wifiName, setWifiName] = useState("");
  const [savedWifi, setSavedWifi] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");

  const fetchWifiSetting = useCallback(async () => {
    setFetching(true);
    try {
      const docRef = doc(db, "companies", companyId, "settings", "wifi");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSavedWifi(docSnap.data().ssid);
        setWifiName(docSnap.data().ssid);
      }
    } catch (error) {
      console.error("Error fetching Wi-Fi setting:", error);
    }
    setFetching(false);
  }, [companyId]);

  useEffect(() => {
    fetchWifiSetting();
  }, [fetchWifiSetting]);

  const handleSave = async () => {
    if (!wifiName.trim()) {
      setMessage("⚠️ Please enter a Wi-Fi name.");
      return;
    }
    setLoading(true);
    try {
      await setDoc(doc(db, "companies", companyId, "settings", "wifi"), {
        ssid: wifiName.trim(),
        updatedAt: new Date().toISOString(),
      });
      setSavedWifi(wifiName.trim());
      setMessage("✅ Wi-Fi name saved successfully!");
    } catch (error) {
      setMessage("❌ Error saving: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Wi-Fi Settings
      </h2>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
        <h3 className="text-blue-800 font-semibold mb-2">
          📶 How this works
        </h3>
        <p className="text-blue-700 text-sm">
          Set your office Wi-Fi name below. When staff connect to this
          Wi-Fi, they will be automatically checked in. When they
          disconnect or switch to another network, they will be
          automatically checked out.
        </p>
      </div>

      {/* Current Setting */}
      {savedWifi && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
          <p className="text-sm text-green-700 font-medium">
            ✅ Current Office Wi-Fi
          </p>
          <p className="text-2xl font-bold text-green-800 mt-1">
            📶 {savedWifi}
          </p>
        </div>
      )}

      {/* Update Form */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          {savedWifi ? "Update Office Wi-Fi Name" : "Set Office Wi-Fi Name"}
        </h3>

        {fetching ? (
          <p className="text-gray-400">Loading current setting...</p>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">
                Wi-Fi Name (SSID)
              </label>
              <input
                type="text"
                value={wifiName}
                onChange={(e) => setWifiName(e.target.value)}
                placeholder="e.g. Office_WiFi_2024"
                className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <p className="text-xs text-gray-400 mt-1">
                Enter the exact Wi-Fi name — it is case sensitive.
              </p>
            </div>

            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
              {loading ? "Saving..." : "Save Wi-Fi Name"}
            </button>

            {message && (
              <p className="mt-3 text-sm text-gray-600">{message}</p>
            )}
          </>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          📋 How to find your Wi-Fi name
        </h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start gap-3">
            <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs flex-shrink-0">
              1
            </span>
            <p>On your phone, go to <strong>Settings → Wi-Fi</strong></p>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs flex-shrink-0">
              2
            </span>
            <p>Connect to your office Wi-Fi network</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs flex-shrink-0">
              3
            </span>
            <p>
              The name shown next to the ✅ checkmark is your{" "}
              <strong>Wi-Fi SSID</strong> — copy it exactly
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs flex-shrink-0">
              4
            </span>
            <p>
              Paste it above and click <strong>"Save Wi-Fi Name"</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WifiSettings;