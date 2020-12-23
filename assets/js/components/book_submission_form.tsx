import { GeolocateControl } from "mapbox-gl";
import React, { useState } from "react";
import { Button, Checkbox, Form, FormGroup, Input } from "semantic-ui-react";
import Book from "../models/book";
import { getToken } from "../services/auth_service";
import { submitOffering } from "../services/book_instance_service";

interface Props {
  book: Book;
  currentLocation: any;
}

export const BookSubmissionForm = (props: Props) => {
  const [read, setRead] = useState(true);
  const [borrow, setBorrow] = useState(true);
  const [medium, setMedium] = useState<string>("PAPERBACK");
  const submit = () => {
    const token = getToken();
    let offers = read ? ["READ"] : []
    if (borrow) {
      offers.push('BORROW')
    }
    submitOffering(
      token,
      props.book.id,
      props.currentLocation.lat,
      props.currentLocation.lng,
      offers,
      medium
    );
  };


  return (
    <>
      <Form>
        <Form.Group inline>
          <label>What to offer?</label>
          <Form.Field label='Read' control='input' type='checkbox' name="READ" checked={read} onChange={ (e) => setRead(e.target.checked)}/>
          <Form.Field label='Borrow' control='input' type='checkbox' name="BORROW" checked={borrow} onChange={ (e) => setBorrow(e.target.checked)}/>
        </Form.Group>
        <FormGroup>
          <Button onClick={() => submit()}>Offer!</Button>
        </FormGroup>
      </Form>
    </>
  );
};
