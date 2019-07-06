import Author from "./author"
import BookInstance from "./book_instance"

interface AuthorConnection {
  edges: Array<Author>
}

export default interface Book {
  id: string
  title: string
  authors: AuthorConnection
  instances: Array<BookInstance>
  genres: Array<string>
  mediumCoverUrl: string
  smallCoverUrl: string
}