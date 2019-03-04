import * as React from "react"
import { compose } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps"

import BookMapMarker from "./book_map_marker";
import Coordinate from "../models/coordinate"
import BookInstance from "../models/book_instance"
import AuthService from "../services/auth_service";


interface GoogleMapProps{
  initialCoordinate: Coordinate
  bookInstances: Array<BookInstance>
  isMarkerShown: boolean
  googleMapURL: string
  loadingElement?: any
  containerElement?: any
  mapElement?: any
}

const GoogleMapComponent = compose(
  withScriptjs,
  withGoogleMap
  )((props: GoogleMapProps) =>
  <GoogleMap
    defaultZoom={13}
    defaultCenter={{ lat: props.initialCoordinate.lat, lng: props.initialCoordinate.lng }}>
    { props.bookInstances && props.bookInstances.map( bi => <BookMapMarker bookInstance={bi} />) }
  </GoogleMap>
)

interface Props{
  bookInstances: Array<BookInstance>
  initialCoordinate: Coordinate
  isMarkerShown: boolean
  googleMapURL: string
  loadingElement: any
  containerElement: any
  mapElement: any
}
export default class MapComponent extends React.Component<Props, {}>{
  Auth: AuthService
  public constructor(props: Props, context: any) {
    super(props, context)
    this.Auth = new AuthService()
  }
  render(){
    return(
      <GoogleMapComponent
          initialCoordinate={{ lat: 40.6904832, lng: -73.9753984}}
          bookInstances={this.props.bookInstances}
          isMarkerShown
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
          loadingElement={this.props.loadingElement}
          containerElement={this.props.containerElement}
          mapElement={this.props.mapElement}
        />
    )
  }
}
