"use client";

import { useState, useEffect, useRef } from "react";

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export function SettingsDialog({
  open,
  onClose,
  apiKey,
  onApiKeyChange,
}: SettingsDialogProps) {
  const [inputValue, setInputValue] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setInputValue(apiKey);
      setShowKey(false);
    }
  }, [open, apiKey]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    function handleClickOutside(e: MouseEvent) {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSave = () => {
    const trimmed = inputValue.trim();
    onApiKeyChange(trimmed);
    onClose();
  };

  const handleClear = () => {
    setInputValue("");
    onApiKeyChange("");
  };

  const maskedValue = inputValue
    ? `${"*".repeat(Math.max(0, inputValue.length - 4))}${inputValue.slice(-4)}`
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        ref={dialogRef}
        className="w-full max-w-md rounded-lg border border-zinc-700 bg-zinc-900 p-6 shadow-2xl"
      >
        <h2 className="text-base font-semibold text-zinc-100 mb-4">
          Settings
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">
            Anthropic API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={showKey ? inputValue : maskedValue}
              onChange={(e) => {
                setShowKey(true);
                setInputValue(e.target.value);
              }}
              onFocus={() => setShowKey(true)}
              placeholder="sk-ant-..."
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 pr-16 text-sm text-zinc-100 font-mono placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300 px-1"
              type="button"
            >
              {showKey ? "Hide" : "Show"}
            </button>
          </div>
          <p className="mt-1.5 text-xs text-zinc-600">
            Or set <code className="text-zinc-500">ANTHROPIC_API_KEY</code> in{" "}
            <code className="text-zinc-500">.env.local</code>
          </p>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handleClear}
            disabled={!inputValue}
            className="text-xs text-red-400 hover:text-red-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Clear Key
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
