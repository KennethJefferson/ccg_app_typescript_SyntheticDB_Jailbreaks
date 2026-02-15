"use client";

import { useState, useEffect } from "react";
import { GenerationConfig } from "@/lib/types";
import { DEFAULT_CONFIG } from "@/lib/constants";
import { useGeneration } from "@/hooks/useGeneration";
import { useTableControls } from "@/hooks/useTableControls";
import { TopBar } from "@/components/TopBar";
import { ConfigPanel } from "@/components/ConfigPanel";
import { DataTable } from "@/components/DataTable";
import { SettingsDialog } from "@/components/SettingsDialog";

const API_KEY_STORAGE_KEY = "syntheticdb_api_key";

export default function Home() {
  const [config, setConfig] = useState<GenerationConfig>(DEFAULT_CONFIG);
  const [apiKey, setApiKey] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { state, generate, abort, clear } = useGeneration();
  const {
    controls,
    filteredData,
    setSort,
    setFilterCategory,
    setFilterSeverity,
    setFilterSuccess,
    setSearchQuery,
    resetFilters,
  } = useTableControls(state.examples);

  useEffect(() => {
    const stored = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (stored) setApiKey(stored);
  }, []);

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem(API_KEY_STORAGE_KEY, key);
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
  };

  return (
    <div className="h-screen grid grid-cols-[320px_1fr] grid-rows-[56px_1fr]">
      <TopBar
        examples={filteredData}
        status={state.status}
        progress={state.progress}
        total={config.count}
        error={state.error}
        hasApiKey={!!apiKey}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <ConfigPanel
        config={config}
        onChange={setConfig}
        onGenerate={() => generate(config, apiKey || undefined)}
        onAbort={abort}
        onClear={clear}
        status={state.status}
        hasExamples={state.examples.length > 0}
      />
      <DataTable
        examples={filteredData}
        controls={controls}
        onSort={setSort}
        onFilterCategory={setFilterCategory}
        onFilterSeverity={setFilterSeverity}
        onFilterSuccess={setFilterSuccess}
        onSearch={setSearchQuery}
        onResetFilters={resetFilters}
        status={state.status}
        total={config.count}
        progress={state.progress}
      />
      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        apiKey={apiKey}
        onApiKeyChange={handleApiKeyChange}
      />
    </div>
  );
}
