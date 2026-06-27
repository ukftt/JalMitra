import { useState, useEffect, useCallback } from 'react';
import { getAllReports } from '../api/reportsApi';
 
// Fetches all reports once on mount, and exposes a refetch() you can
// call after a status update or new submission so the UI stays in sync.
export function useReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  const refetch = useCallback(() => {
    setLoading(true);
    return getAllReports()
      .then((res) => {
        setReports(res.data);
        setError(null);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);
 
  useEffect(() => {
    refetch();
  }, [refetch]);
 
  return { reports, loading, error, refetch, setReports };
}