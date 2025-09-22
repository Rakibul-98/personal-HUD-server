export interface IFeedItem {
  _id?: string;
  title: string;
  content: string;
  source?: string;
  category?: string;
  popularityScore?: number;
  createdAt?: Date;
}
