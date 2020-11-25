import * as React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Redirect } from 'react-router'

import Login from "./pages/login"
import {Map} from "./pages/map"
import Signup from './pages/sign_up';
import AuthService from './services/auth_service';
import BookInstanceService from './services/book_instance_service'
import UserService from './services/user_service'

interface State{
  token?: any
  isLoggedIn: boolean
}

export default class AppRoutes extends React.Component<{}, State> {
  authService: AuthService = new AuthService;
  bookInstanceServcie: BookInstanceService = new BookInstanceService
  userService: UserService = new UserService(this.authService)

  public constructor(props: any, context: any) {
    super(props, context)
    let token = this.authService.getToken()
    this.state = { token, isLoggedIn: token !== null}
    this.authenticate = this.authenticate.bind(this)
  }

  public render(){
    return(
      <Switch>
        <Route path="/login" render={ () => <Login authenticate={this.authenticate} />} />
        <Route path="/signup" render={ () => <Signup authenticate={this.authenticate} />} />
        <Route path='/' render={() => 
          <Map bookInstanceService={this.bookInstanceServcie} authService={this.authService} userService={this.userService}/>
        }/>
      </Switch>)
  }

  public authenticate(token:string){
    this.setState({
      token: token,
      isLoggedIn: true
		})
  }
}
