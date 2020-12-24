import * as React from "react";
import { Item } from "semantic-ui-react";
import Book from "../models/book";

interface Props {
  book: Book;
}

export const BookComponent = (props: Props) => {
  const { book } = props;
  return (
    <Item.Group>
      <Item>
        <Item.Image size="tiny" src={book.smallCoverUrl} />
        <Item.Content>
          <Item.Header as="a">{book.title}</Item.Header>
          <Item.Meta>
            {book.authors?.edges.map( edge => edge.node.name).join(",")}
          </Item.Meta>
          <Item.Extra>{book.tags?.join(",")}</Item.Extra>
        </Item.Content>
      </Item>
    </Item.Group>
  );
};
