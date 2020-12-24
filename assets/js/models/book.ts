import {AuthorNode} from "./author"
import BookInstance from "./book_instance"

interface AuthorConnection {
  edges: Array<AuthorNode>
}

export default interface Book {
  id: string
  title: string
  authors: AuthorConnection
  instances: Array<BookInstance>
  tags: Array<string>
  genres: Array<string>
  mediumCoverUrl: string
  smallCoverUrl: string
}