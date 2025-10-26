"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Progress } from "@/components/ui/progress";
import ProgressUpload from "@/components/progress-upload";
import { Download, Upload, Play, CheckCircle } from "lucide-react";

export default function ContributeButtons({ className = "" }) {
  const [openTrain, setOpenTrain] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const trainingTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (trainingTimer.current) clearInterval(trainingTimer.current);
    };
  }, []);

  function handleDownloadModel() {
    // Create a small dummy blob to simulate model download.
    const blob = new Blob(["Dummy model content"], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "netra-model.bin";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function handleOpenUpload() {
    // open the responsive dialog with the ProgressUpload component
    setUploadOpen(true);
  }

  const [uploadOpen, setUploadOpen] = useState(false);

  function startTraining() {
    setOpenTrain(true);
    setTrainingProgress(0);

    // simulate progress increments
    trainingTimer.current = setInterval(() => {
      setTrainingProgress((p) => {
        const next = Math.min(100, p + Math.ceil(Math.random() * 8));
        if (next >= 100) {
          if (trainingTimer.current) clearInterval(trainingTimer.current);
        }
        return next;
      });
    }, 500);
  }

  function resetTraining() {
    if (trainingTimer.current) clearInterval(trainingTimer.current);
    setTrainingProgress(0);
    setOpenTrain(false);
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Button variant="outline" onClick={handleDownloadModel} title="Download model">
        <Download className="mr-2 h-4 w-4" />
        Download Model
      </Button>

      <ResponsiveDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        title="Upload Training File"
        description="Upload dataset files to contribute to model training. Progress will be shown below."
      >
        <div className="py-2">
          <ProgressUpload />
        </div>
      </ResponsiveDialog>

      <Button variant="outline" onClick={() => setUploadOpen(true)}>
        <Upload className="mr-2 h-4 w-4" />
        Upload File
      </Button>

      <ResponsiveDialog
        open={openTrain}
        onOpenChange={(v) => {
          // if user closes early, stop timer
          if (!v && trainingTimer.current) {
            clearInterval(trainingTimer.current);
            trainingTimer.current = null;
          }
          setOpenTrain(v);
        }}
        title={trainingProgress >= 100 ? "Training Complete" : "Training Model"}
        description={
          trainingProgress >= 100
            ? "Training finished successfully. You may close this dialog."
            : "Training in progress — this will run until 100%."
        }
      >
        <div className="py-6 px-4 flex flex-col items-center gap-4">
          <div className="flex items-center justify-center w-28 h-28 rounded-full bg-primary/10 text-primary">
            {trainingProgress >= 100 ? (
              <CheckCircle className="h-10 w-10" />
            ) : (
              <div className="text-2xl font-medium">{trainingProgress}%</div>
            )}
          </div>

          <div className="w-full">
            <Progress value={trainingProgress} className="h-3 rounded-full" />
          </div>

          <div className="mt-2 text-sm text-muted-foreground w-full text-center">
            {trainingProgress >= 100
              ? "Model trained and ready. Download or evaluate the results."
              : "Training in progress — please keep this page open until completion."}
          </div>

          <div className="mt-4 flex gap-3">
            {trainingProgress < 100 ? (
              <Button onClick={() => startTraining()}>
                <Play className="mr-2 h-4 w-4" /> Start
              </Button>
            ) : (
              <Button onClick={resetTraining}>Close</Button>
            )}

            {trainingProgress < 100 && (
              <Button variant="ghost" onClick={() => {
                if (trainingTimer.current) clearInterval(trainingTimer.current);
                trainingTimer.current = null;
                setOpenTrain(false);
              }}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </ResponsiveDialog>

      <Button variant="primary" onClick={startTraining}>
        <Play className="mr-2 h-4 w-4" />
        Train Model
      </Button>
    </div>
  );
}
