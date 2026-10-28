
import type { MouseEvent } from "react";

import type {
  DrawerProps,
  NavigationPath,
} from "@icasei/contracts";

export default function DrawerApp({
  currentPath,
  favoritesCount,
  onNavigate,
}: DrawerProps) {
  function handleNavigate(
    event: MouseEvent<HTMLAnchorElement>,
    path: NavigationPath
  ) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    onNavigate(path);
  }

  return (
    <aside>
      <h2>MF_DRAWER</h2>

      <nav aria-label="Navegação principal">
        <ul>
          <li>
            <a
              href="/videos"
              aria-current={
                currentPath === "/videos"
                  ? "page"
                  : undefined
              }
              onClick={(event) =>
                handleNavigate(event, "/videos")
              }
            >
              Vídeos
            </a>
          </li>

          <li>
            <a
              href="/favorites"
              aria-current={
                currentPath === "/favorites"
                  ? "page"
                  : undefined
              }
              onClick={(event) =>
                handleNavigate(event, "/favorites")
              }
            >
              Favoritos ({favoritesCount})
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
