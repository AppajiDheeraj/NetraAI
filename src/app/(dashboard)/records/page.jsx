"use client";

import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BellIcon, SearchIcon } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { DataPagination } from "@/components/data-pagination";
import { useRouter } from "next/navigation";

// Simple records page showing people, search, and pagination
export default function RecordsPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Mock people data — in real app this would come from API
  const people = useMemo(() => [
    { id: 1, name: "Amit Verma", dob: "1985-06-12", gender: "Male", phone: "9876543210", email: "amit.verma@example.com", address: "12 MG Road, Mumbai" },
    { id: 2, name: "Sana Kapoor", dob: "1990-02-28", gender: "Female", phone: "9123456780", email: "sana.kapoor@example.com", address: "45 Park Street, Delhi" },
    { id: 3, name: "Rahul Mehta", dob: "1978-11-05", gender: "Male", phone: "9988776655", email: "rahul.mehta@example.com", address: "7 Green Avenue, Bengaluru" },
    { id: 4, name: "Priya Sharma", dob: "1992-09-17", gender: "Female", phone: "9012345678", email: "priya.sharma@example.com", address: "101 Main St, Chennai" },
    { id: 5, name: "Vikram Singh", dob: "1980-04-22", gender: "Male", phone: "9090909090", email: "vikram.singh@example.com", address: "88 Lotus Rd, Pune" },
    { id: 6, name: "Ananya Rao", dob: "1988-12-30", gender: "Female", phone: "9445566778", email: "ananya.rao@example.com", address: "56 River Lane, Hyderabad" },
    { id: 7, name: "Nikhil Kapoor", dob: "1975-07-09", gender: "Male", phone: "9112233445", email: "nikhil.kapoor@example.com", address: "22 Hilltop, Kolkata" },
    { id: 8, name: "Sangeeta Iyer", dob: "1983-03-03", gender: "Female", phone: "9887766554", email: "sangeeta.iyer@example.com", address: "9 East End, Ahmedabad" },
    { id: 9, name: "Arjun Patel", dob: "1995-01-20", gender: "Male", phone: "9776655443", email: "arjun.patel@example.com", address: "33 Seaside, Goa" },
    { id: 10, name: "Meera Joshi", dob: "1991-05-06", gender: "Female", phone: "9665544332", email: "meera.joshi@example.com", address: "14 North St, Surat" },
    { id: 11, name: "Karan Malhotra", dob: "1986-08-14", gender: "Male", phone: "9554433221", email: "karan.malhotra@example.com", address: "70 Central Ave, Lucknow" },
  ], []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return people;
    return people.filter((p) =>
      [p.name, p.email, p.phone, p.address]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [people, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const columns = useMemo(() => [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "dob", header: "DOB" },
    { accessorKey: "gender", header: "Gender" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "address", header: "Address" },
  ], []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">People / Records</h2>

        <div className="flex items-center gap-3">
          {/* Search control styled like dashboard search (no hover color change, includes kbd hint) */}
          <div className="h-9 w-80 flex items-center gap-2 rounded-md border border-border bg-card px-3 text-black/75 hover:bg-transparent hover:text-black/75">
            <SearchIcon className="size-4 text-black/75" />
            <Input
              placeholder="Search people by name, email, phone or address"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="w-full bg-transparent border-0 px-0 text-sm text-black/75"
            />
            <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">&#8984;</span>
              K
            </kbd>
          </div>

          <Button variant="ghost" className="relative text-black/75 hover:bg-transparent hover:text-black/75">
            <BellIcon className="size-5 text-black/75" />
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-destructive text-white text-xs w-5 h-5">3</span>
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
  <DataTable data={paged} columns={columns} onRowClick={(row) => router.push(`/records/${row.id}`)} />
        <div className="mt-4 flex justify-end">
          <DataPagination page={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
        </div>
      </div>
    </div>
  );
}
