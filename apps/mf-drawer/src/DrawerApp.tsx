import type { DrawerProps } from "@icasei/contracts";

import { Drawer } from "./components/Drawer";

export default function DrawerApp(props: DrawerProps) {
  return <Drawer {...props} />;
}
