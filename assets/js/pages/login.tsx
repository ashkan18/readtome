import * as React from "react"
import { Redirect } from "react-router"
import { Link } from 'react-router-dom'
import { Input, Button } from 'semantic-ui-react'
import AuthService from "js/services/auth_service";


interface Props{
  authenticate: any
}

interface State{
  loading: boolean
  isLoggedIn: boolean
  userName: string
  password: string
  error: string
}

export default class Login extends React.Component<Props, State> {
  Auth: AuthService;
  public constructor(props, context) {
    super(props, context)

    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.Auth = new AuthService()
    this.state = {loading: false, isLoggedIn: false, userName: '', password: '', error: ''}
  }

  public handleSubmit(e){
    e.preventDefault()
    this.setState({ loading: true })
    this.Auth.login(this.state.userName, this.state.password).then( token => {
      this.props.authenticate(token)
      this.setState({isLoggedIn: true, loading: false})
    }).catch( _error => {
      this.setState( {error: "Username and Password don't match, please rety.", loading: false} )
    })
  }

  private handleUsernameChange(evt){
    this.setState({userName: evt.target.value})
  }
  private handlePasswordChange(evt){
    this.setState({password: evt.target.value})
  }

  public render() {
    return(
      <div>
        <div className="error">{ this.state.error }</div>
        <form onSubmit={this.handleSubmit}>
          <Input error={Boolean(this.state.error)} type="text" placeholder="Username" onChange={this.handleUsernameChange} />
          <Input error={Boolean(this.state.error)} type="password" placeholder="Password" onChange={this.handlePasswordChange}/>
          <Button basic color='orange' onSubmit={this.handleSubmit}>Login</Button>
        </form>
        { this.state.isLoggedIn && <Redirect to="/"/> }
        <div>
          Don't have an account? click <Link to="/signup">here</Link>
        </div>
      </div>
    )
  }
}