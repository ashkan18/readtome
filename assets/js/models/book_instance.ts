import Book from "./book";
import Reader from "./reader";

interface serverCoordinate{
  readonly lat: number
  readonly lng: number
}
export default interface BookInstance{
  id: string
  book: Book
  reader: Reader
  location: serverCoordinate
  condition: string
  offerings: Array<string>
}