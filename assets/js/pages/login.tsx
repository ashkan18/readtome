import * as React from "react"
import { Redirect } from "react-router";

interface Props{
  authenticate: any
}

interface State{
  isLoggedIn: boolean
  userName: string
  password: string
  error: string
}

export default class Login extends React.Component<Props, State> {
  public constructor(props, context) {
    super(props, context)
    this.state = {isLoggedIn: false, userName: '', password: '', error: ''}
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
  }

  public handleSubmit(e){
    e.preventDefault()
    this.props.authenticate("token")
    this.setState({isLoggedIn: true})
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
        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder="Username" onChange={this.handleUsernameChange} />
          <input type="password" placeholder="Password" onChange={this.handlePasswordChange}/>
          <button onSubmit={this.handleSubmit} value="Login"/>
        </form>
        { this.state.isLoggedIn && <Redirect to="/"/> }
      </div>
    )
  }
}