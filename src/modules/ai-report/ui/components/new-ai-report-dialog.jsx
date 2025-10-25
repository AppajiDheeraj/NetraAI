"use client";

import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AiReportForm } from "./ai-report-form";

export function NewAiReportDialog({
  open,
  onOpenChange,
  onCreatePerson,
  onSuccess, // ✅ get the parent callback
}) {
  return (
    <ResponsiveDialog
      title="New AI Report"
      description="Upload eye images and generate AI analysis report."
      open={open}
      onOpenChange={onOpenChange}
    >
      <AiReportForm
        onSuccess={() => {
          // ✅ first close the dialog
          onOpenChange(false);

          // ✅ then trigger the parent handler
          if (typeof onSuccess === "function") {
            onSuccess();
          } else {
            console.warn("onSuccess not passed to NewAiReportDialog");
          }
        }}
        onCancel={() => {
          onOpenChange(false);
        }}
        onCreatePerson={onCreatePerson}
      />
    </ResponsiveDialog>
  );
}
