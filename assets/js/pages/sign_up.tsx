import * as React from "react"
import { Redirect } from "react-router"
import axios, { AxiosRequestConfig, AxiosPromise } from 'axios'
import { Input, Button } from 'semantic-ui-react'


interface Props{
  authenticate: any
}

interface State{
  loading: boolean
  isLoggedIn: boolean
  name: string
  email: string
  userName: string
  password: string
  confirmPassword: string
  error: string
}

export default class Signup extends React.Component<Props, State> {
  public constructor(props, context) {
    super(props, context)
    
    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {loading: false, isLoggedIn: false, userName: '', password: '', confirmPassword: '', error: '', name: '', email: ''}
  }

  public handleSubmit(e){
    e.preventDefault()
    this.setState({ loading: true })
    axios.post("/api/signup", { user: { username: this.state.userName, password: this.state.password } })
    .then( response => {
      this.props.authenticate(response.data.token)
      this.setState({isLoggedIn: true, loading: false})
    }).catch( error => {
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
          <Input error={Boolean(this.state.error)} type="text" placeholder="Name" onChange={this.handlePasswordChange}/>
          <Input error={Boolean(this.state.error)} type="text" placeholder="Username" onChange={this.handleUsernameChange} />
          <Input error={Boolean(this.state.error)} type="email" placeholder="Email" onChange={this.handlePasswordChange}/>
          <Input error={Boolean(this.state.error)} type="email" placeholder="Confirm Email" onChange={this.handlePasswordChange}/>
          <Input error={Boolean(this.state.error)} type="password" placeholder="Password" onChange={this.handlePasswordChange}/>
          <Input error={Boolean(this.state.error)} type="password" placeholder="Confirm Password" onChange={this.handlePasswordChange}/>
          <Button basic color='orange' onSubmit={this.handleSubmit}>Signup</Button>
        </form>
        { this.state.isLoggedIn && <Redirect to="/"/> }
      </div>
    )
  }
}