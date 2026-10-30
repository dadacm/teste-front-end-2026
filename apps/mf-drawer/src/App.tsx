import { useState } from "react";

import type { NavigationPath } from "@icasei/contracts";

import DrawerApp from "./DrawerApp";

export default function App() {
  const [currentPath, setCurrentPath] = useState<NavigationPath>("/videos");

  return <DrawerApp currentPath={currentPath} favoritesCount={3} onNavigate={setCurrentPath} />;
}
