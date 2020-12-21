import { GeolocateControl } from "mapbox-gl";
import React, { useState } from "react";
import { Button, Form, FormGroup, Input } from "semantic-ui-react";
import Book from "../models/book";
import { getToken } from "../services/auth_service";
import { submitOffering } from "../services/book_instance_service";

interface Props {
  book: Book;
  currentLocation: any;
}

export const BookSubmissionForm = (props: Props) => {
  const [offerType, setOfferType] = useState<Array<string>>(["READ", "BORROW"]);
  const [medium, setMedium] = useState<string>("PAPERBACK"]);
  const submit = () => {
    const token = getToken();
    submitOffering(
      token,
      props.book.id,
      props.currentLocation.lat,
      props.currentLocation.lng,
      offerType,
      medium
    );
  };

  return (
    <>
      <Form>
        <FormGroup>
          <Input
            type="text"
            placeholder="Offer Type"
            onChange={(_event, data) => setOfferType(data.value)}
          />
        </FormGroup>
        <FormGroup>
          <Button onClick={() => submit()}>Offer!</Button>
        </FormGroup>
      </Form>
    </>
  );
};
