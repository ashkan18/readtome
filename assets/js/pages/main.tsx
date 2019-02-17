import * as React from "react"
import styled from 'styled-components'

import Header from "../components/header";
import Search from "../components/search"
import MapComponent from "../components/map_component";
import Coordinate from "../models/coordinate";
import { Redirect } from "react-router";
import BookInstanceService from "js/services/book_instance_service";
import AuthService from "js/services/auth_service";
import Reader from "js/models/reader";
import { Segment } from "semantic-ui-react";

let coordinate = {lat: 40.6904832, lng: -73.9753984}

interface State {
  currentLocation: Coordinate
  bookInstances: Array<any>
  searchTerm: string
  needsLogin: boolean
  isLoaded: boolean
  error?: any,
  me?: Reader
}

export default class Map extends React.Component<{}, State>{
  BookInstanceService: BookInstanceService
  AuthService: AuthService

  public constructor(props, context) {
    super(props, context)
    this.BookInstanceService = new BookInstanceService()
    this.AuthService = new AuthService()
    this.state = {
      bookInstances: [],
      isLoaded: false,
      error: null,
      searchTerm: null,
      currentLocation: coordinate,
      needsLogin: false,
      me: null
    }
    this.me.bind(this)
    this.me()
    this.search = this.search.bind(this)
  }
  public componentDidMount() {
    this.fetchResults(null, 40.6904832, -73.9753984, null)
  }
  public render(){
    const { error, isLoaded, bookInstances, needsLogin } = this.state
    if (needsLogin) {
      return(<Redirect to="/login" />)
    } else if (error) {
      return( <div> Error {error.message} </div>)
    } else if (!isLoaded) {
      return( <div> Loading .... </div>)
    } else {
      return(
        <Segment.Group>
          <Header me={this.state.me}/>
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
        </Segment.Group>
      )
    }
  }

  private me() {
    this.AuthService.me()
    .then(reader => this.setState({me: reader}) )
    .catch( _error => this.setState({needsLogin: true}))
  }
  private search(term) {
    this.fetchResults(term, 40.6904832, -73.9753984, null)
  }

  private fetchResults(term: string, lat: number, lng: number, offerings: Array<string>){
    this.BookInstanceService.fetchBooks(term, lat, lng, offerings)
      .then( bookInstances => {
          this.setState({isLoaded: true, bookInstances})
        }
      ).catch( _error => {
        this.setState( { needsLogin: true} )
      })
  }
}