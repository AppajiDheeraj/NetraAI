import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { GeneratedAvatar } from "@/components/generated-avtar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

export const DashboardUserButton = () => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const onLogout = () => {};

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden gap-x-1/2">
          {/* {data.user.image ? (
                        <Avatar className="size-9 mr-3">
                            <AvatarImage src="" />
                        </Avatar>
                    ) : (
                        <GeneratedAvatar
                            seed=""
                            variant="initials"
                            className="size-9 mr-3"
                        />
                    )} */}
          <GeneratedAvatar seed="" variant="initials" className="size-9 mr-3" />
          <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
            <p className="text-sm truncate w-full">"{data.user.name}"</p>
            <p className="text-xs truncate w-full">"{data.user.email}"</p>
          </div>
          <ChevronDownIcon className="size-4 shrink-0" />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>data</DrawerTitle>
            <DrawerDescription>data</DrawerDescription>
            <DrawerFooter>
              <Button variant="outline">
                <CreditCardIcon className="size-4 text-black" />
                Billing
              </Button>
              <Button onClick={onLogout}>
                <LogOutIcon className="size-4 text-white" />
                Logout
              </Button>
            </DrawerFooter>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden gap-x-2">
        {/* {data.user.image ? (
          <Avatar className="size-9 mr-3">
            <AvatarImage src="data" />
          </Avatar>
        ) : ( */}
          <GeneratedAvatar
            seed="data"
            variant="initials"
            className="size-9 mr-3"
          />
        <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
          <p className="text-sm truncate w-full">data</p>
          <p className="text-xs truncate w-full">data</p>
        </div>
        <ChevronDownIcon className="size-4 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" className="w-72 p-2 m-2">
        <div className="flex flex-col gap-1">
          <span className="font-medium truncate">data</span>
          <span className="text-sm font-normal text-muted-foreground truncate">
            data
          </span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer flex items-center justify-between">
          Billing
          <CreditCardIcon className="size-4" />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer flex items-center justify-between"
          onClick={onLogout}
        >
          Logout
          <LogOutIcon className="size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
