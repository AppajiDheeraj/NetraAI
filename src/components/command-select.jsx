import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CommandList,
  CommandResponsiveDialog,
  CommandInput,
  CommandEmpty,
  CommandItem,
} from "./ui/command";

export const CommandSelect = ({
  options,
  onSelect,
  onSearch,
  value,
  placeholder = "Select an option",
  className = "",
  isSearchable = true,
}) => {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.id === value);

  const handleOpenChange = (open) => {
    if (onSearch) onSearch("");
    setOpen(open);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        type="button"
        variant="outline"
        className={cn(
          "h-9 flex justify-between font-normal px-2",
          !selectedOption && "text-muted-foreground",
          className
        )}
      >
        <div>{selectedOption?.children ?? placeholder}</div>
        <ChevronsUpDownIcon />
      </Button>

      <CommandResponsiveDialog
        shouldFilter={!onSearch}
        open={open}
        onOpenChange={handleOpenChange}
      >
        {isSearchable && (
          <CommandInput placeholder="Search..." onValueChange={onSearch} />
        )}
        <CommandList>
          <CommandEmpty>
            <span className="text-muted-foreground text-sm">
              No options found
            </span>
          </CommandEmpty>

          {options.map((option) => (
            <CommandItem
              key={option.id}
              onSelect={() => {
                onSelect(option.value);
                setOpen(false);
              }}
            >
              {option.children}
            </CommandItem>
          ))}
        </CommandList>
      </CommandResponsiveDialog>
    </>
  );
};
