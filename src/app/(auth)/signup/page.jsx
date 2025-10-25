// app/signup/page.jsx
import { GalleryVerticalEnd } from "lucide-react";
import { SignUpForm } from "@/components/signup-form"; // Import the JSX form

export default function SignUpPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left side: The form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Netra AI
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignUpForm /> {/* Use the new SignUpForm here */}
          </div>
        </div>
      </div>

      {/* Right side: The image */}
      <div className="bg-muted relative hidden lg:block">
        <div class="flex justify-center items-center h-full">
          <img
            src="/undraw_ai-response_gaip.svg"
            alt="AI Response Illustration"
            class="max-w-xs md:max-w-sm lg:max-w-md p-8 mb-4"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
            <blockquote className="space-y-2 text-white/40">
                <p className="text-lg">
                    “This tool has saved us countless hours of manual review. The AI-powered insights are a game-changer.”
                </p>
                <footer className="text-sm text-gray-300">Sofia Davis, Eye Specialist</footer>
            </blockquote>
        </div>
      </div>
    </div>
  );
}
