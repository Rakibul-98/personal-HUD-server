import axios from "axios";
import FeedItemModel from "../feed.model";

const HN_TOP_STORIES_URL =
  "https://hacker-news.firebaseio.com/v0/topstories.json";

export const fetchHackerNews = async () => {
  try {
    const { data: storyIds } = await axios.get<number[]>(HN_TOP_STORIES_URL);
    const topIds = storyIds.slice(0, 20);

    let newCount = 0;

    for (const id of topIds) {
      const { data: item } = await axios.get(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );

      const result = await FeedItemModel.updateOne(
        { source: "HackerNews", externalId: item.id },
        {
          $setOnInsert: {
            title: item.title,
            content: item.url || "No URL provided",
            source: "HackerNews",
            category: "tech",
            popularityScore: item.score || 0,
            externalId: item.id,
          },
        },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        newCount++;
      }
    }

    `Hacker News feed updated. Inserted ${newCount} new items.`;
  } catch (error) {
    console.error("Error fetching Hacker News:", error);
  }
};
