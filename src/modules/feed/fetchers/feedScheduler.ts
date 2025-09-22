import { fetchHackerNews } from "./hackerNewsFetcher";

export const startFeedScheduler = async () => {
  console.log("Initial feed fetch starting...");
  await fetchHackerNews();
  setInterval(
    async () => {
      console.log("Updating feeds...");
      await fetchHackerNews();
    },
    5 * 60 * 1000
  );
};
