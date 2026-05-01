import axios from "axios";
import FeedItemModel from "../feed.model";
import { logger } from "../../../shared/utils/logger";

const SUBREDDITS = ["technology", "programming", "webdev", "artificial"];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const fetchReddit = async () => {
  let totalInserted = 0;
  const failedSubreddits: string[] = [];

  for (const subreddit of SUBREDDITS) {
    try {
      const url = `https://www.reddit.com/r/${subreddit}/top.json?limit=10&t=day`;

      const { data } = await axios.get(url, {
        headers: {
          "User-Agent": "personal-hud-app/1.0 (portfolio project)",
        },
        timeout: 8000,
      });

      const posts = data?.data?.children || [];
      let newCount = 0;

      for (const post of posts) {
        const item = post.data;
        if (!item.title || item.is_self === true) continue; // Skip text-only posts

        const result = await FeedItemModel.updateOne(
          { source: "Reddit", externalId: item.id },
          {
            $setOnInsert: {
              title: item.title,
              content: item.url || item.permalink
                ? `https://reddit.com${item.permalink}`
                : "",
              source: "Reddit",
              category: subreddit,
              popularityScore: item.ups || 0,
              externalId: item.id,
            },
            // Always update popularity score (it changes over time)
            $set: { popularityScore: item.ups || 0 },
          },
          { upsert: true }
        );

        if (result.upsertedCount > 0) newCount++;
      }

      totalInserted += newCount;
      console.log(`Reddit /r/${subreddit}: inserted ${newCount} new items`);

      // Be respectful to Reddit's API — small delay between subreddit requests
      await sleep(300);
    } catch (error: any) {
      console.log(`Error fetching /r/${subreddit}: ${error.message}`);
      failedSubreddits.push(subreddit);
    }
  }

  return { totalInserted, failedSubreddits };
};
