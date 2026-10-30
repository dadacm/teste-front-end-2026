import type { DrawerProps } from "@icasei/contracts";
import "./index.css";
import { Drawer } from "./components/Drawer";

export default function DrawerApp(props: DrawerProps) {
  return <Drawer {...props} />;
}
