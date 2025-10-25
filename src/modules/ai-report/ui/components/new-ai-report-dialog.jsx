"use client";

import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AiReportForm } from "./ai-report-form";

export function NewAiReportDialog({ open, onOpenChange, onCreatePerson }) {
  return (
    <ResponsiveDialog
      title="New AI Report"
      description="Upload eye images and generate AI analysis report."
      open={open}
      onOpenChange={onOpenChange}
    >
      <AiReportForm
        onSuccess={() => {
          onOpenChange(false);
        }}
        onCancel={() => {
          onOpenChange(false);
        }}
        onCreatePerson={onCreatePerson}
      />
    </ResponsiveDialog>
  );
}
