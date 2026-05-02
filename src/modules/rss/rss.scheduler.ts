import cron from "node-cron";
import RssSource, { IRssSource } from "../../models/RssSource";
import FeedItemModel, { IFeedItemDocument } from "../feed/feed.model";
import Parser from "rss-parser";
import { summarizeAndTag } from "../../shared/utils/llmService";
import { load } from "cheerio";
import { logger } from "../../shared/utils/logger";

const parser = new Parser({ timeout: 10000 });

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Fetches article HTML and extracts main content.
 * Falls back to empty string on any error — never throws.
 */
const fetchArticleContent = async (url: string): Promise<string> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) return "";

    const html = await response.text();
    const $ = load(html);
    $("script, style, nav, footer, header, aside").remove();

    const articleBody = $(
      "article, [class*='post-content'], [class*='entry-content'], [class*='article-body'], main"
    ).first();

    return articleBody.length > 0
      ? (articleBody.text().replace(/\s\s+/g, " ").trim())
      : $("body").text().replace(/\s\s+/g, " ").trim().substring(0, 5000);
  } catch (error) {
    console.log(`Could not fetch article content from ${url}`);
    return "";
  }
};

/**
 * Processes a single RSS source.
 * Never throws — logs errors and moves on.
 */
const processSource = async (source: IRssSource): Promise<void> => {
  try {
    console.log(`[RSS] Processing: ${source.name}`);
    const feed = await parser.parseURL(source.url);
    let savedCount = 0;

    for (const item of feed.items) {
      const externalId = item.link || item.guid || item.title;
      if (!externalId) continue;

      const exists = await FeedItemModel.exists({ externalId });
      if (exists) continue;

      // Fetch content only if LLM key is available (no point fetching without it)
      const LLM_KEY = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY;
      let content = item.contentSnippet || item.content || "";

      if (LLM_KEY && item.link) {
        const fullContent = await fetchArticleContent(item.link);
        if (fullContent) content = fullContent;
        await sleep(200); // Brief delay between article fetches
      }

      const { summary, tags } = await summarizeAndTag(content);

      await new FeedItemModel({
        title: item.title || "Untitled",
        content: item.link || content,
        source: source.name,
        externalId,
        summary,
        tags,
        category: tags[0] || "general",
      }).save();

      savedCount++;
    }

    source.lastFetched = new Date();
    await source.save();

    console.log(`[RSS] ${source.name}: saved ${savedCount} new articles`);
  } catch (error: any) {
    // Log but never crash the whole scheduler over one bad source
    console.log(`[RSS] Failed processing ${source.name}: ${error.message}`);
  }
};

const runFeedScheduler = async (): Promise<void> => {
  console.log("[RSS] Starting scheduled fetch...");
  try {
    const activeSources = await RssSource.find({ isActive: true });

    if (activeSources.length === 0) {
      console.log("[RSS] No active RSS sources found.");
      return;
    }

    // Process sources sequentially to avoid hammering sites simultaneously
    for (const source of activeSources) {
      await processSource(source);
      await sleep(500);
    }

    console.log("[RSS] Scheduled fetch complete.");
  } catch (error: any) {
    console.log(`[RSS] Scheduler error: ${error.message}`);
  }
};

export const startRssScheduler = (): void => {
  // Run every 30 minutes
  cron.schedule("*/30 * * * *", runFeedScheduler);
  console.log("RSS scheduler started — running every 30 minutes.");
  // Run immediately on startup
  runFeedScheduler();
};
