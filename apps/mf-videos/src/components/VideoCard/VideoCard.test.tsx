import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { VideoCard } from "./VideoCard";

const video = {
  id: "video-123",
  title: "Introdução ao React",
  channelTitle: "Canal de Tecnologia",
  thumbnailUrl: "https://example.com/react.jpg",
};

describe("VideoCard", () => {
  it("deve renderizar as informações do vídeo", () => {
    const { container } = render(<VideoCard video={video} onPlay={vi.fn()} />);

    expect(
      screen.getByRole("heading", {
        name: "Introdução ao React",
      }),
    ).toBeDefined();

    expect(screen.getByText("Canal de Tecnologia")).toBeDefined();

    const thumbnail = container.querySelector("img");

    expect(thumbnail?.getAttribute("src")).toBe(video.thumbnailUrl);
  });

  it("deve executar onPlay ao clicar em reproduzir", () => {
    const onPlay = vi.fn();

    render(<VideoCard video={video} onPlay={onPlay} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Reproduzir Introdução ao React",
      }),
    );

    expect(onPlay).toHaveBeenCalledOnce();
    expect(onPlay).toHaveBeenCalledWith(video);
  });

  it("não deve renderizar a ação de favorito quando não informada", () => {
    render(<VideoCard video={video} onPlay={vi.fn()} />);

    expect(
      screen.queryByRole("button", {
        name: /favoritos/i,
      }),
    ).toBeNull();
  });

  it("deve permitir adicionar um vídeo aos favoritos", () => {
    const onPlay = vi.fn();
    const onToggleFavorite = vi.fn();

    render(<VideoCard video={video} onPlay={onPlay} onToggleFavorite={onToggleFavorite} />);

    const favoriteButton = screen.getByRole("button", {
      name: "Adicionar Introdução ao React aos favoritos",
    });

    expect(favoriteButton.getAttribute("aria-pressed")).toBe("false");

    fireEvent.click(favoriteButton);

    expect(onToggleFavorite).toHaveBeenCalledOnce();
    expect(onToggleFavorite).toHaveBeenCalledWith(video);
    expect(onPlay).not.toHaveBeenCalled();
  });

  it("deve identificar um vídeo já favoritado", () => {
    const onToggleFavorite = vi.fn();

    render(
      <VideoCard video={video} onPlay={vi.fn()} onToggleFavorite={onToggleFavorite} isFavorite />,
    );

    const favoriteButton = screen.getByRole("button", {
      name: "Remover Introdução ao React dos favoritos",
    });

    expect(favoriteButton.getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(favoriteButton);

    expect(onToggleFavorite).toHaveBeenCalledWith(video);
  });

  it("deve bloquear o botão durante o carregamento", () => {
    const onToggleFavorite = vi.fn();

    render(
      <VideoCard
        video={video}
        onPlay={vi.fn()}
        onToggleFavorite={onToggleFavorite}
        isFavoriteLoading
      />,
    );

    const favoriteButton = screen.getByRole("button", {
      name: "Adicionar Introdução ao React aos favoritos",
    });

    expect(favoriteButton.hasAttribute("disabled")).toBe(true);
    expect(favoriteButton.getAttribute("aria-busy")).toBe("true");

    fireEvent.click(favoriteButton);

    expect(onToggleFavorite).not.toHaveBeenCalled();
  });

  it("deve respeitar isFavoriteDisabled", () => {
    const onToggleFavorite = vi.fn();

    render(
      <VideoCard
        video={video}
        onPlay={vi.fn()}
        onToggleFavorite={onToggleFavorite}
        isFavoriteDisabled
      />,
    );

    const favoriteButton = screen.getByRole("button", {
      name: "Adicionar Introdução ao React aos favoritos",
    });

    expect(favoriteButton.hasAttribute("disabled")).toBe(true);

    fireEvent.click(favoriteButton);

    expect(onToggleFavorite).not.toHaveBeenCalled();
  });
});
