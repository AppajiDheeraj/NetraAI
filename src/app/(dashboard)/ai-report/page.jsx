"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Loader2Icon, Trash2, PlusCircle, PenLine } from "lucide-react";
import Image from "next/image";
import SignatureCanvas from "react-signature-canvas";
import { cn } from "@/lib/utils";

import { NewAiReportDialog } from "@/modules/ai-report/ui/components/new-ai-report-dialog";
import { NewPersonDialog } from "@/modules/ai-report/ui/components/new-person-dialog";

// 🔄 Loading Spinner
const LoadingState = ({ title, description }) => (
  <div className="flex items-center justify-center flex-1 py-10 px-8">
    <div className="flex flex-col items-center justify-center gap-y-6 bg-card rounded-xl p-10 shadow-lg border border-border/40">
      <Loader2Icon className="size-6 animate-spin text-primary" />
      <div className="flex flex-col gap-y-2 text-center">
        <h6 className="text-lg font-semibold">{title}</h6>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  </div>
);

export default function AiReportPage() {
  const [openReport, setOpenReport] = useState(false);
  const [openPerson, setOpenPerson] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  // 🧾 Prescription State
  const [medications, setMedications] = useState([]);
  const [notes, setNotes] = useState("");
  const sigCanvas = useRef(null);

  // 🧠 Simulate AI generation
  const handleReportSuccess = () => {
    setOpenReport(false);
    setLoading(true);
    setTimeout(() => {
      setReportData({
        image: "/retina-sample.png",
        disease: "Diabetic Retinopathy",
        confidence: 93,
        accuracy: 95,
        description:
          "AI detected early signs of Diabetic Retinopathy including mild microaneurysms and hemorrhages. Recommend follow-up within 2 weeks.",
        patient: "Ravi Kumar",
        doctor: "Dr. A. Mehta"
      });
      setLoading(false);
    }, 2000);
  };

  const addMedicine = () => {
    setMedications([...medications, { name: "", days: "", morning: false, afternoon: false, night: false }]);
  };

  const updateMed = (i, field, value) => {
    const newMeds = [...medications];
    newMeds[i][field] = value;
    setMedications(newMeds);
  };

  const removeMed = (i) => {
    const newMeds = [...medications];
    newMeds.splice(i, 1);
    setMedications(newMeds);
  };

  const handleSubmit = () => {
    const finalData = {
      ...reportData,
      medications,
      notes,
      signature: sigCanvas.current?.toDataURL()
    };
    console.log("Final Report Data:", finalData);
    alert("Prescription submitted successfully ✅");
  };

  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[calc(100vh-6rem)]">
      {/* 🪄 Empty State */}
      {!reportData && !loading && (
        <div className="flex flex-col items-center text-center space-y-6">
          <h1 className="text-2xl font-semibold">No AI Reports Yet</h1>
          <p className="text-muted-foreground max-w-sm">
            Start by creating an AI report to analyze eye images and generate diagnostic insights with confidence levels.
          </p>
          <Button onClick={() => setOpenReport(true)} className="mt-2 px-6 py-2 text-base">
            + Create AI Report
          </Button>
        </div>
      )}

      {/* 🔄 Loading */}
      {loading && (
        <LoadingState
          title="Generating AI Report..."
          description="Analyzing eye images with deep learning model..."
        />
      )}

      {/* ✅ Report Generated */}
      {!loading && reportData && (
        <Card className="w-full max-w-4xl p-6 bg-gradient-to-b from-card to-background shadow-lg border border-border/40 space-y-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">AI Diagnosis Report</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 🧠 AI Summary */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden border">
                <Image src={reportData.image} alt="Retina" fill className="object-cover" />
              </div>
              <div className="flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-medium">
                    Disease:{" "}
                    <span className="font-semibold text-primary">{reportData.disease}</span>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Confidence: {reportData.confidence}% | Accuracy: {reportData.accuracy}%
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">AI Description</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {reportData.description}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">AI Confidence Meter</p>
                  <Progress value={reportData.accuracy} />
                </div>
              </div>
            </div>

            {/* 🧾 Prescription Form */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-xl font-semibold mb-2">Doctor’s Prescription</h3>

              {/* Doctor/Patient Info */}
              <div className="grid grid-cols-2 gap-4">
                <Input value={reportData.patient} readOnly placeholder="Patient Name" />
                <Input value={reportData.doctor} readOnly placeholder="Doctor Name" />
              </div>

              {/* Medications Section */}
              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Medications</h4>
                  <Button onClick={addMedicine} variant="outline" size="sm" className="flex items-center gap-1">
                    <PlusCircle size={16} /> Add
                  </Button>
                </div>

                {medications.length === 0 && (
                  <p className="text-sm text-muted-foreground">No medicines added yet.</p>
                )}

                {medications.map((med, i) => (
                  <div key={i} className="border rounded-lg p-4 bg-muted/20 space-y-3 relative">
                    <button
                      onClick={() => removeMed(i)}
                      className="absolute top-2 right-2 text-destructive hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Medicine Name"
                        value={med.name}
                        onChange={(e) => updateMed(i, "name", e.target.value)}
                      />
                      <Input
                        placeholder="Days"
                        type="number"
                        value={med.days}
                        onChange={(e) => updateMed(i, "days", e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      {["Morning", "Afternoon", "Night"].map((time) => (
                        <label key={time} className="flex items-center gap-1 text-sm">
                          <input
                            type="checkbox"
                            checked={med[time.toLowerCase()]}
                            onChange={(e) => updateMed(i, time.toLowerCase(), e.target.checked)}
                          />{" "}
                          {time}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Doctor Notes */}
              <div className="mt-4">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add doctor's notes, remarks, lifestyle advice..."
                />
              </div>

              {/* Signature */}
              <div className="space-y-2 mt-6">
                <h4 className="font-medium flex items-center gap-2">
                  <PenLine className="text-primary" size={18} /> Doctor’s Signature
                </h4>
                <SignatureCanvas
                  ref={sigCanvas}
                  penColor="black"
                  backgroundColor="#fafafa"
                  canvasProps={{
                    width: 500,
                    height: 150,
                    className: "border border-muted rounded-md"
                  }}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setReportData(null)}>
              + New Report
            </Button>
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white">
              Submit Prescription
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Modals */}
      <NewAiReportDialog
        open={openReport}
        onOpenChange={setOpenReport}
        onCreatePerson={() => setOpenPerson(true)}
        onSuccess={handleReportSuccess}
      />
      <NewPersonDialog open={openPerson} onOpenChange={setOpenPerson} />
    </div>
  );
}
