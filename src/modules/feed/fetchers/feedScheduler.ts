import SettingsModel from "../../settings/settings.model";
import { fetchDevto } from "./devToFetcher";
import { fetchHackerNews } from "./hackerNewsFetcher";
import { fetchReddit } from "./redditFetcher";
import { logger } from "../../../shared/utils/logger";

type FeedSources = {
  reddit?: boolean;
  hackerNews?: boolean;
  devTo?: boolean;
};

/**
 * Fetches feeds based on source toggles.
 *
 * If userId + feedSources provided: fetch only those sources for that user.
 * If no args: iterate all user settings and fetch accordingly.
 */
export const fetchFeedsForAllUsers = async (
  userId?: string,
  feedSources?: FeedSources | null
): Promise<void> => {
  if (userId && feedSources) {
    console.log(`Fetching feeds for user ${userId}`, feedSources);
    await runFetchers(feedSources);
    return;
  }

  // Global refresh — iterate all settings
  const allSettings = await SettingsModel.find({}).lean();

  if (allSettings.length === 0) {
    console.log("No user settings found for global feed refresh");
    return;
  }

  // Aggregate which sources any user needs, fetch each source only once
  const aggregate: FeedSources = { reddit: false, hackerNews: false, devTo: false };
  for (const s of allSettings) {
    if (s.feedSources.reddit) aggregate.reddit = true;
    if (s.feedSources.hackerNews) aggregate.hackerNews = true;
    if (s.feedSources.devTo) aggregate.devTo = true;
  }

  console.log("Global feed refresh — aggregated sources:", aggregate);
  await runFetchers(aggregate);
};

const runFetchers = async (sources: FeedSources): Promise<void> => {
  const tasks: Promise<any>[] = [];
  if (sources.hackerNews) tasks.push(fetchHackerNews());
  if (sources.reddit) tasks.push(fetchReddit());
  if (sources.devTo) tasks.push(fetchDevto());

  await Promise.allSettled(tasks); // allSettled — one failure won't cancel others
};
