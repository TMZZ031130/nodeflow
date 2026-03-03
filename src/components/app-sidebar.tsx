"use client";

import {
  JoystickIcon,
  KeyIcon,
  LogOutIcon,
  FolderOpenIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

const menuItems = [
  {
    title: "Workflows",
    url: "/workflows",
    icon: FolderOpenIcon,
  },
  {
    title: "Credentials",
    url: "/credentials",
    icon: KeyIcon,
  },
  {
    title: "Executions",
    url: "/executions",
    icon: JoystickIcon,
  },
];

export const AppSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuButton asChild className="gap-x-4 h-12 px-4">
          <Link href="/workflows" prefetch>
            <Image src="logo.svg" alt="NodeBase" width={32} height={32} />
            <span className="text-sm font-semibold">NodeBase</span>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((menuItem) => (
                <SidebarMenuItem key={menuItem.title}>
                  <SidebarMenuButton
                    tooltip={menuItem.title}
                    isActive={
                      menuItem.url === "/"
                        ? pathname === "/"
                        : pathname.startsWith(menuItem.url)
                    }
                    asChild
                    className="gap-x-4 h-10 px-4"
                  >
                    <Link href={menuItem.url} prefetch>
                      <menuItem.icon className="size-4" />
                      <span>{menuItem.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign Out"
              asChild
              className="gap-x-4 h-10 px-4"
              onClick={() =>
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push("/login");
                    },
                  },
                })
              }
            >
              <Link href="/login" prefetch>
                <LogOutIcon className="h-4 w-4" />
                <span>Sign Out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
