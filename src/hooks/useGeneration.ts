"use client";

import { useState, useRef, useCallback } from "react";
import { GenerationConfig, GenerationState, GeneratedExample } from "@/lib/types";

export function useGeneration() {
  const [state, setState] = useState<GenerationState>({
    status: "idle",
    examples: [],
    progress: 0,
  });
  const abortRef = useRef<AbortController | null>(null);

  const generate = useCallback(async (config: GenerationConfig, apiKey?: string) => {
    abortRef.current = new AbortController();
    setState({ status: "generating", examples: [], progress: 0 });

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (apiKey) {
        headers["x-api-key"] = apiKey;
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers,
        body: JSON.stringify(config),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        const err = await response.json();
        setState((prev) => ({
          ...prev,
          status: "error",
          error: err.error || "Generation failed",
        }));
        return;
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const parsed = JSON.parse(line);
            if (parsed.error && parsed.fatal) {
              setState((prev) => ({
                ...prev,
                status: "error",
                error: parsed.message,
              }));
              return;
            }
            if (parsed.error) {
              console.warn(`[generation] Skipped example ${parsed.index}: ${parsed.message}`);
              continue;
            }

            setState((prev) => ({
              ...prev,
              examples: [...prev.examples, parsed as GeneratedExample],
              progress: prev.progress + 1,
            }));
          } catch {
            // skip malformed lines
          }
        }
      }

      setState((prev) => ({
        ...prev,
        status: prev.status === "error" ? "error" : "completed",
      }));
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setState((prev) => ({ ...prev, status: "completed" }));
      } else {
        setState((prev) => ({
          ...prev,
          status: "error",
          error: err instanceof Error ? err.message : "Unknown error",
        }));
      }
    }
  }, []);

  const abort = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const clear = useCallback(() => {
    setState({ status: "idle", examples: [], progress: 0 });
  }, []);

  return { state, generate, abort, clear };
}
