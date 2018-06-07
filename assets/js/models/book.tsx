import Author from "./author"
import BookInstance from "./book_instance"

export default interface Book {
  title: string
  authors: Array<Author>
  instances: Array<BookInstance>
  genres: Array<string>
  location: any
}