import BookInstance from "./book_instance";
import Reader from "./reader";

export default interface Inquiry {
  id: string;
  offering: string;
  user: Reader;
  bookInstance: BookInstance;
}
