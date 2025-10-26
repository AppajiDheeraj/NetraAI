"use client";

import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { DataPagination } from "@/components/data-pagination";
import { SearchIcon, Download, Eye, FileText, Users } from "lucide-react";
import { useRouter } from "next/navigation";

function StatusBadge({ status }) {
  const map = {
    done: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
    review: "bg-blue-100 text-blue-800",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || "bg-muted/20 text-muted-foreground"}`}>
      {status}
    </span>
  );
}

export default function PastReportsPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const reports = useMemo(() => [
    { id: "r1", title: "Retina Scan - Left Eye", patient: "Amit Verma", doctor: "Dr. Rahul Mehta", date: "2025-10-20", status: "done", confidence: 0.92, files: 3 },
    { id: "r2", title: "Macula Check", patient: "Sana Kapoor", doctor: "Dr. Ananya Rao", date: "2025-10-18", status: "review", confidence: 0.78, files: 2 },
    { id: "r3", title: "OCT Analysis", patient: "Priya Sharma", doctor: "Dr. Vikram Singh", date: "2025-10-15", status: "pending", confidence: 0.0, files: 1 },
    { id: "r4", title: "Fundus Photo", patient: "Rahul Mehta", doctor: "Dr. Nikhil Kapoor", date: "2025-09-30", status: "done", confidence: 0.85, files: 4 },
    { id: "r5", title: "Peripheral Scan", patient: "Ananya Rao", doctor: "Dr. Sangeeta Iyer", date: "2025-09-20", status: "failed", confidence: 0.12, files: 1 },
    { id: "r6", title: "Cornea Mapping", patient: "Vikram Singh", doctor: "Dr. Arjun Patel", date: "2025-09-10", status: "done", confidence: 0.95, files: 5 },
    { id: "r7", title: "Glaucoma Suspect", patient: "Meera Joshi", doctor: "Dr. Rahul Mehta", date: "2025-08-30", status: "review", confidence: 0.66, files: 2 },
    { id: "r8", title: "Vascular Analysis", patient: "Karan Malhotra", doctor: "Dr. Priya Sharma", date: "2025-07-22", status: "done", confidence: 0.88, files: 3 },
    { id: "r9", title: "Color Fundus", patient: "Arjun Patel", doctor: "Dr. Ananya Rao", date: "2025-06-12", status: "done", confidence: 0.81, files: 2 },
    { id: "r10", title: "Anterior Segment", patient: "Sangeeta Iyer", doctor: "Dr. Vikram Singh", date: "2025-05-02", status: "pending", confidence: 0.0, files: 1 },
  ], []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reports.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      return [r.title, r.patient, r.doctor, r.id].join(" ").toLowerCase().includes(q);
    });
  }, [reports, query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const columns = useMemo(() => [
    { accessorKey: "id", header: "Report #", cell: ({ row }) => <div className="text-sm font-mono text-muted-foreground">{row.original.id}</div> },
    { accessorKey: "title", header: "Title", cell: ({ row }) => (
      <div className="flex flex-col">
        <div className="font-medium">{row.original.title}</div>
        <div className="text-xs text-muted-foreground">{row.original.files} files • {row.original.date}</div>
      </div>
    )},
    { accessorKey: "patient", header: "Patient", cell: ({ row }) => <div className="flex items-center gap-2"><Users className="size-4 opacity-80" /> <span>{row.original.patient}</span></div> },
    { accessorKey: "doctor", header: "Doctor" },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { accessorKey: "confidence", header: "Confidence", cell: ({ row }) => (
      <div className="w-36">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div style={{ width: `${Math.round((row.original.confidence || 0) * 100)}%` }} className="h-full bg-primary" />
        </div>
        <div className="text-xs text-muted-foreground mt-1">{row.original.confidence ? `${Math.round(row.original.confidence * 100)}%` : "—"}</div>
      </div>
    )},
    { accessorKey: "actions", header: "Actions", cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.push(`/reports/${row.original.id}`)}><Eye className="size-4" /></Button>
        <Button variant="outline" size="sm"><Download className="size-4" /></Button>
        <Button variant="ghost" size="sm"><FileText className="size-4" /></Button>
      </div>
    )}
  ], []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Past Reports</h2>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-card border border-border rounded-md px-3 py-1">
            <SearchIcon className="size-4 opacity-70" />
            <Input placeholder="Search reports by title, id, patient or doctor" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} className="w-80 bg-transparent border-0 px-0" />
          </div>

          <div className="flex items-center gap-2">
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="rounded-md border border-border bg-background px-3 py-1 text-sm">
              <option value="all">All</option>
              <option value="done">Done</option>
              <option value="review">Review</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <Button variant="outline" onClick={() => { /* export action */ }}>Export</Button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <DataTable data={paged} columns={columns} onRowClick={(row) => router.push(`/reports/${row.id}`)} />
        <div className="mt-4 flex justify-end">
          <DataPagination page={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
        </div>
      </div>
    </div>
  );
}
