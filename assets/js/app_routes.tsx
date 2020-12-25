import * as React from 'react'
import { Switch, Route } from 'react-router-dom'


import Login from "./pages/login"
import {Home} from "./pages/home"
import Signup from './pages/sign_up';
import { getToken } from './services/auth_service';
import { Main } from './pages/main';

interface State{
  token?: any
  isLoggedIn: boolean
}

export default class AppRoutes extends React.Component<{}, State> {

  public constructor(props: any, context: any) {
    super(props, context)
    let token = getToken()
    this.state = { token, isLoggedIn: token !== null}
    this.authenticate = this.authenticate.bind(this)
  }

  public render(){
    return(
      <Switch>
        <Route path="/login" render={ () => <Login authenticate={this.authenticate} />} />
        <Route path="/signup" render={ () => <Signup authenticate={this.authenticate}/>} />
        <Route path='/' render={() => <Main/> }/>
      </Switch>)
  }

  public authenticate(token:string){
    this.setState({
      token: token,
      isLoggedIn: true
		})
  }
}
