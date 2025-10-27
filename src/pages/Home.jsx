// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import MapView from "../components/MapView";
import SOSButton from "../components/SOSButton";
import SoundDetector from "../components/SoundDetector";
import useMotionDetector from "../hooks/useMotionDetector";
import { postAlertToFirestore } from "../services/alertService";

export default function Home() {
  const [userLocation, setUserLocation] = useState(null);
  const [unsafeZones, setUnsafeZones] = useState([
    {
      id: "z1",
      name: "Dark Alley",
      polygon: [
        [28.6135, 77.2089],
        [28.613, 77.2095],
        [28.614, 77.21],
      ],
      severity: "high",
    },
  ]);

  useEffect(() => {
    const id = navigator.geolocation.watchPosition(
      (p) => setUserLocation([p.coords.latitude, p.coords.longitude]),
      (e) => console.error(e),
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  //motion detection hook returns
  const motion = useMotionDetector();

  useEffect(() => {
    if (motion && motion.type === "fall" && motion.confidence > 0.6) {
      //auto SOS
      handleAutoSOS("fall-detected");
    }
  }, [motion]);

  const handleAutoSOS = async (reason = "auto") => {
    if (!userLocation) return alert("Location not available");
    await postAlertToFirestore({
      coords: { lat: userLocation[0], lng: userLocation[1] },
      type: `AutoSOS:${reason}`,
    });
    alert("Auto SOS sent (demo).");
  };

  const handleManualSOS = async () => {
    if (!userLocation) return alert("Location not available");
    await postAlertToFirestore({
      coords: { lat: userLocation[0], lng: userLocation[1] },
      type: "ManualSOS",
    });
    alert("SOS sent!");
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <MapView userLocation={userLocation} unsafeZones={unsafeZones} />
      </div>

      <div style={{ position: "absolute", right: 20, bottom: 20 }}>
        <SOSButton onClick={handleManualSOS} />
      </div>

      {/* Sound detector runs and can call a callback on detection */}
      <SoundDetector
        onDetect={async (label, prob) => {
          //label 'help' or 'scream' from speech-commands model
          console.log("sound detected", label, prob);
          if (prob > 0.85) {
            //auto SOS demo
            if (!userLocation) return;
            await postAlertToFirestore({
              coords: { lat: userLocation[0], lng: userLocation[1] },
              type: `SoundSOS:${label}`,
            });
            alert("Sound-based SOS sent (demo).");
          }
        }}
      />
    </div>
  );
}
