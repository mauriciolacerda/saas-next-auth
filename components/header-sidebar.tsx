"use client";

import { Separator } from "@radix-ui/react-dropdown-menu";
import { SidebarTrigger } from "./ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "./ui/breadcrumb";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export function HeaderSidebar() {
  const pathname = usePathname();
  const pathnames = pathname.split("/").filter((x) => x);
  return (
    <header className="flex h-16 shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Início</BreadcrumbLink>
            </BreadcrumbItem>
            {pathnames.length > 0 && (<ChevronRight className="h-4 w-4" />)}
            {pathnames.map((value, index) => {
              const href = `/${pathnames.slice(0, index + 1).join("/")}`;
              const isLast = index === pathnames.length - 1;
              return (
                <BreadcrumbItem key={href}>
                  <BreadcrumbLink href={href}>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </BreadcrumbLink>
                  {!isLast && <ChevronRight className="mx-2 h-4" />}
                </BreadcrumbItem>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
