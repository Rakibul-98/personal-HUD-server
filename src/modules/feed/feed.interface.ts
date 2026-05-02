export interface IFeedItem {
  _id?: string;
  title: string;
  content: string;
  source?: string;
  category?: string;
  summary?: string;
  tags?: string[];
  popularityScore?: number;
  externalId: string;
  isBookmarked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRankedFeedItem extends IFeedItem {
  _id: string;
  rankScore: number;
}
