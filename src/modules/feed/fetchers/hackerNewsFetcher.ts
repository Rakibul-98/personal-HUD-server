import axios from "axios";
import FeedItemModel from "../feed.model";
import { logger } from "../../../shared/utils/logger";

const HN_TOP_STORIES_URL =
  "https://hacker-news.firebaseio.com/v0/topstories.json";

const BATCH_SIZE = 5; // Fetch items in small batches to avoid flooding Firebase

export const fetchHackerNews = async () => {
  try {
    const { data: storyIds } = await axios.get<number[]>(HN_TOP_STORIES_URL, {
      timeout: 8000,
    });
    const topIds = storyIds.slice(0, 20);
    let newCount = 0;

    // Process in batches instead of one-by-one
    for (let i = 0; i < topIds.length; i += BATCH_SIZE) {
      const batch = topIds.slice(i, i + BATCH_SIZE);

      const items = await Promise.all(
        batch.map((id) =>
          axios
            .get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
              timeout: 5000,
            })
            .then((r) => r.data)
            .catch(() => null)
        )
      );

      for (const item of items) {
        if (!item || !item.title) continue;

        const result = await FeedItemModel.updateOne(
          { source: "HackerNews", externalId: String(item.id) },
          {
            $setOnInsert: {
              title: item.title,
              content: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
              source: "HackerNews",
              category: "tech",
              popularityScore: item.score || 0,
              externalId: String(item.id),
            },
            $set: { popularityScore: item.score || 0 },
          },
          { upsert: true }
        );

        if (result.upsertedCount > 0) newCount++;
      }
    }

    console.log(`HackerNews: inserted ${newCount} new items`);
  } catch (error: any) {
    console.log(`Error fetching HackerNews: ${error.message}`);
  }
};
