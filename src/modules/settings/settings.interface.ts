import { Document, Types } from "mongoose";

export interface IUserSettings extends Document {
  userId: Types.ObjectId;
  feedSources: {
    reddit: boolean;
    hackerNews: boolean;
    devTo: boolean;
  };
  sortingPreference: "latest" | "rank" | "popularity";
  theme: "light" | "dark" | "system";
  scrollSpeed: number;
}
