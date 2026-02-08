import { useEffect, useState } from 'react';

export const useFetch = <T extends Record<string, any>>(endpoint: string) => {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<unknown | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const doFetch = async () => {
      if (loading) {
        return;
      }
      try {
        setError(null);
        setLoading(true);
        const res = await fetch(endpoint);

        if (!res.ok) {
          const e = await res.json();
          setError(e);
          return;
        }
        const data: T = await res.json();
        setData(data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    if (!loading && !data && !error) {
      doFetch();
    }
  }, [loading, data, error, endpoint]);

  return {
    data,
    error,
    loading,
  } as const;
};
