"use client";

import ContributeButtons from "@/components/contribute-buttons";

export default function ContributePage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <aside className="lg:col-span-1">
          <div className="bg-linear-to-br from-primary/5 to-transparent p-6 rounded-xl border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/20 text-primary p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Contribute to Netra</h2>
                <p className="text-sm text-muted-foreground mt-1">Share datasets, download baseline models, or run local training to improve accuracy.</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="text-sm">Quick tips</div>
              <ul className="text-sm list-disc list-inside text-muted-foreground">
                <li>Upload CSV/ZIP datasets that follow the project schema.</li>
                <li>Keep model files small for preview downloads.</li>
                <li>Use training dialog to monitor progress and logs.</li>
              </ul>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Contribute</h1>
              <p className="text-sm text-muted-foreground mt-1">Download models, upload datasets, or start a training run — everything in one place.</p>
            </div>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <article className="p-4 bg-card border rounded-lg shadow-sm">
              <h3 className="font-medium">Model</h3>
              <p className="text-sm text-muted-foreground mt-2">Download the baseline model to evaluate or extend.</p>
            </article>

            <article className="p-4 bg-card border rounded-lg shadow-sm">
              <h3 className="font-medium">Upload</h3>
              <p className="text-sm text-muted-foreground mt-2">Upload annotated datasets to contribute to training.</p>
            </article>

            <article className="p-4 bg-card border rounded-lg shadow-sm">
              <h3 className="font-medium">Train</h3>
              <p className="text-sm text-muted-foreground mt-2">Run a local training simulation or connect to your training endpoint.</p>
            </article>
          </section>

          <section className="bg-card border p-6 rounded-md shadow-md">
            <div className="mb-4">
              <h4 className="text-lg font-semibold">Actions</h4>
              <p className="text-sm text-muted-foreground mt-1">Use these controls to interact with models and data.</p>
            </div>

            <div className="flex items-center">
              <ContributeButtons />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
