import * as React from "react"
import styled from 'styled-components'

import Header from "../components/header";
import Search from "../components/search"
import MapComponent from "../components/map_component";
import Coordinate from "../models/coordinate";

let coordinate = {lat: 40.6904832, lng: -73.9753984}

const MainComponent = styled.div`
  border-radius: 3px;
  border: 2px solid palevioletred;
`
interface State {
  currentLocation: Coordinate
  bookInstances: Array<any>
  searchTerm: string
  isLoaded: boolean
  error?: any
}

interface Props {
  user: any
}

export default class Map extends React.Component<Props, State>{
  public constructor(props, context) {
    super(props, context)
    this.state = { bookInstances: [], isLoaded: false, error: null, searchTerm: null, currentLocation: coordinate}
    this.search = this.search.bind(this)
  }
  public componentDidMount() {
    this.fetchResults(null, 40.6904832, -73.9753984)
  }
  public render(){
    const { error, isLoaded, bookInstances } = this.state
    if (error) {
      return( <div> Error {error.message} </div>)
    } else if (!isLoaded) {
      return( <div> Loading .... </div>)
    } else {
      return(
        <MainComponent>
          <Header/>
          <Search searchMethod={this.search}/>
          <MapComponent
              initialCoordinate={this.state.currentLocation}
              bookInstances={bookInstances}
              isMarkerShown
              googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `400px` }} />}
              mapElement={<div style={{ height: `100%` }} />}
            />
        </MainComponent>
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
          this.setState({isLoaded: true, bookInstances: result.data})
        },
        (error) => {
          this.setState({ isLoaded: true, error})
        }
      )
  }
}