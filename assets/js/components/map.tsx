import * as React from "react"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import styled from 'styled-components'

import Search from "./search"
import Coordinate from "../models/coordinate"
import BookInstace from "../models/book_instance"

interface Props{
  initialCoordinate: Coordinate
  book_instances: Array<BookInstace>
  isMarkerShown: boolean
  googleMapURL: string
  loadingElement?: any
  containerElement?: any
  mapElement?: any
}

interface State {
  book_instances: Array<any>
  searchTerm: string
  isLoaded: boolean
  error?: any
}


const MapComponent = styled.div`
    border-radius: 3px
    border: 2px solid palevioletred
  `

const MyMapComponent = withScriptjs(withGoogleMap((props: Props) =>
  <GoogleMap
    defaultZoom={15}
    defaultCenter={{ lat: props.initialCoordinate.lat, lng: props.initialCoordinate.lng }}
  >
    { props.book_instances.map( book =>
      <Marker position= {{ lat: book.location.coordinates[0], lng: book.location.coordinates[1]}}/>)
    }
  </GoogleMap>
))

export default class Map extends React.Component<Props, State>{
  public constructor(props, context) {
    super(props, context)
    this.state = { book_instances: [], isLoaded: false, error: null, searchTerm: null}
    this.search = this.search.bind(this)
  }
  public componentDidMount() {
    this.fetchResults(null, 40.6904832, -73.9753984)
  }
  public render(){
    const { error, isLoaded, book_instances } = this.state
    if (error) {
      return( <div> Error {error.message} </div>)
    } else if (!isLoaded) {
      return( <div> Loading .... </div>)
    } else {
      return(
        <MapComponent>
          <Search searchMethod={this.search}/>
          <MyMapComponent
              initialCoordinate={{ lat: 40.6904832, lng: -73.9753984}}
              book_instances={book_instances}
              isMarkerShown
              googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `400px` }} />}
              mapElement={<div style={{ height: `100%` }} />}
            />
        </MapComponent>
      )
    }
  }

  private search(term) {
    this.fetchResults(term, 40.6904832, -73.9753984)
  }

  private fetchResults(term: string, lat: number, lng: number){
    fetch(`/api/book_instances?lat=${lat}&lng=${lng}&term=${term}`)
      .then( res => res.json() )
      .then(
        (result) => {
          this.setState({isLoaded: true, book_instances: result.data})
        },
        (error) => {
          this.setState({ isLoaded: true, error})
        }
      )
  }
}