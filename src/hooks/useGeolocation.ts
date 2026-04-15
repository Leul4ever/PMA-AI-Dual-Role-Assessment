import { useState, useEffect } from "react";

interface Coords {
  latitude: number;
  longitude: number;
}

export const useGeolocation = () => {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      // Use setTimeout to ensure the state update is asynchronous and avoids cascading renders
      setTimeout(() => {
        setError("Geolocation is not supported by your browser");
        setLoading(false);
      }, 0);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  }, []);

  return { coords, error, loading };
};
