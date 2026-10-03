"use client";

import { useRef, useState, type DragEvent, type Ref } from "react";
import { ImageUp, LoaderCircle } from "lucide-react";

interface ImageUploaderProps {
  onBrowse: () => void;
  onFileDropped: (file: File | undefined) => void;
  isProcessing: boolean;
  browseButtonRef?: Ref<HTMLButtonElement>;
}

export default function ImageUploader({ onBrowse, onFileDropped, isProcessing, browseButtonRef }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragDepth = useRef(0);

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragDepth.current += 1;
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragDepth.current = 0;
    setIsDragging(false);
    if (!isProcessing) onFileDropped(event.dataTransfer.files[0]);
  };

  return (
    <div
      onClick={isProcessing ? undefined : onBrowse}
      onDragEnter={handleDragEnter}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`group relative flex h-full min-h-80 flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-[background-color,border-color] duration-200 focus-within:border-brand-300 lg:min-h-[clamp(26rem,calc(100svh-22rem),34rem)] ${
        isDragging
          ? "border-brand-500 bg-brand-50"
          : "border-line-strong bg-canvas hover:border-brand-300 hover:bg-brand-50/40 active:bg-brand-50"
      } ${isProcessing ? "cursor-wait" : "cursor-pointer"}`}
    >
      <span
        className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
        aria-hidden="true"
      />

      <span
        className={`relative flex size-16 items-center justify-center rounded-2xl shadow-card ring-1 transition-[background-color,color,transform,box-shadow] duration-200 ${
          isDragging
            ? "-translate-y-1 bg-brand-600 text-white ring-brand-600"
            : "bg-surface text-brand-700 ring-line group-hover:-translate-y-1 group-hover:bg-brand-600 group-hover:text-white group-hover:ring-brand-600"
        }`}
      >
        {isProcessing ? (
          <LoaderCircle className="size-7 motion-safe:animate-spin" aria-hidden="true" />
        ) : (
          <ImageUp className="size-7" strokeWidth={1.75} aria-hidden="true" />
        )}
      </span>

      <h3 className="relative mt-6 text-xl font-semibold tracking-tight text-ink">
        {isProcessing ? (
          "Reading image…"
        ) : isDragging ? (
          "Release to upload"
        ) : (
          <>
            <span className="pointer-coarse:hidden">Drop your image here</span>
            <span className="hidden pointer-coarse:inline">Choose a photo to classify</span>
          </>
        )}
      </h3>
      <p
        className="relative mt-4 flex w-44 items-center gap-3 text-xs font-medium tracking-wide text-ink-subtle uppercase pointer-coarse:hidden"
        aria-hidden="true"
      >
        <span className="h-px flex-1 bg-line-strong" />
        or
        <span className="h-px flex-1 bg-line-strong" />
      </p>
      <button
        ref={browseButtonRef}
        type="button"
        disabled={isProcessing}
        className="btn btn-primary relative mt-4 px-6 py-2.5 pointer-coarse:mt-6"
      >
        Browse files
      </button>
      <p className="relative mt-4 text-xs text-balance text-ink-subtle">
        Supported formats: JPG, PNG or WEBP · up to 20&nbsp;MB
      </p>
    </div>
  );
}
