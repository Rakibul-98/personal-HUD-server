export interface IFeedItem {
  _id?: string;
  title: string;
  content: string;
  source?: string;
  category?: string;
  popularityScore?: number;
  externalId: string;
  createdAt?: Date;
}

export interface IRankedFeedItem extends IFeedItem {
  _id: string;
  rankScore: number;
}
