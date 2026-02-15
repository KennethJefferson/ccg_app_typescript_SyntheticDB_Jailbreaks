export type AttackCategory =
  | "direct_override"
  | "roleplay_injection"
  | "encoding_obfuscation"
  | "multi_turn"
  | "prompt_injection"
  | "social_engineering"
  | "few_shot_manipulation";

export type DifficultyLevel = "basic" | "intermediate" | "advanced" | "expert";

export type SeverityLevel = "low" | "medium" | "high" | "critical";

export interface GeneratedExample {
  id: string;
  attackPrompt: string;
  attackTechnique: string;
  category: AttackCategory;
  subcategory: string;
  targetResponse: string;
  defendedResponse: string;
  attackSuccess: boolean;
  severity: SeverityLevel;
  notes: string;
}

export interface GenerationConfig {
  count: number;
  categories: AttackCategory[];
  difficulty: DifficultyLevel;
  customInstructions: string;
}

export interface GenerationState {
  status: "idle" | "generating" | "completed" | "error";
  examples: GeneratedExample[];
  progress: number;
  error?: string;
}

export type SortField = "category" | "attackSuccess" | "severity" | "attackTechnique";

export type SortDirection = "asc" | "desc";

export interface TableControls {
  sortField: SortField | null;
  sortDirection: SortDirection;
  filterCategory: AttackCategory | "all";
  filterSeverity: SeverityLevel | "all";
  filterSuccess: boolean | "all";
  searchQuery: string;
}
