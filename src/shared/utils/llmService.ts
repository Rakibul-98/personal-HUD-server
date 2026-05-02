import { OpenAI } from "openai";
import * as dotenv from "dotenv";
import { load } from "cheerio";
import { logger } from "./logger";

dotenv.config();
const LLM_API_KEY = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY;
const LLM_BASE_URL = process.env.LLM_BASE_URL || "https://api.openai.com/v1";
const LLM_MODEL = process.env.LLM_MODEL || "gpt-4o-mini";
const MAX_RETRIES = 2;

let client: OpenAI | null = null;

const getClient = (): OpenAI | null => {
  if (!LLM_API_KEY) return null;
  if (!client) {
    client = new OpenAI({ apiKey: LLM_API_KEY, baseURL: LLM_BASE_URL });
  }
  return client;
};

const extractTextFromHtml = (html: string): string => {
  const $ = load(html);
  $("script, style, nav, footer, header").remove();
  return $("body").text().replace(/\s\s+/g, " ").trim();
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const summarizeAndTag = async (
  articleContent: string
): Promise<{ summary: string; tags: string[] }> => {
  const llm = getClient();
  if (!llm) {
    console.log("LLM_API_KEY not set — skipping summarization");
    return { summary: "", tags: [] };
  }

  if (!articleContent || articleContent.trim().length < 100) {
    return { summary: "", tags: [] };
  }

  const textContent = articleContent.includes("<")
    ? extractTextFromHtml(articleContent)
    : articleContent;

  const truncated =
    textContent.length > 4000
      ? textContent.substring(0, 4000) + "..."
      : textContent;

  const systemPrompt = `You are a precise content analyst. Given article text, return ONLY a valid JSON object:
{"summary": "2-3 sentence summary", "tags": ["tag1", "tag2", "tag3"]}
Rules: tags must be lowercase, no hashtags, 3-5 tags max. No markdown, no preamble.`;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await llm.chat.completions.create({
        model: LLM_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Article:\n${truncated}` },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
        max_tokens: 300,
      });

      const raw = response.choices[0].message.content?.trim();
      if (!raw) throw new Error("Empty LLM response");

      const result = JSON.parse(raw);
      return {
        summary: typeof result.summary === "string" ? result.summary : "",
        tags: Array.isArray(result.tags)
          ? result.tags
              .filter((t: unknown) => typeof t === "string")
              .map((t: string) => t.toLowerCase().replace(/[^a-z0-9-]/g, ""))
              .slice(0, 5)
          : [],
      };
    } catch (error: any) {
      if (attempt < MAX_RETRIES) {
        console.log(`LLM attempt ${attempt + 1} failed, retrying... ${error.message}`);
        await sleep(500 * (attempt + 1)); // exponential backoff
      } else {
        console.log(`LLM summarization failed after ${MAX_RETRIES + 1} attempts: ${error.message}`);
      }
    }
  }

  return { summary: "", tags: [] };
};
