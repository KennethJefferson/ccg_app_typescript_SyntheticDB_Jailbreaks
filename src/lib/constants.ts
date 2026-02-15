import { AttackCategory, DifficultyLevel, GenerationConfig } from "./types";

export const CATEGORY_LABELS: Record<AttackCategory, string> = {
  direct_override: "Direct Instruction Override",
  roleplay_injection: "Role-play / Character Injection",
  encoding_obfuscation: "Encoding / Obfuscation",
  multi_turn: "Multi-turn Manipulation",
  prompt_injection: "Prompt Injection",
  social_engineering: "Social Engineering",
  few_shot_manipulation: "Few-shot Manipulation",
};

export const CATEGORY_DESCRIPTIONS: Record<AttackCategory, string> = {
  direct_override:
    "Attempts to directly override system instructions or safety guidelines",
  roleplay_injection:
    "Uses fictional characters or scenarios to bypass safety filters",
  encoding_obfuscation:
    "Encodes harmful requests using Base64, ROT13, leetspeak, etc.",
  multi_turn:
    "Gradually escalates across multiple conversation turns",
  prompt_injection:
    "Injects instructions disguised as data or context",
  social_engineering:
    "Manipulates through emotional appeals, authority claims, or urgency",
  few_shot_manipulation:
    "Provides examples that establish a pattern leading to harmful output",
};

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  basic: "Basic",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
};

export const ALL_CATEGORIES: AttackCategory[] = Object.keys(
  CATEGORY_LABELS
) as AttackCategory[];

export const DEFAULT_CONFIG: GenerationConfig = {
  count: 10,
  categories: [...ALL_CATEGORIES],
  difficulty: "intermediate",
  customInstructions: "",
};

export const SEVERITY_COLORS: Record<string, string> = {
  low: "text-emerald-400",
  medium: "text-yellow-400",
  high: "text-orange-400",
  critical: "text-red-400",
};

export const SEVERITY_BG_COLORS: Record<string, string> = {
  low: "bg-emerald-400/10 border-emerald-400/20",
  medium: "bg-yellow-400/10 border-yellow-400/20",
  high: "bg-orange-400/10 border-orange-400/20",
  critical: "bg-red-400/10 border-red-400/20",
};
