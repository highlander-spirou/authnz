import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getUserParams } from "@user/query/params";
import { UserInterface } from "@user/types";
import React from "react";
import { Link } from "react-router-dom";

type DropDownLinkProps = {
  link: string;
  label: string;
  className?: string;
};

const DropDownLink: React.FC<DropDownLinkProps> = ({
  label,
  link,
  className,
}) => {
  return (
    <>
      <NavigationMenuLink asChild>
        <Link
          to={link}
          className={cn(
            "block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out",
            className
          )}
        >
          {label}
        </Link>
      </NavigationMenuLink>
    </>
  );
};

const DropdownProfile = () => {
  const { data: user } = useQuery<UserInterface>(getUserParams());

  return (
    <>
      <NavigationMenu delayDuration={2000}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="btn-dropdown">
              abc's Team
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid bg-white w-48 rounded-md ring-1 ring-black ring-opacity-5 py-1">
                <div className="block px-4 py-2 text-xs text-gray-400">
                  Manage Team
                </div>
                <DropDownLink label="Team Settings" link="" />
                <DropDownLink label="Create New Team" link="" />
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="btn-dropdown">
              {user!.name}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid bg-white w-48 rounded-md ring-1 ring-black ring-opacity-5 py-1">
                <div className="dropdown-group-label">Manage Account</div>
                <DropDownLink label="Profile" link="/user/profile" />
                <DropDownLink label="API Token" link="" />
                <DropDownLink
                  label="Logout"
                  link=""
                  className="font-medium text-red-400 hover:text-red-500"
                />
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
};

export default DropdownProfile;
