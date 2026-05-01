import axios from "axios";
import FeedItemModel from "../feed.model";
import { logger } from "../../../shared/utils/logger";

export const fetchDevto = async () => {
  try {
    const { data: posts } = await axios.get(
      "https://dev.to/api/articles?top=1&per_page=20",
      { timeout: 8000 }
    );

    let newCount = 0;

    for (const post of posts) {
      if (!post.title || !post.url) continue;

      const result = await FeedItemModel.updateOne(
        { source: "Dev.to", externalId: String(post.id) },
        {
          $setOnInsert: {
            title: post.title,
            content: post.url,
            source: "Dev.to",
            category: post.tag_list?.[0] || "dev",
            popularityScore: post.public_reactions_count || 0,
            externalId: String(post.id),
            tags: post.tag_list || [],
          },
          $set: { popularityScore: post.public_reactions_count || 0 },
        },
        { upsert: true }
      );

      if (result.upsertedCount > 0) newCount++;
    }

    console.log(`Dev.to: inserted ${newCount} new items`);
  } catch (error: any) {
    console.log(`Error fetching Dev.to: ${error.message}`);
  }
};
