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
    // ✅ Pass the new submit handler to the form
    <form
      onSubmit={handleFormSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create a Clinic Account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            First, verify your clinic's license key to get started.
          </p>
        </div>

        {/* ✅ 4. The interactive License Key / HFR ID field */}
        <Field>
          <FieldLabel htmlFor="License">License Key (HFR ID)</FieldLabel>
          <div className="flex items-center gap-2">
            <Input
              id="License"
              name="hfrId"
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
              // Disable input once verified
              readOnly={isVerified}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleVerifyLicense}
              // Disable button while verifying or if already verified
              disabled={isVerifying || isVerified}
            >
              {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isVerified ? "Verified" : "Verify"}
            </Button>
          </div>
          {/* Show a success message after verification */}
          {isVerified && (
             <div className="flex items-center gap-2 text-sm text-green-600 mt-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Successfully verified: <strong>{verifiedClinicName}</strong></span>
            </div>
          )}
        </Field>

        {/* Show other fields only AFTER verification is successful */}
        {isVerified && (
          <>
            <Field>
              <FieldLabel htmlFor="name">Your Name</FieldLabel>
              <Input id="name" name="name" placeholder="Enter your full name" required />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Create Password</FieldLabel>
              <Input id="password" name="password" type="password" required />
            </Field>

            <Field>
              {/* ✅ Disable the main button until the key is verified */}
              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </Field>
          </>
        )}

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
