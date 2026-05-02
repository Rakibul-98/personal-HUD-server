import SettingsModel from "./settings.model";
import { IUserSettings } from "./settings.interface";
import { fetchHackerNews } from "../feed/fetchers/hackerNewsFetcher";
import { fetchReddit } from "../feed/fetchers/redditFetcher";
import { fetchDevto } from "../feed/fetchers/devToFetcher";
import { logger } from "../../shared/utils/logger";

export const getOrCreateUserSettings = async (userId: string): Promise<IUserSettings> => {
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
  // Whitelist allowed update fields — prevent overwriting userId
  const { feedSources, sortingPreference, scrollSpeed } = updates as any;
  const safeUpdates: Partial<IUserSettings> = {};
  if (feedSources !== undefined) safeUpdates.feedSources = feedSources;
  if (sortingPreference !== undefined) safeUpdates.sortingPreference = sortingPreference;
  if (scrollSpeed !== undefined) safeUpdates.scrollSpeed = scrollSpeed;

  return SettingsModel.findOneAndUpdate({ userId }, safeUpdates, {
    new: true,
    upsert: true,
    runValidators: true,
  });
};

export const manualFetch = async (userId: string): Promise<string[]> => {
  const settings = await SettingsModel.findOne({ userId });
  if (!settings) throw new Error("User settings not found");

  type FetchTask = { name: string; fn: () => Promise<any> };
  const tasks: FetchTask[] = [];

  if (settings.feedSources.hackerNews) tasks.push({ name: "HackerNews", fn: fetchHackerNews });
  if (settings.feedSources.reddit) tasks.push({ name: "Reddit", fn: fetchReddit });
  if (settings.feedSources.devTo) tasks.push({ name: "Dev.to", fn: fetchDevto });

  // allSettled — one failure doesn't cancel the others
  const results = await Promise.allSettled(tasks.map((t) => t.fn()));

  const succeeded: string[] = [];
  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      succeeded.push(tasks[i].name);
    } else {
      console.log(`Manual fetch failed for ${tasks[i].name}: ${result.reason}`);
    }
  });

  return succeeded;
};
