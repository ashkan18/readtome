import * as React from "react"
import { Marker, InfoWindow } from "react-google-maps"
import BookInstance from "../models/book_instance";

interface Props{
  bookInstance: BookInstance
}

interface State{
  isOpen: boolean
}

export default class BookMapMarker extends React.Component<Props, State>{
  public constructor(props, context) {
    super(props, context)
    this.state = { isOpen: false }
    // this.openOverlay = this.openOverlay.bind(this)
    // this.closeOverlay = this.closeOverlay.bind(this)
  }
  public render() {
    return(
      <Marker
        position={{ lat: this.props.bookInstance.location.coordinates[0], lng: this.props.bookInstance.location.coordinates[1]}}
            onClick={this.openOverlay}
        >
          {this.state.isOpen && <InfoWindow onCloseClick={this.closeOverlay}>
            <div>
              <ul>
                <li> {this.props.bookInstance.condition} </li>
                {this.props.bookInstance.book.authors.map( author => <li> {author.name} </li>)}
              </ul>
            </div>
          </InfoWindow>}
      </Marker>
    )
  }

  public openOverlay = () =>
    this.setState({ isOpen: true })

  public closeOverlay = () =>
    this.setState({ isOpen: false })
}
