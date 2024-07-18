import {
  DrawerClose,
  DrawerContent,
  DrawerRoot,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getUserParams } from "@user/query/params";
import { UserInterface } from "@user/types";
import { NavLink } from "react-router-dom";

type MobileNavLinkProps = {
  label: string;
  link: string;
  className?: string;
};

const MobileNavLink: React.FC<MobileNavLinkProps> = ({
  label,
  link,
  className,
}) => {
  return (
    <>
      <DrawerClose asChild>
        <NavLink to={link} className={cn(className, "nav-link-mobile")}>
          {label}
        </NavLink>
      </DrawerClose>
    </>
  );
};

export function MobileDrawer() {
  const { data: user } = useQuery<UserInterface>(getUserParams());

  return (
    <DrawerRoot>
      <DrawerTrigger>
        <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 stroke-none"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
            />
          </svg>
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="pt-4 pb-1 border-gray-200">
          <div className="flex items-center px-4 gap-3">
            <div className="w-10 aspect-square rounded-full bg-gray-200 grid place-content-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 fill-slate-600"
                viewBox="0 0 16 16"
              >
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-base text-gray-800">
                {user!.name}
              </div>
              <div className="font-medium text-sm text-gray-500">
                abc's Team
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-1">
            <MobileNavLink label="Profile" link="/user/profile" />
            <MobileNavLink label="API Tokens" link="/user/api-tokens" />
            <MobileNavLink
              label="Logout"
              link="/logout"
              className="!text-rose-400 hover:!text-red-500"
            />

            <div className="border-t border-gray-200"></div>

            <div className="block px-4 py-2 text-xs text-gray-400">
              Manage Team
            </div>

            <a
              className="block w-full ps-3 pe-4 py-2 border-l-4 border-transparent text-start text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out"
              href="http://cc-gi-day.test/teams/1"
            >
              Team Settings
            </a>

            <a
              className="block w-full ps-3 pe-4 py-2 border-l-4 border-transparent text-start text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out"
              href="http://cc-gi-day.test/teams/create"
            >
              Create New Team
            </a>
          </div>
        </div>
      </DrawerContent>
    </DrawerRoot>
  );
}

const DropdownProfileMobile = () => {
  return (
    <>
      <MobileDrawer />
    </>
  );
};

export default DropdownProfileMobile;
