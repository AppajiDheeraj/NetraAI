"use client"

import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div
              className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Netra AI
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <div class="flex justify-center items-center h-full">
          <img
            src="/undraw_medicine_hqqg.svg"
            alt="AI Response Illustration"
            class="max-w-xs md:max-w-sm lg:max-w-md p-6"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-2">
            <blockquote className="space-y-2 text-white/40">
                <p className="text-lg text-black/45">
                    “This tool has saved us countless hours of manual review. The AI-powered insights are a game-changer.”
                </p>
                <footer className="text-sm text-gray-500">Sachin Rohra, Eye specialist</footer>
            </blockquote>
        </div>
      </div>
    </div>
  );
}
