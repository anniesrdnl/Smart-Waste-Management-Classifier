"use client";

import { useCallback, useRef, useState } from "react";
import type { ModelState } from "@/types/prediction";
import { toClassifierError } from "./errors";
import { loadClassifier, type WasteClassifierModel } from "./model";

export function useClassifierModel() {
  const [state, setState] = useState<ModelState>({ status: "idle", error: null });
  const modelRef = useRef<WasteClassifierModel | null>(null);

  const load = useCallback(() => {
    if (modelRef.current) return;
    setState({ status: "loading", error: null });
    loadClassifier()
      .then((model) => {
        modelRef.current = model;
        setState({ status: "ready", error: null });
      })
      .catch((error: unknown) => {
        setState({ status: "error", error: toClassifierError(error, "model-load-failed") });
      });
  }, []);

  return { ...state, modelRef, load };
}
