import * as React from "react";
import BookInstance from "../models/book_instance";
import { Button, Card, Image } from "semantic-ui-react";
import BookInstanceService from "../services/book_instance_service";
import ProfileGallery from "./profile_gallery";
import AuthService from "../services/auth_service";

interface Props {
  bookInstance: BookInstance;
}

interface State {
  isOpen: boolean;
  inquired: boolean;
  error: string | null;
}

export default class BookInstanceDetail extends React.Component<Props, State> {
  bookInstanceService: BookInstanceService = new BookInstanceService();
  authService: AuthService = new AuthService();
  public constructor(props: Props, context: any) {
    super(props, context);
    this.state = { isOpen: false, inquired: false, error: null };
  }
  public render() {
    const { bookInstance } = this.props;
    return (
      <Card>
        <Image src={bookInstance.book.medium_cover_url} size="small" centered/>
        <Card.Content>
          <Card.Header>{bookInstance.book.title}</Card.Header>
          <Card.Description>
            {bookInstance.book?.authors?.map((author) => author.name).join(",")}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Card.Meta> {bookInstance.book?.tags?.join(",")}</Card.Meta>
          <Card.Meta>{bookInstance.condition}</Card.Meta>
          {bookInstance.reader.photos &&
            bookInstance.reader.photos.length > 0 && (
              <ProfileGallery reader={bookInstance.reader} />
            )}
          <Card.Meta>{bookInstance.reader.name}</Card.Meta>
        </Card.Content>
        {!this.state.inquired && (
          <Button color="orange" onClick={this.readIt}> Read </Button>
        )}
        {this.state.inquired && (
          <Card.Content> Your inquiry is created!</Card.Content>
        )}
      </Card>
    );
  }

  private openOverlay = () => this.setState({ isOpen: true });
  private closeOverlay = () => this.setState({ isOpen: false });
  private readIt = () => {
    this.bookInstanceService
      .inquiry(
        this.authService.getToken(),
        this.props.bookInstance.id,
        "random-type"
      )
      .then((_inquiry: any) => this.setState({ inquired: true }))
      .catch((error: any) => this.setState({ error: error }));
  };
}
