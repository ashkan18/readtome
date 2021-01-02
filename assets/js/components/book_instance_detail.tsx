import * as React from "react";
import BookInstance from "../models/book_instance";
import { Button, Card, Form, FormGroup, Image } from "semantic-ui-react";
import { getToken } from "../services/auth_service";
import { showInterest } from "../services/connector_service";

interface Props {
  bookInstance: BookInstance;
  switchPage?: (any) => void;
}

export const BookInstanceDetail = (props: Props) => {
  const [inquired, setInquired] = React.useState(false);
  const [offer, setOffer] = React.useState("READ");
  const [error, setError] = React.useState<string | null>(null);
  const { bookInstance } = props;
  const readIt = () => {
    showInterest(getToken(), bookInstance.id, offer)
      .then((_inquiry: any) => setInquired(true))
      .catch((error: any) => setError(error));
  };
  console.log(bookInstance.id);
  return (
    <Card.Group>
      <Card fluid>
        <Card.Content>
          {bookInstance.book.mediumCoverUrl && (
            <Image
              floated="left"
              size="tiny"
              src={bookInstance.book.mediumCoverUrl}
            />
          )}
          <Card.Header>{bookInstance.book.title}</Card.Header>
          <Card.Meta>
            {bookInstance.book.creators.edges
              .map((edge) => edge.node.name)
              .join(",")}
          </Card.Meta>
          <Card.Meta>{bookInstance.condition}</Card.Meta>
          <Card.Meta> {bookInstance.book?.tags?.join(",")}</Card.Meta>
        </Card.Content>
        <Card.Content extra>
          {bookInstance.reader?.photos?.length > 0 && (
            <Image
              floated="right"
              size="mini"
              src={bookInstance.reader.photos?.find(Boolean)?.thumb}
            />
          )}
          <Card.Header
            as="a"
            onClick={() =>
              props.switchPage({
                ref: "user",
                params: { id: bookInstance.reader.id },
              })
            }
          >
            {bookInstance.reader.name}
          </Card.Header>
          <Card.Description>
            {bookInstance.reader.name} in interested in{" "}
            <strong>musicians</strong>
          </Card.Description>
        </Card.Content>
        {!inquired && (
          <Card.Content extra>
            <Form size={"tiny"}>
              <Form.Group inline>
                <label>Interested in:</label>
                <Form.Field
                  label="Read"
                  control="input"
                  type="radio"
                  name="offer"
                  onChange={(e) => setOffer("READ")}
                />
                <Form.Field
                  label="Borrow"
                  control="input"
                  type="radio"
                  name="offer"
                  onChange={(e) => setOffer("BORROW")}
                />
              </Form.Group>
              <FormGroup>
                <Button basic color="green" onClick={readIt}>
                  I'm Interested!
                </Button>
              </FormGroup>
            </Form>
          </Card.Content>
        )}
        {inquired && (
          <Card.Content extra>Your inquiry is created!</Card.Content>
        )}
      </Card>
    </Card.Group>
  );
};
