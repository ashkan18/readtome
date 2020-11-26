import React, { useState } from "react";
import { Button, Form, FormGroup, Input } from "semantic-ui-react";
import Book from "../models/book";
import { findByISBN } from "../services/book_service";
import { BookComponent } from "./book_detail";

export const BookSubmission = () => {

  const [isbn, setISBN] = useState<string>()
  const [book, setBook] = useState<Book>()
  const search = () => {
    if (isbn !== undefined) {
      findByISBN(null, isbn)
      .then(book => setBook(book))
    }
  }
  return(
    <>
      <Form>
        <FormGroup>
          <Input type="text" placeholder="ISBN" onChange={(_event, data) => setISBN(data.value) }/>
          <Button onClick={() => search()}>Find By ISBN</Button>
        </FormGroup>
      </Form>
      {book && <BookComponent book={book} />}
    </>
  )
}