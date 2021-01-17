import { Connection } from "./connection";
import { Creator } from "./creator";
import Reader from "./reader";

interface serverCoordinate {
  readonly lat: number;
  readonly lng: number;
}
export interface UserInterest {
  id: string;
  title: string;
  type: string;
  ref: string;
  user: Reader;
  thumbnail: string;
  insertedAt: string;
  location: serverCoordinate;
  creators: Connection<Creator>;
}

export interface FetchedSource {
  title: string
  type: string
  creatorNames: string
  image: string
}