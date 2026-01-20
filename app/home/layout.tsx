import GlobalSidebar from "@/components/global-sidebar";
import { ReactNode } from "react";

interface HomeLayoutProps {
  children: ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <GlobalSidebar>
      <div className="flex flex-1 flex-col">{children}</div>
    </GlobalSidebar>
  );
}