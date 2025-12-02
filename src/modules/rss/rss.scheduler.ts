import cron from "node-cron";
import RssSource, { IRssSource } from "../../models/RssSource";
import FeedItemModel, { IFeedItemDocument } from "../feed/feed.model";
import Parser from "rss-parser";
import { summarizeAndTag } from "../../shared/utils/llmService";
import { load } from "cheerio";

const parser = new Parser();

/**
 * Fetches the full article content from a URL.
 * This is a simple implementation and might fail on complex sites.
 * A more robust solution would use a dedicated content extraction service.
 * @param url The article URL.
 * @returns The extracted HTML content.
 */
const fetchArticleContent = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.statusText}`);
    }
    const html = await response.text();
    const $ = load(html);

    // Simple heuristic: look for common article containers
    const articleBody = $("article, .post-content, .entry-content").first();
    if (articleBody.length > 0) {
      return articleBody.html() || html;
    }

    return html;
  } catch (error) {
    console.error(`Error fetching content for ${url}:`, error);
    return "";
  }
};

/**
 * Processes a single RSS source: fetches, summarizes, and saves new articles.
 * @param source The RSS source document.
 */
const processSource = async (source: IRssSource) => {
  try {
    console.log(`[RSS] Processing source: ${source.name} (${source.url})`);
    const feed = await parser.parseURL(source.url);
    const newArticles: IFeedItemDocument[] = [];

    for (const item of feed.items) {
      // Use a combination of title and link as a unique external ID
      const externalId = item.link || item.guid || item.title;
      if (!externalId) continue;

      // Check if article already exists
      const existingArticle = await FeedItemModel.findOne({ externalId });
      if (existingArticle) continue;

      // 1. Fetch full content (if link is available)
      const articleLink = item.link;
      let content = item.content || item.contentSnippet || "";
      if (articleLink) {
        const fullContent = await fetchArticleContent(articleLink);
        if (fullContent) {
          content = fullContent;
        }
      }

      // 2. Summarize and Tag using LLM
      const { summary, tags } = await summarizeAndTag(content);

      // 3. Save new article
      const newArticle = new FeedItemModel({
        title: item.title || "No Title",
        content: content,
        source: source.name,
        externalId: externalId,
        summary: summary,
        tags: tags,
        // Assuming the existing feed model handles other fields like category, rankScore
      });

      await newArticle.save();
      newArticles.push(newArticle);
    }

    // Update last fetched time
    source.lastFetched = new Date();
    await source.save();

    console.log(
      `[RSS] Finished processing ${source.name}. Saved ${newArticles.length} new articles.`
    );
  } catch (error) {
    console.error(`[RSS] Failed to process source ${source.name}:`, error);
  }
};

const runFeedScheduler = async () => {
  console.log("[RSS] Starting scheduled feed fetching job...");
  try {
    const activeSources = await RssSource.find({ isActive: true });

    await Promise.all(activeSources.map(processSource));

    console.log("[RSS] Scheduled feed fetching job finished.");
  } catch (error) {
    console.error("[RSS] Error in runFeedScheduler:", error);
  }
};

export const startRssScheduler = () => {
  cron.schedule("*/30 * * * *", runFeedScheduler);
  console.log("RSS Feed Scheduler started. Running every 30 minutes.");
  runFeedScheduler();
};
