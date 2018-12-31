import Book from "./book";

interface serverCoordinate{
  readonly coordinates: Array<number>
}
export default interface BookInstance{
  id: string
  book: Book
  owner_id: string
  location: serverCoordinate
  condition: string
}