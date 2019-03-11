import * as React from "react"

import Header from "../components/header";
import Search from "../components/search"
import MapComponent from "../components/map_component";
import Coordinate from "../models/coordinate";
import { Redirect } from "react-router";
import BookInstanceService from "../services/book_instance_service";
import AuthService from "../services/auth_service";
import Reader from "../models/reader";
import MainLayout from "./main_layout"
import {Spinner} from "@artsy/palette"

let defaultCoordinate = {lat: 40.690008, lng: -73.9857765}

interface State {
  bookInstances: Array<any>
  searchTerm: string | null
  needsLogin: boolean
  isLoaded: boolean
  error?: any,
  me: Reader | null
}

interface Props {
  initialCoordinate?: Coordinate
}

export default class Map extends React.Component<Props, State>{
  bookInstanceService: BookInstanceService = new BookInstanceService
  authService: AuthService = new AuthService

  public constructor(props: Props, context: any) {
    super(props, context)
    this.state = {
      bookInstances: [],
      isLoaded: false,
      error: null,
      searchTerm: null,
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
      return( <Spinner/>)
    } else {
      return(
        <MainLayout>
          <Header me={this.state.me}/>
          <Search searchMethod={this.search}/>
          <MapComponent
              initialCoordinate={this.props.initialCoordinate || defaultCoordinate}
              bookInstances={bookInstances}
            />
        </MainLayout>
      )
    }
  }

  private me() {
    this.authService.me()
    .then(reader => this.setState({me: reader}) )
    .catch( _error => this.setState({needsLogin: true}))
  }
  private search(term: string | null) {
    this.fetchResults(term, 40.6904832, -73.9753984, null)
  }

  private fetchResults(term: string | null, lat: number, lng: number, offerings: Array<string> | null){
    this.bookInstanceService.fetchBooks(term, lat, lng, offerings)
      .then( bookInstances => this.setState({isLoaded: true, bookInstances}))
      .catch( _error => this.setState( { needsLogin: true} ))
  }
}