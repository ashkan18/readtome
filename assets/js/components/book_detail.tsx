import * as React from "react"
import { Card, Image } from "semantic-ui-react";
import Book from "../models/book";

interface Props{
  book: Book
}

export const BookComponent = (props: Props) => {
  const {book} = props
  return(
    <Card>
      <Card.Content>
        <Image floated="left" src={book.small_cover_url} size="mini"/>
        <Card.Meta> {book.title}</Card.Meta>
        <Card.Meta> {book.authors && book.authors.map( author => author.name).join(",")}</Card.Meta>
        <Card.Meta> {book?.tags.join(",")}</Card.Meta>
      </Card.Content>
    </Card>
  )
}
