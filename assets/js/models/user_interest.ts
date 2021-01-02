import BookInstance from "./book_instance";
import { Creator } from "./creator";

export default interface UserInterest {
  id: string;
  title: string;
  type: string;
  ref: string;
  creators: Array<Creator>;
}
