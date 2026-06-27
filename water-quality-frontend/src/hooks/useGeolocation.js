import { useState, useEffect } from 'react';
 
// Returns the browser's geolocation, or null if denied/unavailable.
// Falls back gracefully -- MapPage uses the India center as default.
export function useGeolocation() {
  const [position, setPosition] = useState(null);
  const [denied, setDenied] = useState(false);
 
  useEffect(() => {
    if (!navigator.geolocation) {
      setDenied(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => setDenied(true),
      { timeout: 5000 }
    );
  }, []);
 
  return { position, denied };
}