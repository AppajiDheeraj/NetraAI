"use client";

// ✅ 1. Import useState and the necessary UI components
import { useState } from "react";
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
import { CheckCircle2, Loader2 } from "lucide-react"; // ✅ Import icons for feedback

export function SignUpForm({ className, ...props }) {
  // ✅ 2. Add state to manage verification
  const [hfrId, setHfrId] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("unverified"); // 'unverified', 'verifying', 'verified', 'failed'
  const [verifiedClinicName, setVerifiedClinicName] = useState("");

  // ✅ 3. Create the handler function to call the API
  const handleVerifyLicense = async () => {
    if (!hfrId) {
      toast.error("Please enter a License Key (HFR ID).");
      return;
    }
    setVerificationStatus("verifying");

    try {
      const response = await fetch("/api/verify-clinic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hfrId }),
      });

      const result = await response.json();

      if (response.ok) {
        setVerificationStatus("verified");
        setVerifiedClinicName(result.clinic.name); // Store the clinic name
        toast.success(`Clinic Verified: ${result.clinic.name}`);
      } else {
        setVerificationStatus("failed");
        toast.error(result.message || "Invalid License Key.");
      }
    } catch (error) {
      setVerificationStatus("failed");
      toast.error("An error occurred during verification.");
      console.error(error);
    }
  };
  
  const handleFormSubmit = (event) => {
    event.preventDefault();
    // You can now submit all form data, including the verified hfrId
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    console.log("Creating account with:", { ...data, hfrId });
    toast.success("Account creation form submitted!");
  }

  const isVerified = verificationStatus === "verified";
  const isVerifying = verificationStatus === "verifying";

  return (
    // Improved layout: constrained width, centered, single-column for predictable rendering
    <form
      onSubmit={handleFormSubmit}
      className={cn("w-full max-w-3xl mx-auto p-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-start gap-1 text-left">
          <h1 className="text-2xl font-bold">Create a Clinic Account</h1>
          <p className="text-muted-foreground text-sm">
            First, verify your clinic's license key to get started. All fields are visible below — verification enables the inputs.
          </p>
        </div>

        <Field className="w-full">
          <FieldLabel htmlFor="License">License Key (HFR ID)</FieldLabel>
          <div className="flex items-center gap-2 flex-wrap w-full">
            <Input
              id="License"
              name="hfrId"
              className="flex-1 min-w-0"
              placeholder="Enter your clinic's HFR ID"
              value={hfrId}
              onChange={(e) => {
                setHfrId(e.target.value);
                // Reset status if user changes the key
                if (verificationStatus !== 'unverified') {
                  setVerificationStatus('unverified');
                  setVerifiedClinicName('');
                }
              }}
              // readOnly once verified
              readOnly={isVerified}
              aria-describedby="verification-help"
            />

            <Button
              type="button"
              variant="outline"
              onClick={handleVerifyLicense}
              disabled={isVerifying || isVerified}
            >
              {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isVerified ? "Verified" : "Verify"}
            </Button>
          </div>

          <div id="verification-help" role="status" aria-live="polite">
            {isVerified ? (
              <div className="flex items-center gap-2 text-sm text-green-600 mt-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Successfully verified: <strong>{verifiedClinicName}</strong></span>
              </div>
            ) : isVerifying ? (
              <p className="text-sm text-muted-foreground mt-2">Verifying license...</p>
            ) : (
              <p className="text-sm text-muted-foreground mt-2">Enter your clinic HFR ID and click Verify to enable account creation.</p>
            )}
          </div>
        </Field>

        {/* Always show the rest of the fields so nothing is cut or hidden; disable them until verification completes */}
        <Field className="w-full">
          <FieldLabel htmlFor="name">Your Name</FieldLabel>
          <Input
            id="name"
            name="name"
            placeholder="Enter your full name"
            required={isVerified}
            disabled={!isVerified}
          />
        </Field>

        <Field className="w-full">
          <FieldLabel htmlFor="password">Create Password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            required={isVerified}
            disabled={!isVerified}
          />
        </Field>

        <Field className="w-full">
          <Button type="submit" className="w-full" disabled={!isVerified}>
            {isVerified ? "Create Account" : "Create Account (Verify first)"}
          </Button>
          {!isVerified && (
            <p className="text-sm text-muted-foreground mt-2">Please verify your clinic's license to enable account creation.</p>
          )}
        </Field>

        <FieldSeparator />

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
