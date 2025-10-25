"use client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import ProgressUpload from "./progress-upload";

export function SignUpForm({ className, ...props }) {

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your details below to get started
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" name="name" placeholder="Name" required />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" name="password" type="password" required />
        </Field>

        <Field>
            <FieldLabel htmlFor="License">License-Key</FieldLabel>
            <ProgressUpload />
        </Field>

        <Field>
          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </Field>

        <FieldSeparator></FieldSeparator>

        <Field>

          <FieldDescription className="text-center">
            Already have an account?{" "}
            <a
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign in
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
