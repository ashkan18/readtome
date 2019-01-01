import Author from "./author"
import BookInstance from "./book_instance"

export default interface Book {
  title: string
  authors: Array<Author>
  instances: Array<BookInstance>
  genres: Array<string>
  medium_cover_url: string
  small_cover_url: string
}