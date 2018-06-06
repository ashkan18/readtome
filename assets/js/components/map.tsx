import * as React from "react"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import Coordinate from "../models/coordinate"
import Book from "../models/book"

interface Props{
  initialCoordinate: Coordinate
  books: Array<Book>
  isMarkerShown: boolean
  googleMapURL: string
  loadingElement?: any
  containerElement?: any
  mapElement?: any
}

interface State {
  books: Array<any>
  isLoaded: boolean
  error?: any
}

const MyMapComponent = withScriptjs(withGoogleMap((props: Props) =>
  <GoogleMap
    defaultZoom={15}
    defaultCenter={{ lat: props.initialCoordinate.lat, lng: props.initialCoordinate.lng }}
  >
    {props.isMarkerShown && <Marker position={{ lat: 40.6904832, lng: -73.9753984 }} />}
  </GoogleMap>
))

export default class Map extends React.Component<Props, State>{
  public constructor(props, context) {
    super(props, context)
    this.state = { books: [], isLoaded: false, error: null }
  }
  public componentDidMount() {
    fetch(`http://localhost:4000/api/books?lat=${this.props.initialCoordinate.lat}&lng=${this.props.initialCoordinate.lng}`)
      .then( res => res.json() )
      .then( 
        (result) => {
          console.table(result)
          this.setState({isLoaded: true, books: result.data})
        },
        (error) => {
          this.setState({ isLoaded: true, error})
        }
      )
  }
  public render(){
    const { error, isLoaded, books } = this.state
    if (error) {
      return( <div> Error {error.message} </div>)
    } else if (!isLoaded) {
      return( <div> Loading .... </div>)
    } else {
      return(
        <MyMapComponent
            initialCoordinate={{ lat: 40.6904832, lng: -73.9753984}}
            books={this.state.books}
            isMarkerShown
            googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `400px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
      )
    }
  }
}