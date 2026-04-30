"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./use-auth";

type Loader<T> = (accessToken: string) => Promise<T>;

export function useAuthResource<T>(loader: Loader<T>) {
  const { session } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!session) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await loader(session.accessToken);
        setData(response);
      } catch (loadError) {
        setError(
          loadError instanceof Error ? loadError.message : "Unable to load data.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void load();
  }, [loader, session]);

  return {
    data,
    error,
    isLoading,
  };
}
