"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ✅ Validation Schema
const personSchema = z.object({
  firstName: z.string().min(2, "First name required"),
  lastName: z.string().min(2, "Last name required"),
  dob: z.date({ required_error: "Date of birth required" }),
  gender: z.string().min(1, "Gender required"),
  phone: z.string().min(10, "Enter valid phone number"),
  email: z.string().email("Invalid email"),
  contactPerson: z.string().min(2, "Contact person required"),
  contactPhone: z.string().min(10, "Enter valid contact number"),
  addressLine1: z.string().min(3, "Address line required"),
  addressLine2: z.string().optional(),
  aadhar: z
    .string()
    .min(12, "Aadhaar must be 12 digits")
    .max(12, "Aadhaar must be 12 digits"),
});

export function PersonForm({ onSuccess, onCancel }) {
  const form = useForm({
    resolver: zodResolver(personSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dob: undefined,
      gender: "",
      phone: "",
      email: "",
      contactPerson: "",
      contactPhone: "",
      addressLine1: "",
      addressLine2: "",
      aadhar: "",
    },
  });

  const onSubmit = (values) => {
    console.log("Submitted:", values);
    toast.success("Form submitted successfully!");
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* First + Last Name */}
        <FormField
          name="firstName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="lastName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* DOB + Gender */}
        <FormField
          name="dob"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      data-empty={!field.value}
                      className={cn(
                        "data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="gender"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone + Email */}
        <FormField
          name="phone"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="9876543210" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email ID</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="example@email.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Contact Person + Phone */}
        <FormField
          name="contactPerson"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Person of Contact</FormLabel>
              <FormControl>
                <Input placeholder="Contact person's name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="contactPhone"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Person Phone</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="9876543210" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address */}
        <FormField
          name="addressLine1"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 1</FormLabel>
              <FormControl>
                <Input placeholder="Street, locality" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="addressLine2"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 2</FormLabel>
              <FormControl>
                <Input placeholder="City, State, Pincode" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Aadhaar */}
        <div className="md:col-span-2 flex gap-2 items-end">
          <FormField
            name="aadhar"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Aadhaar Number</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    maxLength={12}
                    placeholder="Enter 12-digit Aadhaar"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            className="mt-1"
            onClick={() => toast.info("Aadhaar verification not connected yet")}
          >
            Verify
          </Button>
        </div>

        {/* Buttons */}
        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
          {onCancel && (
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
