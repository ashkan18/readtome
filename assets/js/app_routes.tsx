import * as React from 'react'
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import { Redirect } from 'react-router'

import Login from "./pages/login"
import Main from "./pages/main"
import Signup from './pages/sign_up';

interface State{
  token?: any
  isLoggedIn: boolean
  user?: UserData
}

interface UserData {
  token: string
}

// https://github.com/varunon9/hello-react/blob/master/client/components/AppRoutes.js
export default class AppRoutes extends React.Component<{}, State> {

  public constructor(props, context) {
    super(props, context)
    //const token = localStorage.getItem("token")
    const token = null
    this.state = { token, isLoggedIn: token !== null, user: null}
    this.authenticate = this.authenticate.bind(this)
  }

  public render(){
    return(
      <Switch>
        <Route path="/login" render={ () => <Login authenticate={this.authenticate} />} />
        <Route path="/signup" render={ () => <Signup authenticate={this.authenticate} />} />
        <Route path='/' render={() => (
            this.state.isLoggedIn ?
                    (<Main />) :
                    (<Redirect to="/login" />)
          )} />
      </Switch>)
  }

  public authenticate(token){
    this.setState({
      user: {
        token: token
      },
      isLoggedIn: true
		})
  }
}
