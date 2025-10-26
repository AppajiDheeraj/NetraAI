"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { PenLine, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(MorphSVGPlugin);

export default function SignatureMagic({ onConfirm }) {
  const [open, setOpen] = useState(false);
  const [signed, setSigned] = useState(false);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const strokes = useRef([]);
  const currentStroke = useRef([]);
  const isDrawing = useRef(false);
  const svgRef = useRef(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "white";
    ctxRef.current = ctx;
  }, []);

  // Start drawing
  const startDraw = (e) => {
    isDrawing.current = true;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    currentStroke.current = [{ x, y }];
  };

  // Draw line
  const draw = (e) => {
    if (!isDrawing.current) return;
    const ctx = ctxRef.current;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const prev = currentStroke.current[currentStroke.current.length - 1];
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    currentStroke.current.push({ x, y });
  };

  // End drawing
  const endDraw = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    if (currentStroke.current.length > 0) {
      strokes.current.push([...currentStroke.current]);
    }
  };

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes.current = [];
    currentStroke.current = [];
    setSigned(false);
    if (svgRef.current) svgRef.current.setAttribute("d", "");
  };

  // Confirm signature
  const confirmSignature = () => {
    const canvas = canvasRef.current;
    const signature = canvas.toDataURL("image/png");
    setSigned(true);

    // Animate pen → check
    if (svgRef.current) {
      gsap.to(svgRef.current, {
        duration: 0.5,
        morphSVG: "#checkPath",
        stroke: "#22c55e", // Neon green color
        ease: "power2.inOut",
      });
    }

    if (onConfirm) onConfirm(signature);
  };

  return (
    <div className="relative flex flex-col items-center gap-4">
      {/* Floating Sign button */}
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="rounded-full size-12 flex items-center justify-center border border-neutral-700 bg-black hover:bg-neutral-900 text-white shadow-md"
      >
        <PenLine className="size-5" />
      </Button>

      {/* Popover */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
          <div className="bg-black border border-neutral-800 rounded-xl shadow-lg p-6 w-[420px] space-y-4 relative">
            <h3 className="text-white text-lg font-semibold text-center flex items-center gap-2">
              <PenLine className="size-5" /> Draw Signature
            </h3>

            <div className="relative border border-neutral-700 rounded-lg overflow-hidden">
              <canvas
                ref={canvasRef}
                width={400}
                height={180}
                onPointerDown={startDraw}
                onPointerMove={draw}
                onPointerUp={endDraw}
                onPointerLeave={endDraw}
                className="bg-neutral-950 w-full h-full touch-none cursor-crosshair"
              />
            </div>

            <div className="flex justify-between items-center mt-3">
              <Button
                variant="ghost"
                className="text-neutral-400 hover:text-white flex items-center gap-2"
                onClick={clearCanvas}
              >
                <Eraser className="size-4" /> Clear
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmSignature}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Confirm
                </Button>
              </div>
            </div>

            {/* Morphing Icon */}
            <div className="absolute top-4 right-4">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  ref={svgRef}
                  id="penPath"
                  d="M12 20h9M16.38 3.62a1 1 0 0 1 3 3L7.37 18.64a2 2 0 0 1-.86.5l-2.87.84a.5.5 0 0 1-.62-.62l.84-2.87a2 2 0 0 1 .5-.86z"
                />
                <path id="checkPath" style={{ opacity: 0 }} d="M20 6 9 17l-5-5" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
