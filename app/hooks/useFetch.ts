import { useState } from "react";

export interface FetchResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  load: () => Promise<void>;
}
export default function useFetch<T=any>(fetchFn: () => Promise<T>): FetchResponse<T> {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchFn();
      setData(response);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }
  return {
    data,
    error,
    loading,
    load: fetchData,
  }
}