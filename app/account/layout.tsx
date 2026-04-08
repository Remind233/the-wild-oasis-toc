import { ReactNode } from "react";
import SideNavigation from "../_components/SideNavigation";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] h-full gap-8 md:gap-12">
      <SideNavigation />
      <div className="py-1">{children}</div>
    </div>
  );
}
