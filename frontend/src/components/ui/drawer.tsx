import React from "react";
import { Drawer } from "vaul";

type DrawerRootProps = {
  direction?: "top" | "bottom" | "right" | "left";
  children: React.ReactNode;
};

export const DrawerRoot: React.FC<DrawerRootProps> = ({
  direction = "left",
  children,
}) => {
  return <Drawer.Root direction={direction}>{children}</Drawer.Root>;
};

export const DrawerTrigger = ({ children }) => {
  return <Drawer.Trigger asChild>{children}</Drawer.Trigger>;
};

export const DrawerContent = ({ children }) => {
  return (
    <Drawer.Portal>
      <Drawer.Overlay className="fixed inset-0 bg-black/40 w-full" />
      <Drawer.Content className="bg-white flex flex-col rounded-r-[10px] h-full w-4/5 mt-24 fixed bottom-0 left-0">
        {children}
      </Drawer.Content>
    </Drawer.Portal>
  );
};
