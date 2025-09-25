import axios from "axios";
import FeedItemModel from "../feed.model";

const SUBREDDITS = ["technology", "programming"];

export const fetchReddit = async () => {
  let totalInserted = 0;
  const failedSubreddits: string[] = [];

  for (const subreddit of SUBREDDITS) {
    try {
      const url = `https://www.reddit.com/r/${subreddit}/top.json?limit=10&t=day`;

      const { data } = await axios.get(url, {
        headers: { "User-Agent": "hud-app" },
        timeout: 5000,
      });

      const posts = data?.data?.children || [];

      let newCount = 0;
      for (const post of posts) {
        const item = post.data;

        const result = await FeedItemModel.updateOne(
          { source: "Reddit", externalId: item.id },
          {
            $setOnInsert: {
              title: item.title,
              content: item.url || "No URL provided",
              source: "Reddit",
              category: subreddit,
              popularityScore: item.ups || 0,
              externalId: item.id,
            },
          },
          { upsert: true }
        );

        if (result.upsertedCount > 0) newCount++;
      }

      totalInserted += newCount;
      `Reddit /r/${subreddit}: Inserted ${newCount} new items.`;
    } catch (error: any) {
      console.error(`Error fetching /r/${subreddit}:`, error.message || error);
      failedSubreddits.push(subreddit);
    }
  }

  return {
    totalInserted,
    failedSubreddits,
  };
};
