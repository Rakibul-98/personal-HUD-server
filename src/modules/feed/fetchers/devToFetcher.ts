import axios from "axios";
import FeedItemModel from "../feed.model";

export const fetchDevto = async () => {
  try {
    const { data: posts } = await axios.get(
      "https://dev.to/api/articles?top=1&per_page=20"
    );

    let newCount = 0;

    for (const post of posts) {
      const result = await FeedItemModel.updateOne(
        { source: "Dev.to", externalId: post.id },
        {
          $setOnInsert: {
            title: post.title,
            content: post.url,
            source: "Dev.to",
            category: post.tag_list?.[0] || "dev",
            popularityScore: post.public_reactions_count || 0,
            externalId: post.id,
          },
        },
        { upsert: true }
      );

      if (result.upsertedCount > 0) newCount++;
    }

    console.log(`Dev.to feed updated. Inserted ${newCount} new items.`);
  } catch (error) {
    console.error("Error fetching Dev.to:", error);
  }
};
