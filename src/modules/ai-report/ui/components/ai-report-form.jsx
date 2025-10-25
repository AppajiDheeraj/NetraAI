"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ProgressUpload from "@/components/progress-upload";

const reportSchema = z.object({
  // Make title optional so creating a report without typing a title is allowed.
  reportTitle: z.string().optional(),
  doctor: z.string().min(1, "Select a doctor"),
  patient: z.string().min(1, "Select a patient"),
  notes: z.string().optional(),
});

export function AiReportForm({ onCancel, onSuccess, onCreatePerson }) {
  const form = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      reportTitle: "",
      doctor: "",
      patient: "",
      notes: "",
    },
  });

  const [files, setFiles] = useState([]);

  const handleFilesChange = (newFiles) => setFiles(newFiles);

  const onSubmit = (values) => {
    if (files.length === 0) {
      // Allow submission even when no files are uploaded so the parent
      // flow can proceed to show the loading state and generated report.
      // Warn the user but don't block submission.
      toast.warning("No files uploaded — proceeding without files");
    }

    console.log("AI Report submitted:", { ...values, files });
    toast.success("AI Report created successfully!");
    onSuccess?.();
  };

  // Example dropdown lists
  const doctors = Array.from(
    { length: 15 },
    (_, i) => `Dr. Rahul Mehta ${i + 1}`
  );
  const patients = Array.from({ length: 20 }, (_, i) => `Patient ${i + 1}`);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          onSubmit,
          (errors) => {
            // Show a user-friendly toast for the first validation error so it's
            // obvious why the form did not submit.
            const findFirstMessage = (errObj) => {
              for (const key in errObj) {
                if (!errObj[key]) continue;
                if (errObj[key].message) return errObj[key].message;
                const nested = findFirstMessage(errObj[key]);
                if (nested) return nested;
              }
              return null;
            };

            const msg = findFirstMessage(errors) || "Please fix the form errors";
            toast.error(msg);
          }
        )}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Doctor */}
        <FormField
          name="doctor"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Doctor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {doctors.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Patient */}
        <FormField
          name="patient"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Patient</FormLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto text-sm font-normal text-primary"
                  onClick={() => {
                    if (onCreatePerson) onCreatePerson();
                    else toast.info("Create person callback not connected");
                  }}
                >
                  + Patient
                </Button>
              </div>

              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Patient" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {patients.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* File Upload */}
        <div className="md:col-span-2">
          <FormLabel>Upload Eye Images / Files</FormLabel>
          <div className="mt-2">
            <ProgressUpload
              maxFiles={8}
              accept="image/*"
              multiple
              simulateUpload={true}
              onFilesChange={handleFilesChange}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
          {onCancel && (
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">Create Report</Button>
        </div>
      </form>
    </Form>
  );
}
