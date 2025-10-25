"use client";

import {
  CommandResponsiveDialog,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";
import { useState } from "react";

export const DashboardCommand = ({ open, setOpen }) => {
  const [search, setSearch] = useState("");

  return (
    <CommandResponsiveDialog shouldFilter={false} open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Find a meeting or agent..."
        value={search}
        onValueChange={(value) => setSearch(value)}
      />
      <CommandList>
        <CommandGroup heading="Meetings">
          <CommandEmpty>
            <span className="text-muted-foreground text-sm">No meetings found</span>
          </CommandEmpty>
          {/* Removed dynamic functionality */}
        </CommandGroup>

        <CommandGroup heading="Agents">
          <CommandEmpty>
            <span className="text-muted-foreground text-sm">No agents found</span>
          </CommandEmpty>
          {/* Removed dynamic functionality */}
        </CommandGroup>
      </CommandList>
    </CommandResponsiveDialog>
  );
};
