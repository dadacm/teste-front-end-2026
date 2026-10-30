import type { MouseEvent } from "react";
import { Clapperboard, Heart, PlayCircle } from "lucide-react";

import type { DrawerProps, NavigationPath } from "@icasei/contracts";

export function Drawer({
  currentPath,
  favoritesCount,
  onNavigate,
}: DrawerProps) {
  function handleNavigate(
    event: MouseEvent<HTMLAnchorElement>,
    path: NavigationPath,
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

  const navigationItems = [
    {
      path: "/videos",
      label: "Vídeos",
      icon: Clapperboard,
    },
    {
      path: "/favorites",
      label: `Favoritos (${favoritesCount})`,
      icon: Heart,
    },
  ] as const;

  return (
    <aside className="w-full bg-sidebar p-4 md:min-h-screen md:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-brand">
          <PlayCircle
            size={22}
            className="text-background"
            aria-hidden="true"
          />
        </div>

        <div>
          <h2 className="text-lg font-bold text-text-primary">iCaseiHub</h2>

          <p className="text-xs text-brand">Icasei Vídeos</p>
        </div>
      </div>

      <nav aria-label="Navegação principal">
        <ul className="flex list-none gap-2 p-0 md:flex-col">
          {navigationItems.map((item) => {
            const isActive = currentPath === item.path;
            const Icon = item.icon;

            return (
              <li key={item.path} className="min-w-0">
                <a
                  href={item.path}
                  aria-current={isActive ? "page" : undefined}
                  onClick={(event) => handleNavigate(event, item.path)}
                  className={`
                    flex items-center gap-3
                    rounded-xl px-4 py-3
                    text-sm font-medium
                    transition-colors
                    focus-visible:outline-2
                    focus-visible:outline-offset-2
                    focus-visible:outline-brand
                    ${
                      isActive
                        ? "bg-surface-hover text-brand"
                        : "text-text-secondary hover:bg-surface hover:text-text-primary"
                    }
                  `}
                >
                  <Icon size={19} aria-hidden="true" className="shrink-0" />

                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
