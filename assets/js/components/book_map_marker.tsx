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
  }
  public render() {
    return(
      <Marker
        position={{ lat: this.props.bookInstance.location.coordinates[0], lng: this.props.bookInstance.location.coordinates[1]}}
            onClick={this.onToggleOpen}
        >
          {this.state.isOpen && <InfoWindow onCloseClick={this.onToggleOpen}>
            <div>
              {this.props.bookInstance.condition}
            </div>
          </InfoWindow>}
      </Marker>
    )
  }

  private onToggleOpen(){
    this.setState({ isOpen: !this.state.isOpen })
  }
}
