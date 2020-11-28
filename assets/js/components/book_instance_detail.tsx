import * as React from "react";
import BookInstance from "../models/book_instance";
import { Button, Card, Image, Item } from "semantic-ui-react";
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
      <>
        <Item.Group>
          <Item>
            <Item.Image size="tiny" src={bookInstance.book.medium_cover_url} />
            <Item.Content>
              <Item.Header as="a">{bookInstance.book.title}</Item.Header>
              <Item.Meta>
                {bookInstance.book.authors
                  ?.map((author) => author.name)
                  .join(",")}
              </Item.Meta>
              <Item.Extra>{bookInstance.book?.tags.join(",")}</Item.Extra>
            </Item.Content>
          </Item>
          <Item>
            <Item.Header as="a">{bookInstance.reader.name}</Item.Header>
            <Item.Meta>
              {bookInstance.reader.photos &&
                bookInstance.reader.photos.length > 0 && (
                  <ProfileGallery reader={bookInstance.reader} />
                )}
            </Item.Meta>
          </Item>
        </Item.Group>
        {!this.state.inquired && (
          <Button color="orange" onClick={this.readIt}>
            Read
          </Button>
        )}
        {this.state.inquired && "Your inquiry is created!"}
      </>
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
