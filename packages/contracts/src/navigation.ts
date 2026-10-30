export type NavigationPath = "/videos" | "/favorites";

export interface DrawerProps {
  currentPath: NavigationPath;
  favoritesCount: number;
  onNavigate: (path: NavigationPath) => void;
}
