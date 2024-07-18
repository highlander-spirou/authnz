import React from "react";
import { Drawer } from "vaul";

export const DrawerRoot = ({
  direction = "left",
  ...props
}: React.ComponentProps<typeof Drawer.Root>) => (
  <Drawer.Root direction={direction} {...props} />
);

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

export const DrawerClose = ({
  ...props
}: React.ComponentProps<typeof Drawer.Close>) => <Drawer.Close {...props} />;
