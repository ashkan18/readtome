import * as React from "react"

import Header from "../components/header";
import Search from "../components/search"
import MapComponent from "../components/map_component";
import Coordinate from "../models/coordinate";
import { Redirect } from "react-router";
import BookInstanceService from "../services/book_instance_service";
import AuthService from "../services/auth_service";
import Reader from "../models/reader";
import BookInstance from "../models/book_instance"
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
  bookInstanceService: BookInstanceService
  authService: AuthService
}

export const Map = (props: Props) => {
  const [bookInstances, setBookInstances] = React.useState<BookInstance[]>([])
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [error, setError] = React.useState<any>()
  const [needsLogin, setNeedsLogin] = React.useState(false)
  const [me, setMe] = React.useState<Reader | null>(null)
  const [offerings, setOfferings] = React.useState<Array<string> | null>(null)

  React.useEffect(() => {
    const fetchData = () => {
      props.authService.me()
      .then(me => setMe(me))
      .catch( _error => setNeedsLogin(true))
    }
    
    fetchData();
  }, [])
  

  const search = (term: string | null) => {
    const coordination = props.initialCoordinate || defaultCoordinate
    const token = props.authService.getToken()
    if (token) {
      props.bookInstanceService.fetchBooks(token, term, coordination.lat, coordination.lng, offerings)
      .then( bookInstances => setBookInstances(bookInstances))
      .catch( _error => setNeedsLogin(true))
    }
  }

  React.useEffect( () => setIsLoaded(true), [bookInstances])
  

  if (needsLogin) {
    return(<Redirect to="/login" />)
  } else if (error) {
    return( <div> Error {error.message} </div>)
  } else if (!isLoaded) {
    return( <Spinner/>)
  } else {
    return(
      <MainLayout>
        <Header me={me}/>
        <Search searchMethod={search}/>
        <MapComponent
            initialCoordinate={props.initialCoordinate || defaultCoordinate}
            bookInstances={bookInstances}
          />
      </MainLayout>
    )
  }
}