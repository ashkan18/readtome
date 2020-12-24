import * as React from "react";
import BookInstance from "../models/book_instance";
import { Button, Card, Image, Item } from "semantic-ui-react";
import { inquiry } from "../services/book_instance_service";
import { getToken } from "../services/auth_service";

interface Props {
  bookInstance: BookInstance;
}

export const BookInstanceDetail = (props: Props) => {
  const [inquired, setInquired] = React.useState(false)
  const [error, setError] = React.useState<string|null>(null)
  const {bookInstance} = props
  const readIt = () => {
    inquiry(
        getToken(),
        bookInstance.id,
        "random-type"
      )
      .then((_inquiry: any) => setInquired(true))
      .catch((error: any) => setError(error));
  }

  return (
    <Card.Group>
      <Card fluid>
        <Card.Content>
          {bookInstance.book.mediumCoverUrl && (<Image
            floated="left"
            size="tiny"
            src={bookInstance.book.mediumCoverUrl}
          />)}
          <Card.Header>{bookInstance.book.title}</Card.Header>
          <Card.Meta>{bookInstance.book.authors.edges.map( edge => edge.node.name).join(",")}</Card.Meta>
          <Card.Meta>{bookInstance.condition}</Card.Meta>
          <Card.Description>
          {bookInstance.book?.tags.join(",")}
          </Card.Description>
        </Card.Content>
      <Card.Content extra>
        {bookInstance.reader?.photos?.length > 0 && (<Image
          floated="right"
          size="mini"
          src={bookInstance.reader.photos?.find(Boolean)?.thumb}
        />)}
        <Card.Header>{bookInstance.reader.name}</Card.Header>
        <Card.Description>
          {bookInstance.reader.name} in interested in{" "}
          <strong>musicians</strong>
        </Card.Description>
      </Card.Content>
      {!inquired && (
        <Card.Content extra>
          <div className="ui buttons">
            <Button basic color="green" onClick={readIt}>
              I'm Interested!
            </Button>
          </div>
        </Card.Content>
      )}
      {inquired && (
        <Card.Content extra>Your inquiry is created!</Card.Content>
      )}
      </Card>
    </Card.Group>
  );
}
