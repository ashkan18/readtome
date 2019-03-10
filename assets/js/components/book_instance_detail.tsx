import * as React from "react"
import BookInstance from "../models/book_instance";
import { Button, Card, Icon, Image } from "semantic-ui-react";
import BookInstanceService from "../services/book_instance_service";

interface Props{
  bookInstance: BookInstance
}

interface State{
  isOpen: boolean
  inquired: boolean
  error: string | null
}

export default class BookInstanceDetail extends React.Component<Props, State>{
  BookInstanceService: BookInstanceService;
  public constructor(props: Props, context: any) {
    super(props, context)
    this.BookInstanceService = new BookInstanceService
    this.state = { isOpen: false, inquired: false, error: null }
  }
  public render() {
    const {bookInstance} = this.props
    return(
      <Card>
        { this.state.inquired &&
          <Card.Content> Your inquiry is created!</Card.Content>
        }
        { !this.state.inquired &&
          <>
            <Card.Content>
              <Image floated="left" src={bookInstance.book.small_cover_url} size="mini"/>
              <Card.Meta> {bookInstance.book.title}</Card.Meta>
              <Card.Meta> {bookInstance.book.authors && bookInstance.book.authors.map( author => author.name).join(",")}</Card.Meta>
              <Card.Meta>{bookInstance.condition}</Card.Meta>
            </Card.Content>
            <Card.Content extra>
              <Icon name='user' /> {bookInstance.reader.name}
              <Button floated="right" color="orange" onClick={this.readIt}>Read</Button>
            </Card.Content>
          </>
        }
      </Card>
    )
  }

  private openOverlay = () => this.setState({ isOpen: true })
  private closeOverlay = () => this.setState({ isOpen: false })
  private readIt = () => {
    this.BookInstanceService.inquiry(this.props.bookInstance.id, "random-type")
    .then( (_inquiry: any) => this.setState({inquired: true}))
    .catch( (error: any) => this.setState({error: error}))
  }
}
