import * as React from "react"
import { Marker, InfoWindow } from "react-google-maps"
import BookInstance from "../models/book_instance";
import { Button } from "semantic-ui-react";

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
          {this.state.isOpen && <InfoWindow onCloseClick={this.closeOverlay}>
            <div>
              <div>{this.props.bookInstance.book.title}</div>
              <ul>
                <li> {this.props.bookInstance.condition} </li>
                {this.props.bookInstance.book.authors.map( author => <li> {author.name} </li>)}
              </ul>
              <Button basic color='orange' onClick={this.readIt}>Read it!</Button>
            </div>
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
