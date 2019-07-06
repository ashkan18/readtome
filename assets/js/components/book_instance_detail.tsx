import * as React from "react";
import BookInstance from "../models/book_instance";
import { Button, Card, Image, Item } from "semantic-ui-react";
import AuthService from "../services/auth_service";
import { inquiry } from "../services/book_instance_service";

interface Props {
  bookInstance: BookInstance;
}

interface State {
  isOpen: boolean;
  inquired: boolean;
  error: string | null;
}

export default class BookInstanceDetail extends React.Component<Props, State> {
  authService: AuthService = new AuthService();
  public constructor(props: Props, context: any) {
    super(props, context);
    this.state = { isOpen: false, inquired: false, error: null };
  }
  public render() {
    const { bookInstance } = this.props;
    return (
      <Card.Group>
        <Card fluid>
          <Card.Content>
            {bookInstance.book.medium_cover_url && (<Image
              floated="left"
              size="tiny"
              src={bookInstance.book.medium_cover_url}
            />)}
            <Card.Header>{bookInstance.book.title}</Card.Header>
            <Card.Meta>{bookInstance.book.authors.edges.map( author => author.node.name).join(",")}</Card.Meta>
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
        {!this.state.inquired && (
          <Card.Content extra>
            <div className="ui buttons">
              <Button basic color="green" onClick={this.readIt}>
                I'm Interested!
              </Button>
            </div>
          </Card.Content>
        )}
        {this.state.inquired && (
          <Card.Content extra>Your inquiry is created!</Card.Content>
        )}
        </Card>
      </Card.Group>
    );
  }

  private openOverlay = () => this.setState({ isOpen: true });
  private closeOverlay = () => this.setState({ isOpen: false });
  private readIt = () => {
    inquiry(
        this.authService.getToken(),
        this.props.bookInstance.id,
        "random-type"
      )
      .then((_inquiry: any) => this.setState({ inquired: true }))
      .catch((error: any) => this.setState({ error: error }));
  };
}
