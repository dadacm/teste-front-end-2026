import { useCallback, useEffect, useRef, useState } from "react";

export type FetchStatus = "idle" | "loading" | "success" | "error";

export type Fetcher<TData, TParams> = (params: TParams, signal: AbortSignal) => Promise<TData>;

export function useFetch<TData, TParams>(fetcher: Fetcher<TData, TParams>) {
  const [data, setData] = useState<TData | null>(null);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  const execute = useCallback(
    async (params: TParams): Promise<TData | undefined> => {
      controllerRef.current?.abort();

      const controller = new AbortController();
      controllerRef.current = controller;

      setStatus("loading");
      setData(null);
      setError(null);

      try {
        const response = await fetcher(params, controller.signal);

        if (controller.signal.aborted) {
          return;
        }

        setData(response);
        setStatus("success");

        return response;
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        setError(err instanceof Error ? err.message : "Erro ao realizar requisição.");

        setStatus("error");
      } finally {
        if (controllerRef.current === controller) {
          controllerRef.current = null;
        }
      }
    },
    [fetcher],
  );

  return {
    data,
    status,
    error,
    execute,
    isLoading: status === "loading",
  };
}
