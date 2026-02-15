import Anthropic from "@anthropic-ai/sdk";
import { GenerationConfig, GeneratedExample } from "@/lib/types";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompt";
import { ALL_CATEGORIES } from "@/lib/constants";

export async function POST(request: Request) {
  const apiKey =
    request.headers.get("x-api-key") || process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json(
      {
        error:
          "No API key configured. Set ANTHROPIC_API_KEY in .env.local or enter it in Settings.",
      },
      { status: 401 }
    );
  }

  let config: GenerationConfig;
  try {
    config = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!config.count || config.count < 1 || config.count > 100) {
    return Response.json(
      { error: "Count must be between 1 and 100" },
      { status: 400 }
    );
  }
  if (!config.categories?.length) {
    return Response.json(
      { error: "Select at least one category" },
      { status: 400 }
    );
  }

  const validCategories = new Set(ALL_CATEGORIES);
  const invalidCats = config.categories.filter((c) => !validCategories.has(c));
  if (invalidCats.length > 0) {
    return Response.json(
      { error: `Invalid categories: ${invalidCats.join(", ")}` },
      { status: 400 }
    );
  }

  const client = new Anthropic({ apiKey });
  const systemPrompt = buildSystemPrompt();
  const previousTechniques: string[] = [];
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for (let i = 0; i < config.count; i++) {
          const userPrompt = buildUserPrompt(config, i, previousTechniques);

          const message = await client.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1024,
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }],
          });

          const textBlock = message.content.find(
            (block) => block.type === "text"
          );
          const result = textBlock?.type === "text" ? textBlock.text : "";
          const stopReason = message.stop_reason;

          console.log(`[generate] Example ${i + 1}: stop_reason=${stopReason}, response length=${result.length}`);
          console.log(`[generate] Raw response preview: ${result.slice(0, 200)}`);

          try {
            let cleaned = result.trim();
            // Strip markdown code fences if present
            if (cleaned.startsWith("```")) {
              cleaned = cleaned
                .replace(/^```\w*\n?/, "")
                .replace(/\n?```$/, "");
            }
            // Strip any leading non-JSON text (explanation before the JSON)
            const jsonStart = cleaned.indexOf("{");
            if (jsonStart > 0) {
              cleaned = cleaned.slice(jsonStart);
            }
            // Strip any trailing non-JSON text (explanation after the JSON)
            const jsonEnd = cleaned.lastIndexOf("}");
            if (jsonEnd >= 0 && jsonEnd < cleaned.length - 1) {
              cleaned = cleaned.slice(0, jsonEnd + 1);
            }

            const parsed = JSON.parse(cleaned) as Omit<GeneratedExample, "id">;
            const example: GeneratedExample = {
              id: crypto.randomUUID(),
              ...parsed,
            };
            previousTechniques.push(example.attackTechnique);

            controller.enqueue(
              encoder.encode(JSON.stringify(example) + "\n")
            );
          } catch (parseErr) {
            console.error(`[generate] Parse error for example ${i + 1}:`, parseErr instanceof Error ? parseErr.message : parseErr);
            console.error(`[generate] Full raw response:\n${result}`);
            controller.enqueue(
              encoder.encode(
                JSON.stringify({
                  error: true,
                  index: i,
                  message: `Failed to parse LLM response: ${result.slice(0, 100)}`,
                }) + "\n"
              )
            );
          }
        }
      } catch (err) {
        controller.enqueue(
          encoder.encode(
            JSON.stringify({
              error: true,
              fatal: true,
              message:
                err instanceof Error ? err.message : "Unknown error",
            }) + "\n"
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
    },
  });
}
