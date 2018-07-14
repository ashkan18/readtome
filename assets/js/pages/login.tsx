import * as React from "react"
import { Redirect } from "react-router"
import { Link } from 'react-router-dom'
import axios, { AxiosRequestConfig, AxiosPromise } from 'axios'
import { Input, Button } from 'semantic-ui-react'


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
  public constructor(props, context) {
    super(props, context)


    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {loading: false, isLoggedIn: false, userName: '', password: '', error: ''}
  }

  public handleSubmit(e){
    e.preventDefault()
    this.setState({ loading: true })
    axios.post("/api/login", { user: { username: this.state.userName, password: this.state.password } })
    .then( response => {
      this.props.authenticate(response.data.token)
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