"use client";
import { useUserContext } from "@/contexts/user-context";
import React from "react";
import { Checkbox } from "../ui/checkbox";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { getInitialName } from "@/lib/utils";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "../ui/menubar";
import { CardHeader, CardTitle } from "../ui/card";
import { logout } from "@/servers/sign-out";
import { usePathname } from "next/navigation";
import { errorRoutes, publicRoutes } from "@/lib/routes-client";
import Link from "next/link";
import Image from "next/image";
import { UserPermission } from "@/servers/permission";

const Navbar = () => {
  const { user } = useUserContext();
  const pathname = usePathname();
  const shouldHideNavbar = [...publicRoutes, ...errorRoutes].includes(pathname);
  if (shouldHideNavbar) return null;
  async function handlerClickLogout() {
    await logout();
  }
  const permission = new UserPermission(user);
  return (
    <div className="bg-white w-full flex justify-between items-center">
      <div className="font-bold text-lg flex items-center gap-2">
        <Checkbox checked className="bg-theme-blue text-theme-blue" />
        Taski
      </div>
      <div className="flex items-center gap-4">
        <span className="text-theme-text-main text-sm font-semibold">{user?.name}</span>
        <Menubar className="border-0 shadow-[0px]">
          <MenubarMenu>
            <MenubarTrigger className="cursor-pointer" asChild>
              {user?.profile_picture ? (
                <div className="relative w-8 h-8 mx-auto rounded-full mr-2">
                  <Image
                    src={user?.profile_picture || "/example-image.png"}
                    alt="Profile"
                    className="rounded-full absolute"
                    style={{ objectFit: "cover" }}
                    fill
                  />
                </div>
              ) : (
                <Avatar>
                  <AvatarFallback>{getInitialName(user?.name)}</AvatarFallback>
                </Avatar>
              )}
            </MenubarTrigger>
            <MenubarContent align="center">
              <CardHeader>
                <CardTitle className="text-theme-text-main text-2xl flex items-center justify-between gap-2">
                  {user?.profile_picture ? (
                    <div className="relative w-8 h-8 mx-auto rounded-full mr-2">
                      <Image
                        src={user?.profile_picture || "/example-image.png"}
                        alt="Profile"
                        className="rounded-full absolute"
                        style={{ objectFit: "cover" }}
                        fill
                      />
                    </div>
                  ) : (
                    <Avatar>
                      <AvatarFallback>{getInitialName(user?.name)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="text-sm">
                    <p>{user?.email}</p>
                    <p className="text-theme-blue">{user?.name}</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <MenubarItem inset className="cursor-pointer pl-[.5rem]" asChild>
                <Link href={"/"}>Home Page</Link>
              </MenubarItem>
              <MenubarSeparator />
              {permission.has({ roles: ["admin"] }) && (
                <MenubarItem inset className="cursor-pointer pl-[.5rem]" asChild>
                  <Link href={"/dashboard"}>Dashboard</Link>
                </MenubarItem>
              )}

              {permission.has({ permissions: ["view:complete-tasks"] }) && (
                <MenubarItem inset className="cursor-pointer pl-[.5rem]" asChild>
                  <Link href={"/complete-tasks"}>Complete Tasks</Link>
                </MenubarItem>
              )}

              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger>Settings...</MenubarSubTrigger>
                <MenubarSubContent sideOffset={10}>
                  <MenubarItem inset className="cursor-pointer pl-[.5rem]" asChild>
                    <Link href={"/edit-profile"}>Edit Profile</Link>
                  </MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSeparator />
              <MenubarItem inset className="cursor-pointer pl-[.5rem]" onClick={handlerClickLogout}>
                Logout
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </div>
  );
};

export { Navbar };
