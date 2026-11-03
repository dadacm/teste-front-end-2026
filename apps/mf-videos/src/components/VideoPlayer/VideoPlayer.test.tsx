import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { VideoPlayer } from "./VideoPlayer";

const video = {
  id: "abc123",
  title: "Aprendendo TypeScript",
  channelTitle: "Canal Front-end",
};

describe("VideoPlayer", () => {
  it("deve renderizar o título e o canal", () => {
    render(<VideoPlayer video={video} onClose={vi.fn()} />);

    expect(
      screen.getByRole("region", {
        name: "Reprodutor de vídeo",
      }),
    ).toBeDefined();

    expect(
      screen.getByRole("heading", {
        name: video.title,
      }),
    ).toBeDefined();

    expect(screen.getByText(video.channelTitle)).toBeDefined();
  });

  it("deve configurar corretamente o iframe do YouTube", () => {
    render(<VideoPlayer video={video} onClose={vi.fn()} />);

    const iframe = screen.getByTitle(`Reproduzindo: ${video.title}`);

    expect(iframe.getAttribute("src")).toBe(`https://www.youtube.com/embed/${video.id}`);

    expect(iframe.hasAttribute("allowfullscreen")).toBe(true);

    expect(iframe.getAttribute("referrerpolicy")).toBe("strict-origin-when-cross-origin");
  });

  it("deve executar onClose ao clicar no botão de fechar", () => {
    const onClose = vi.fn();

    render(<VideoPlayer video={video} onClose={onClose} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Fechar vídeo",
      }),
    );

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("deve atualizar o iframe ao trocar de vídeo", () => {
    const { rerender } = render(<VideoPlayer video={video} onClose={vi.fn()} />);

    const nextVideo = {
      id: "xyz789",
      title: "React avançado",
      channelTitle: "Outro canal",
    };

    rerender(<VideoPlayer video={nextVideo} onClose={vi.fn()} />);

    const iframe = screen.getByTitle(`Reproduzindo: ${nextVideo.title}`);

    expect(iframe.getAttribute("src")).toBe("https://www.youtube.com/embed/xyz789");

    expect(screen.queryByTitle(`Reproduzindo: ${video.title}`)).toBeNull();
  });
});
