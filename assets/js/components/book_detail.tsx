import * as React from "react";
import { Card, Image, Item } from "semantic-ui-react";
import Book from "../models/book";

interface Props {
  book: Book;
}

export const BookComponent = (props: Props) => {
  const { book } = props;
  return (
    <Item.Group>
      <Item>
        <Item.Image size="tiny" src={book.small_cover_url} />
        <Item.Content>
          <Item.Header as="a">{book.title}</Item.Header>
          <Item.Meta>
            {book.authors?.map((author) => author.name).join(",")}
          </Item.Meta>
          <Item.Extra>{book?.tags.join(",")}</Item.Extra>
        </Item.Content>
      </Item>
    </Item.Group>
  );
};
