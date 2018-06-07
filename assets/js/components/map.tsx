import * as React from "react"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

import Search from "./search"
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
  searchTerm: string
  isLoaded: boolean
  error?: any
}

const MyMapComponent = withScriptjs(withGoogleMap((props: Props) =>
  <GoogleMap
    defaultZoom={15}
    defaultCenter={{ lat: props.initialCoordinate.lat, lng: props.initialCoordinate.lng }}
  >
    {props.books.map( (book) =>
      <Marker position={{ lat: book.location.coordinates[0] , lng: book.location.coordinates[1] }} />)
    }
  </GoogleMap>
))

export default class Map extends React.Component<Props, State>{
  public constructor(props, context) {
    super(props, context)
    this.state = { books: [], isLoaded: false, error: null, searchTerm: null}
    this.search = this.search.bind(this)
  }
  public componentDidMount() {
    this.fetchResults(null, 40.6904832, -73.9753984)
  }
  public render(){
    const { error, isLoaded, books } = this.state
    if (error) {
      return( <div> Error {error.message} </div>)
    } else if (!isLoaded) {
      return( <div> Loading .... </div>)
    } else {
      return(
        <div>
          <Search searchMethod={this.search}/>
          <MyMapComponent
              initialCoordinate={{ lat: 40.6904832, lng: -73.9753984}}
              books={this.state.books}
              isMarkerShown
              googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `400px` }} />}
              mapElement={<div style={{ height: `100%` }} />}
            />
          </div>
      )
    }
  }

  private search(searchEvent) {
    this.fetchResults(searchEvent.target.value, 40.6904832, -73.9753984)
  }

  private fetchResults(term: string, lat: number, lng: number){
    fetch(`http://localhost:4000/api/book_instances?lat=${lat}&lng=${lng}&term=${term}`)
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
}