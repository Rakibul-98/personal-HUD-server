import SettingsModel from "./settings.model";
import { IUserSettings } from "./settings.interface";
import { fetchHackerNews } from "../feed/fetchers/hackerNewsFetcher";
import { fetchReddit } from "../feed/fetchers/redditFetcher";
import { fetchDevto } from "../feed/fetchers/devToFetcher";

// export const getUserSettings = async (
//   userId: string
// ): Promise<IUserSettings | null> => {
//   return SettingsModel.findOne({ userId });
// };

export const getOrCreateUserSettings = async (
  userId: string
): Promise<IUserSettings> => {
  let settings = await SettingsModel.findOne({ userId });

  if (!settings) {
    settings = await SettingsModel.create({
      userId,
      feedSources: { reddit: true, hackerNews: true, devTo: true },
      sortingPreference: "rank",
      scrollSpeed: 3,
    });
  }

  return settings;
};

export const updateUserSettings = async (
  userId: string,
  updates: Partial<IUserSettings>
): Promise<IUserSettings | null> => {
  return SettingsModel.findOneAndUpdate({ userId }, updates, {
    new: true,
    upsert: true,
  });
};

export const manualFetch = async (userId: string): Promise<string[]> => {
  const settings = await SettingsModel.findOne({ userId });
  if (!settings) throw new Error("User settings not found");

  const fetched: string[] = [];
  const fetchTasks: Promise<void>[] = [];

  if (settings.feedSources.hackerNews) {
    fetchTasks.push(
      (async () => {
        await fetchHackerNews();
        fetched.push("HackerNews");
      })()
    );
  }

  if (settings.feedSources.reddit) {
    fetchTasks.push(
      (async () => {
        await fetchReddit();
        fetched.push("Reddit");
      })()
    );
  }

  if (settings.feedSources.devTo) {
    fetchTasks.push(
      (async () => {
        await fetchDevto();
        fetched.push("Dev.to");
      })()
    );
  }

  await Promise.all(fetchTasks);
  return fetched;
};
