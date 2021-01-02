import { Connection } from "./connection";
import { UserInterest } from "./user_interest";

export interface CreatorNode {
  node: Creator;
}
export interface Creator {
  id: string;
  name: string;
  bio: string;
  userInterests: Connection<UserInterest>
}
