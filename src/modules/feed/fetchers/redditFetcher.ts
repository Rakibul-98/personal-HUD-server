import axios from "axios";
import FeedItemModel from "../feed.model";

const SUBREDDITS = ["technology", "worldnews"];

export const fetchReddit = async () => {
  try {
    let newCount = 0;

    for (const subreddit of SUBREDDITS) {
      const url = `https://www.reddit.com/r/${subreddit}/top.json?limit=10&t=day`;
      const { data } = await axios.get(url, {
        headers: { "User-Agent": "hud-app" },
      });

      const posts = data.data.children;

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
    }

    console.log(`Reddit feed updated. Inserted ${newCount} new items.`);
  } catch (error) {
    console.error("Error fetching Reddit:", error);
  }
};
