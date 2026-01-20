"use client";

import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppSidebar } from "./app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";

interface HomeSidebarProps {
  children: ReactNode;
}

export default function GlobalSidebar({ children }: HomeSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const segments = pathname.split("/").filter(Boolean);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <h6 className="text-lg font-bold">Resume Tweaker</h6>
            {/* <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            /> */}
            {/* <Breadcrumb>
              <BreadcrumbList>
                {segments.map((segment, index) => {
                  const href = "/" + segments.slice(0, index + 1).join("/");
                  const label =
                    segment.charAt(0).toUpperCase() + segment.slice(1);
                  const isLast = index === segments.length - 1;
                  return (
                    <span key={href} className="flex items-center">
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage>{label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator className="mx-1" />}
                    </span>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb> */}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
