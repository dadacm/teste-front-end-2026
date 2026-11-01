// @vitest-environment jsdom

import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useFetch } from "./useFetch.js";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("useFetch", () => {
  it("inicia sem dados e sem carregamento", () => {
    const fetcher = vi.fn(async (_query: string, _signal: AbortSignal) => []);

    const { result } = renderHook(() => useFetch(fetcher));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.status).toBe("idle");
    expect(result.current.isLoading).toBe(false);
  });

  it("salva os dados retornados pela requisição", async () => {
    const fetcher = vi.fn(async (query: string, _signal: AbortSignal) => ({
      items: [query],
    }));

    const { result } = renderHook(() => useFetch(fetcher));

    await act(async () => {
      await result.current.execute("icasei");
    });

    expect(fetcher).toHaveBeenCalledOnce();
    expect(result.current.data).toEqual({
      items: ["icasei"],
    });
    expect(result.current.status).toBe("success");
    expect(result.current.isLoading).toBe(false);
  });

  it("mantém o carregamento enquanto a requisição está pendente", async () => {
    let resolveRequest!: (value: string[]) => void;

    const fetcher = vi.fn(
      (_query: string, _signal: AbortSignal) =>
        new Promise<string[]>((resolve) => {
          resolveRequest = resolve;
        }),
    );

    const { result } = renderHook(() => useFetch(fetcher));

    act(() => {
      void result.current.execute("icasei");
    });

    expect(result.current.status).toBe("loading");
    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolveRequest(["Vídeo de teste"]);
    });

    expect(result.current.data).toEqual(["Vídeo de teste"]);
    expect(result.current.status).toBe("success");
  });

  it("salva a mensagem quando ocorre um erro", async () => {
    const fetcher = vi.fn(async (_query: string, _signal: AbortSignal): Promise<string[]> => {
      throw new Error("Falha na busca");
    });

    const { result } = renderHook(() => useFetch(fetcher));

    await act(async () => {
      await result.current.execute("icasei");
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("Falha na busca");
    expect(result.current.status).toBe("error");
  });

  it("ignora a resposta de uma requisição anterior", async () => {
    let resolveFirst!: (value: string) => void;

    const firstRequest = new Promise<string>((resolve) => {
      resolveFirst = resolve;
    });

    const fetcher = vi.fn((query: string, _signal: AbortSignal): Promise<string> => {
      if (query === "primeira") {
        return firstRequest;
      }

      return Promise.resolve("segunda");
    });

    const { result } = renderHook(() => useFetch(fetcher));

    let pendingFirst!: Promise<string | undefined>;

    act(() => {
      pendingFirst = result.current.execute("primeira");
    });

    await act(async () => {
      await result.current.execute("segunda");
    });

    await act(async () => {
      resolveFirst("primeira");
      await pendingFirst;
    });

    expect(fetcher.mock.calls[0]?.[1].aborted).toBe(true);
    expect(result.current.data).toBe("segunda");
    expect(result.current.status).toBe("success");
  });

  it("cancela a requisição ao desmontar o componente", () => {
    let requestSignal: AbortSignal | undefined;

    const fetcher = vi.fn((_query: string, signal: AbortSignal) => {
      requestSignal = signal;

      return new Promise<string>(() => {});
    });

    const { result, unmount } = renderHook(() => useFetch(fetcher));

    act(() => {
      void result.current.execute("icasei");
    });

    expect(requestSignal?.aborted).toBe(false);

    unmount();

    expect(requestSignal?.aborted).toBe(true);
  });
});
