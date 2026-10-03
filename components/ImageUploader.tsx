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
      className={`group flex min-h-80 flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-[background-color,border-color,transform] duration-200 focus-within:border-brand-300 sm:min-h-96 ${
        isDragging
          ? "scale-[0.99] border-brand-500 bg-brand-50"
          : "border-line-strong bg-canvas hover:border-brand-300 hover:bg-brand-50/50 active:bg-brand-50"
      } ${isProcessing ? "cursor-wait" : "cursor-pointer"}`}
    >
      <span
        className={`flex size-14 items-center justify-center rounded-2xl transition-[background-color,color,transform] duration-200 ${
          isDragging
            ? "-translate-y-1 bg-brand-600 text-white"
            : "bg-brand-100 text-brand-700 group-hover:-translate-y-0.5 group-hover:bg-brand-600 group-hover:text-white"
        }`}
      >
        {isProcessing ? (
          <LoaderCircle className="size-6 motion-safe:animate-spin" aria-hidden="true" />
        ) : (
          <ImageUp className="size-6" aria-hidden="true" />
        )}
      </span>
      <h3 className="mt-5 text-lg font-semibold text-ink">Upload Waste Image</h3>
      <p className="mt-1 text-ink-muted">
        {isProcessing ? "Reading image…" : isDragging ? "Release to upload" : "Drag and drop your image here"}
      </p>
      <p className="my-3 text-sm text-ink-subtle">or</p>
      <button
        ref={browseButtonRef}
        type="button"
        disabled={isProcessing}
        className="btn btn-primary px-6 py-2.5"
      >
        Browse Files
      </button>
      <p className="mt-5 text-xs text-ink-subtle">JPG, JPEG, PNG or WEBP · up to 20 MB</p>
    </div>
  );
}
