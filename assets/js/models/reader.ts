import {UserInterest} from "./user_interest";
import {Connection} from "./connection"

export default interface Reader {
  id: string;
  name: string;
  sex: string;
  photos: Array<any>;
  email: string;
  username: string;
  amIFollowing: boolean;
  interests: Connection<UserInterest>
}
