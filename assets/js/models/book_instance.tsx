import Coordinate from "./coordinate"

export default interface BookInstance{
  bookId: string
  owner_id: string
  location: Coordinate
}