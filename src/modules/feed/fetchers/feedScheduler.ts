import { fetchHackerNews } from "./hackerNewsFetcher";
import { fetchReddit } from "./redditFetcher";

export const startFeedScheduler = async () => {
  console.log("Initial feed fetch starting...");
  await fetchHackerNews();
  await fetchReddit();
  setInterval(
    async () => {
      console.log("Updating feeds...");
      await fetchHackerNews();
      await fetchReddit();
    },
    5 * 60 * 1000
  );
};
