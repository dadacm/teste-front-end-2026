import { useCallback, useEffect, useRef, useState } from "react";

export type FetchStatus = "idle" | "loading" | "success" | "error";

export type Fetcher<TData, TParams> = (params: TParams, signal: AbortSignal) => Promise<TData>;

export type UseFetchOptions<TData> = {
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
};

export function useFetch<TData, TParams>(
  fetcher: Fetcher<TData, TParams>,
  options?: UseFetchOptions<TData>,
) {
  const [data, setData] = useState<TData | null>(null);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const controllerRef = useRef<AbortController | null>(null);
  const callbacksRef = useRef(options);

  useEffect(() => {
    callbacksRef.current = options;
  }, [options]);

  useEffect(() => {
    return () => controllerRef.current?.abort();
  }, []);

  const execute = useCallback(
    async (params: TParams): Promise<TData | undefined> => {
      controllerRef.current?.abort();

      const controller = new AbortController();
      controllerRef.current = controller;

      setStatus("loading");
      setData(null);
      setError(null);

      let response: TData;

      try {
        response = await fetcher(params, controller.signal);
      } catch (err) {
        if (controller.signal.aborted) return;

        const normalizedError =
          err instanceof Error ? err : new Error("Erro ao realizar requisição.");

        setError(normalizedError.message);
        setStatus("error");

        callbacksRef.current?.onError?.(normalizedError);
        return;
      } finally {
        if (controllerRef.current === controller) {
          controllerRef.current = null;
        }
      }

      if (controller.signal.aborted) return;

      setData(response);
      setStatus("success");

      callbacksRef.current?.onSuccess?.(response);

      return response;
    },
    [fetcher],
  );

  return {
    data,
    error,
    status,
    execute,
    isLoading: status === "loading",
  };
}
