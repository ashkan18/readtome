
interface serverCoordinate{
  readonly coordinates: Array<number>
}
export default interface BookInstance{
  bookId: string
  owner_id: string
  location: serverCoordinate
}