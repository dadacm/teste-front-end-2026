import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { VideoList } from "./VideoList";

const videos = [
  {
    id: "video-1",
    title: "Primeiro vídeo",
    channelTitle: "Canal A",
    thumbnailUrl: "https://example.com/video-1.jpg",
  },
  {
    id: "video-2",
    title: "Segundo vídeo",
    channelTitle: "Canal B",
    thumbnailUrl: "https://example.com/video-2.jpg",
  },
];

describe("VideoList", () => {
  it("deve renderizar a lista de vídeos", () => {
    render(<VideoList videos={videos} label="Resultados da pesquisa" onPlay={vi.fn()} />);

    expect(
      screen.getByRole("region", {
        name: "Resultados da pesquisa",
      }),
    ).toBeDefined();

    expect(screen.getByText("Primeiro vídeo")).toBeDefined();
    expect(screen.getByText("Segundo vídeo")).toBeDefined();

    expect(screen.getByText("Canal A")).toBeDefined();
    expect(screen.getByText("Canal B")).toBeDefined();
  });

  it("deve executar onPlay ao clicar em reproduzir", () => {
    const handlePlay = vi.fn();

    render(<VideoList videos={videos} label="Lista de vídeos" onPlay={handlePlay} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Reproduzir Primeiro vídeo",
      }),
    );

    expect(handlePlay).toHaveBeenCalledOnce();
    expect(handlePlay).toHaveBeenCalledWith(videos[0]);
  });

  it("deve permitir adicionar um vídeo aos favoritos", () => {
    const handleToggleFavorite = vi.fn();

    render(
      <VideoList
        videos={videos}
        label="Lista de vídeos"
        onPlay={vi.fn()}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={() => false}
      />,
    );

    const favoriteButton = screen.getByRole("button", {
      name: "Adicionar Primeiro vídeo aos favoritos",
    });

    expect(favoriteButton.getAttribute("aria-pressed")).toBe("false");

    fireEvent.click(favoriteButton);

    expect(handleToggleFavorite).toHaveBeenCalledWith(videos[0]);
  });

  it("deve identificar quando um vídeo já é favorito", () => {
    render(
      <VideoList
        videos={videos}
        label="Lista de favoritos"
        onPlay={vi.fn()}
        onToggleFavorite={vi.fn()}
        isFavorite={(video) => video.id === "video-1"}
      />,
    );

    const favoriteButton = screen.getByRole("button", {
      name: "Remover Primeiro vídeo dos favoritos",
    });

    expect(favoriteButton.getAttribute("aria-pressed")).toBe("true");

    expect(
      screen.getByRole("button", {
        name: "Adicionar Segundo vídeo aos favoritos",
      }),
    ).toBeDefined();
  });

  it("deve desabilitar o botão do vídeo em carregamento", () => {
    render(
      <VideoList
        videos={videos}
        label="Lista de vídeos"
        onPlay={vi.fn()}
        onToggleFavorite={vi.fn()}
        isFavorite={() => false}
        favoriteLoadingId="video-1"
      />,
    );

    const loadingButton = screen.getByRole("button", {
      name: "Adicionar Primeiro vídeo aos favoritos",
    });

    const otherButton = screen.getByRole("button", {
      name: "Adicionar Segundo vídeo aos favoritos",
    });

    expect(loadingButton.hasAttribute("disabled")).toBe(true);

    expect(loadingButton.getAttribute("aria-busy")).toBe("true");

    expect(otherButton.hasAttribute("disabled")).toBe(false);
  });

  it("deve bloquear as ações de favoritos quando desabilitadas", () => {
    const handleToggleFavorite = vi.fn();

    render(
      <VideoList
        videos={videos}
        label="Lista de vídeos"
        onPlay={vi.fn()}
        onToggleFavorite={handleToggleFavorite}
        disableFavoriteActions
      />,
    );

    const favoriteButton = screen.getByRole("button", {
      name: "Adicionar Primeiro vídeo aos favoritos",
    });

    expect(favoriteButton.hasAttribute("disabled")).toBe(true);

    fireEvent.click(favoriteButton);

    expect(handleToggleFavorite).not.toHaveBeenCalled();
  });

  it("não deve exibir botões de favoritos sem onToggleFavorite", () => {
    render(<VideoList videos={videos} label="Lista de vídeos" onPlay={vi.fn()} />);

    expect(
      screen.queryByRole("button", {
        name: /aos favoritos/i,
      }),
    ).toBeNull();

    expect(
      screen.getByRole("button", {
        name: "Reproduzir Primeiro vídeo",
      }),
    ).toBeDefined();
  });
});
