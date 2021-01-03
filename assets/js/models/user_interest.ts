import BookInstance from "./book_instance";
import { Connection } from "./connection";
import { Creator } from "./creator";
import Reader from "./reader";

export interface UserInterest {
  id: string;
  title: string;
  type: string;
  ref: string;
  user: Reader;
  thumbnail: string;
  creators: Connection<Creator>;
}

export interface UnfurledLink {
  title: string
  type: string
  authorName: string
  thumbnail: string
}