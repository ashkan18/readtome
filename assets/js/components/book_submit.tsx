import { GeolocateControl } from "mapbox-gl";
import React, { useState } from "react";
import { Button, Form, FormGroup, Input } from "semantic-ui-react";
import Book from "../models/book";
import { getToken } from "../services/auth_service";
import { findByISBN } from "../services/book_service";
import { BookComponent } from "./book_detail";
import { BookSubmissionForm } from "./book_submission_form";

interface Props {
  currentLocation: any;
}

export const BookSubmission = (props: Props) => {
  const [isbn, setISBN] = useState<string>();
  const [book, setBook] = useState<Book>();
  const findByIsbn = () => {
    if (isbn !== undefined) {
      findByISBN(getToken(), isbn).then((book) => setBook(book));
    }
  };
  return (
    <>
      <Form>
        <FormGroup>
          <Input
            type="text"
            placeholder="ISBN"
            onChange={(_event, data) => setISBN(data.value)}
          />
          <Button onClick={() => findByIsbn()}>Find By ISBN</Button>
        </FormGroup>
      </Form>
      {book && (
        <>
          <BookComponent book={book} />
          <BookSubmissionForm
            book={book}
            currentLocation={props.currentLocation}
          />
        </>
      )}
    </>
  );
};
