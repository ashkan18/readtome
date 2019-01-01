import * as React from "react"
import { Marker, InfoWindow } from "react-google-maps"
import BookInstance from "../models/book_instance";
import { Button, Card, Icon, Image } from "semantic-ui-react";

interface Props{
  bookInstance: BookInstance
  readToMe(bookInstanceId: string): void
}

interface State{
  isOpen: boolean
}

export default class BookMapMarker extends React.Component<Props, State>{
  public constructor(props, context) {
    super(props, context)
    this.state = { isOpen: false }
  }
  public render() {
    return(
      <Marker
        position={{ lat: this.props.bookInstance.location.coordinates[0], lng: this.props.bookInstance.location.coordinates[1]}}
            onClick={this.openOverlay}
        >
          {this.state.isOpen &&
            <InfoWindow onCloseClick={this.closeOverlay}>
              <Card onClick={this.closeOverlay}>
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
              </Card>
            </InfoWindow>}
      </Marker>
    )
  }

  public openOverlay = () =>
    this.setState({ isOpen: true })

  public closeOverlay = () =>
    this.setState({ isOpen: false })
  private readIt = () => this.props.readToMe(this.props.bookInstance.id)
}
