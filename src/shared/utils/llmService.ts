import { OpenAI } from "openai";
import * as dotenv from "dotenv";
import { load } from "cheerio";

dotenv.config();

// Use environment variables for flexible LLM provider
const LLM_API_KEY = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY;
const LLM_BASE_URL = process.env.LLM_BASE_URL || "https://api.openai.com/v1";
const LLM_MODEL = process.env.LLM_MODEL || "deepseek-chat";

const openai = new OpenAI({
  apiKey: LLM_API_KEY,
  baseURL: LLM_BASE_URL,
});
const extractTextFromHtml = (html: string): string => {
  const $ = load(html);
  $("script, style").remove();
  return $("body").text().replace(/\s\s+/g, " ").trim();
};

export const summarizeAndTag = async (
  articleContent: string
): Promise<{ summary: string; tags: string[] }> => {
  if (!LLM_API_KEY) {
    console.warn("LLM_API_KEY is not set. Skipping summarization and tagging.");
    return { summary: "", tags: [] };
  }

  const textContent = extractTextFromHtml(articleContent);

  const MAX_CHARS = 4000;
  const truncatedContent =
    textContent.length > MAX_CHARS
      ? textContent.substring(0, MAX_CHARS) + "..."
      : textContent;

  const systemPrompt = `You are an expert content analyst. Analyze the article and provide:
  1. A concise summary (maximum 3 sentences)
  2. 3-5 relevant tags (lowercase, no hashtags)
  
  Return ONLY a valid JSON object in this exact format:
  {"summary": "Your summary here", "tags": ["tag1", "tag2", "tag3"]}
  
  No additional text, explanations, or markdown.`;

  const userPrompt = `Article Content:\n${truncatedContent}`;

  try {
    const response = await openai.chat.completions.create({
      model: LLM_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
      max_tokens: 500,
    });

    const jsonString = response.choices[0].message.content?.trim();
    if (!jsonString) {
      throw new Error("LLM returned an empty response.");
    }

    const result = JSON.parse(jsonString);
    return {
      summary: result.summary || "",
      tags: Array.isArray(result.tags)
        ? result.tags.map((tag: string) => tag.toLowerCase())
        : [],
    };
  } catch (error) {
    console.error("Error during LLM summarization and tagging:", error);
    return { summary: "Failed to generate summary.", tags: ["llm-error"] };
  }
};
