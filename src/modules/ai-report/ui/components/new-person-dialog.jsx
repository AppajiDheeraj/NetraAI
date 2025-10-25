"use client";

import { ResponsiveDialog } from "@/components/responsive-dialog";
import { PersonForm } from "./person-form";

export function NewPersonDialog({ open, onOpenChange }) {
  return (
    <ResponsiveDialog
      title="New Person"
      description="Fill in the personal details"
      open={open}
      onOpenChange={onOpenChange}
    >
      <PersonForm
        onSuccess={() => {
          onOpenChange(false);
        }}
        onCancel={() => {
          onOpenChange(false);
        }}
      />
    </ResponsiveDialog>
  );
}
