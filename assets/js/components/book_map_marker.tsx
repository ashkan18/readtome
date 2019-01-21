import * as React from "react"
import { Marker, InfoWindow } from "react-google-maps"
import BookInstance from "../models/book_instance";
import { Button, Card, Icon, Image } from "semantic-ui-react";
import BookInstanceService from "js/services/book_instance_service";

interface Props{
  bookInstance: BookInstance
}

interface State{
  isOpen: boolean
  inquired: boolean
  error: string
}

export default class BookMapMarker extends React.Component<Props, State>{
  BookInstanceService: BookInstanceService;
  public constructor(props, context) {
    super(props, context)
    this.BookInstanceService = new BookInstanceService
    this.state = { isOpen: false, inquired: false, error: null }
  }
  public render() {
    return(
      <Marker
        position={{ lat: this.props.bookInstance.location.coordinates[0], lng: this.props.bookInstance.location.coordinates[1]}}
            onClick={this.openOverlay}
        >
          {this.state.isOpen &&
            <InfoWindow onCloseClick={this.closeOverlay}>
              <Card>
                { this.state.inquired &&
                  <Card.Content> Your inquiry is created!</Card.Content>
                }
                { !this.state.inquired &&
                  <>
                    <Card.Content>
                      <Image floated="left" src={this.props.bookInstance.book.small_cover_url} size="mini"/>
                      <Card.Meta> {this.props.bookInstance.book.title}</Card.Meta>
                      <Card.Meta> {this.props.bookInstance.book.authors.map( author => author.name).join(",")}</Card.Meta>
                      <Card.Meta>{this.props.bookInstance.condition}</Card.Meta>
                    </Card.Content>
                    <Card.Content extra>
                      <Icon name='user' /> {this.props.bookInstance.user.name}
                      <Button floated="right" color="orange" onClick={this.readIt}>Read</Button>
                    </Card.Content>
                  </>
                }
              </Card>
            </InfoWindow>}
      </Marker>
    )
  }

  private openOverlay = () => this.setState({ isOpen: true })
  private closeOverlay = () => this.setState({ isOpen: false })
  private readIt = () => {
    this.BookInstanceService.inquiry(this.props.bookInstance.id, "random-type")
    .then( _inquiry => this.setState({inquired: true}))
    .catch( error => this.setState({error: error}))
  }
}
