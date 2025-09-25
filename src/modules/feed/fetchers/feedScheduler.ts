import SettingsModel from "../../settings/settings.model";
import { fetchDevto } from "./devToFetcher";
import { fetchHackerNews } from "./hackerNewsFetcher";
import { fetchReddit } from "./redditFetcher";

export const fetchFeedsForAllUsers = async () => {
  const allSettings = await SettingsModel.find({});

  for (const s of allSettings) {
    const promises: Promise<void>[] = [];

    if (s.feedSources.hackerNews) promises.push(fetchHackerNews());
    if (s.feedSources.reddit) promises.push(fetchReddit().then(() => {}));
    if (s.feedSources.devTo) promises.push(fetchDevto());

    await Promise.all(promises);
  }
};
