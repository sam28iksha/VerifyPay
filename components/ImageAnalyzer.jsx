"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ImageUp, LoaderCircle } from "lucide-react";
import ResultCard from "@/components/ResultCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ImageAnalyzer() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!file) {
      setError("Please choose an image to analyze.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/analyze-image", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Image analysis failed.");
      }

      setResult(data);
    } catch (requestError) {
      setResult(null);
      setError(requestError.message || "Image analysis failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
      <Card>
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <ImageUp className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Analyze Screenshot</h2>
            <p className="text-sm text-muted-foreground">
              Upload a payment screenshot or suspicious image for fraud review.
            </p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 text-center transition hover:border-sky-400 hover:bg-white">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const nextFile = event.target.files?.[0] ?? null;
                setFile(nextFile);
                setResult(null);
                setError("");
              }}
            />

            {previewUrl ? (
              <div className="relative h-52 w-full overflow-hidden rounded-[1.25rem] border border-slate-200">
                <Image
                  src={previewUrl}
                  alt="Selected screenshot preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <>
                <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm">
                  <ImageUp className="h-6 w-6" />
                </span>
                <p className="text-base font-semibold text-slate-900">Drop or select an image</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  PNG, JPG, and screenshots are supported.
                </p>
              </>
            )}
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={loading || !file}>
              {loading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? "Scanning..." : "Scan Screenshot"}
            </Button>
            {file ? <p className="text-sm text-slate-500">Selected: {file.name}</p> : null}
          </div>
        </form>

        {error ? (
          <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}
      </Card>

      {result ? (
        <ResultCard result={result} />
      ) : (
        <Card className="flex min-h-[320px] items-center justify-center bg-gradient-to-br from-emerald-900 to-teal-700 text-white">
          <div className="max-w-sm text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-100">
              Vision analysis
            </p>
            <h3 className="mt-3 text-2xl font-semibold">Upload a screenshot to begin</h3>
            <p className="mt-3 text-sm leading-6 text-emerald-50/90">
              The backend reads image uploads through `FormData`, uses OpenAI vision when
              available, and falls back safely if the AI call fails.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
