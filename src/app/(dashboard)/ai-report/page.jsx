"use client";

import { useState } from "react";
import { NewAiReportDialog } from "@/modules/ai-report/ui/components/new-ai-report-dialog";
import { NewPersonDialog } from "@/modules/ai-report/ui/components/new-person-dialog";

export default function AiReportPage() {
  const [openReport, setOpenReport] = useState(false);
  const [openPerson, setOpenPerson] = useState(false);

  return (
    <div className="p-8 space-y-6">
      <button
        onClick={() => setOpenReport(true)}
        className="px-4 py-2 rounded-md bg-primary text-white"
      >
        + Create New AI Report
      </button>

      <NewAiReportDialog
        open={openReport}
        onOpenChange={setOpenReport}
        onCreatePerson={() => setOpenPerson(true)}
      />

      <NewPersonDialog
        open={openPerson}
        onOpenChange={setOpenPerson}
      />
    </div>
  );
}
