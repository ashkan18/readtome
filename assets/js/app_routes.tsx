import * as React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Redirect } from 'react-router'

import Login from "./pages/login"
import Main from "./pages/main"

interface State{
  user?: any
  isLoggedIn: boolean
}

// https://github.com/varunon9/hello-react/blob/master/client/components/AppRoutes.js
export default class AppRoutes extends React.Component<{}, State> {

  public constructor(props, context) {
    super(props, context)
    this.state = { user: null, isLoggedIn: false}
    this.authenticate = this.authenticate.bind(this)
  }

  public render(){
    return(<div className="app-routes">
      <Switch>
        <Route path="/login" render={() => <Login authenticate={this.authenticate} />} />
        <Route path='/' render={() => (
			    	this.state.isLoggedIn ?
			    	        (<Main user={this.state.user} />) :
			    	        (<Redirect to="/login" />)
			    )} />
      </Switch>
    </div>)
  }

  public authenticate(token){
    this.setState({
      user: token,
      isLoggedIn: true
		});
		// updating user's details
		//localStorage.setItem(config.localStorageKey, JSON.stringify(user));
  }
}
