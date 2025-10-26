"use client"

import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from "lucide-react"
import { DashboardCommand } from "./dashboard-command"
import { useEffect, useState } from "react"

/* Restore search bar and layout visibility */
export const DashboardNav = () => {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
      <header className="flex px-4 gap-x-2 items-center py-3 border-b bg-sidebar text-sidebar-foreground">
        <Button
          className="size-9 text-black/75 hover:bg-transparent"
          variant="outline"
          onClick={toggleSidebar}
        >
          {(state === "collapsed" || isMobile)
            ? <PanelLeftIcon className="size-4 text-black/75" />
            : <PanelLeftCloseIcon className="size-4 text-black/75" />}
        </Button>
        <Button
          className="h-9 w-60 justify-start font-normal text-black/75 hover:bg-transparent"
          variant="outline"
          size="sm"
          onClick={() => {
            setCommandOpen(true);
          }}
        >
          <SearchIcon className="size-4 text-black/75" />
          <span className="text-black/75">Search</span>
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">
              &#8984;
            </span>
            K
          </kbd>
        </Button>
      </header>
    </>
  );
};
