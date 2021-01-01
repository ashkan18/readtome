import { CreatorNode } from "./creator";
import BookInstance from "./book_instance";

interface CreatorConnection {
  edges: Array<CreatorNode>;
}

export default interface Book {
  id: string;
  title: string;
  creators: CreatorConnection;
  instances: Array<BookInstance>;
  tags: Array<string>;
  genres: Array<string>;
  mediumCoverUrl: string;
  smallCoverUrl: string;
}
