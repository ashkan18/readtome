import * as React from "react"
import { Redirect } from "react-router"
import { Link } from 'react-router-dom'
import { Input, Button, InputOnChangeData } from 'semantic-ui-react'
import AuthService from "../services/auth_service";
import { FormEvent, SyntheticEvent } from "react";
import MainLayout from "./main_layout";
import Header from "../components/header";
import styled from "styled-components";


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


const LoginForm = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-grow: 1;
  padding-top: 50px;
`
export default class Login extends React.Component<Props, State> {
  Auth: AuthService;
  public constructor(props: Props, context: any) {
    super(props, context)

    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.Auth = new AuthService()
    this.state = {loading: false, isLoggedIn: false, userName: '', password: '', error: ''}
  }

  public handleSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault()
    this.setState({ loading: true })
    this.Auth.login(this.state.userName, this.state.password).then( token => {
      this.props.authenticate(token)
      this.setState({isLoggedIn: true, loading: false})
    }).catch( _error => {
      this.setState( {error: "Username and Password don't match, please rety.", loading: false} )
    })
  }

  private handleUsernameChange(_event: SyntheticEvent<HTMLInputElement, Event>, data: InputOnChangeData){
    this.setState({userName: data.value})
  }
  private handlePasswordChange(_event: SyntheticEvent<HTMLInputElement, Event>, data: InputOnChangeData){
    this.setState({password: data.value})
  }

  public render() {
    return(
      <MainLayout>
        <Header me={null}/>
        <LoginForm>
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
        </LoginForm>
      </MainLayout>
    )
  }
}