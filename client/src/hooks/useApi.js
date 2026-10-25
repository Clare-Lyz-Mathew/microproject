import { useState, useEffect, useCallback, useRef } from 'react';

// Custom hook for connecting to the Express REST API
export function useApi(url, options) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sqlInfo, setSqlInfo] = useState(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, optionsRef.current);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      if (json.success !== undefined && !json.success) {
        throw new Error(json.message || json.error || 'Request failed');
      }
      setData(json.data !== undefined ? json.data : json);
      if (json.sql) {
        setSqlInfo({
          queryUsed: json.queryUsed,
          sql: json.sql
        });
      }
    } catch (err) {
      console.error(`[API Error: ${url}]`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, sqlInfo, refetch: fetchData };
}
