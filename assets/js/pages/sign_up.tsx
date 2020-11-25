import * as React from "react"
import { Redirect } from "react-router"
import axios from 'axios'
import { Input, Button, InputOnChangeData } from 'semantic-ui-react'
import { SyntheticEvent, FormEvent } from "react";
import MainLayout from "../components/main_layout";
import {Header} from "../components/header";
import styled from "styled-components";
import UserService from "../services/user_service";


interface Props{
  authenticate: any
  userService: UserService
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

const SignUpForm = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-grow: 1;
  padding-top: 50px;
`

export default class Signup extends React.Component<Props, State> {
  public constructor(props: Props, context: any) {
    super(props, context)

    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {loading: false, isLoggedIn: false, userName: '', password: '', confirmPassword: '', error: '', name: '', email: ''}
  }

  public handleSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault()
    this.setState({ loading: true })
    axios.post("/api/signup", { user: {
      name: this.state.name,
      email: this.state.email,
      username: this.state.userName,
      password: this.state.password
    } })
    .then( response => {
      this.props.authenticate(response.data.token)
      this.setState({isLoggedIn: true, loading: false})
    }).catch( error => {
      this.setState( {error: "Username and Password don't match, please retry.", loading: false} )
    })
  }

  private handleUsernameChange(_event: SyntheticEvent<HTMLInputElement, Event>, data: InputOnChangeData){
    this.setState({userName: data.value})
  }
  private handleNameChange(_event: SyntheticEvent<HTMLInputElement, Event>, data: InputOnChangeData){
    this.setState({name: data.value})
  }
  private handleEmailChange(_event: SyntheticEvent<HTMLInputElement, Event>, data: InputOnChangeData){
    this.setState({email: data.value})
  }
  private handlePasswordChange(_event: SyntheticEvent<HTMLInputElement, Event>, data: InputOnChangeData){
    this.setState({password: data.value})
  }

  public render() {
    return(
      <MainLayout>
        <Header me={null} userService={this.props.userService}/>
        <SignUpForm>
          <div className="error">{ this.state.error }</div>
          <form onSubmit={this.handleSubmit}>
            <Input error={Boolean(this.state.error)} type="text" placeholder="Name" onChange={this.handleNameChange}/>
            <Input error={Boolean(this.state.error)} type="text" placeholder="Username" onChange={this.handleUsernameChange} />
            <Input error={Boolean(this.state.error)} type="email" placeholder="Email" onChange={this.handleEmailChange}/>
            <Input error={Boolean(this.state.error)} type="email" placeholder="Confirm Email" onChange={this.handlePasswordChange}/>
            <Input error={Boolean(this.state.error)} type="password" placeholder="Password" onChange={this.handlePasswordChange}/>
            <Input error={Boolean(this.state.error)} type="password" placeholder="Confirm Password" onChange={this.handlePasswordChange}/>
            <Button basic color='orange' onSubmit={this.handleSubmit}>Signup</Button>
          </form>
          { this.state.isLoggedIn && <Redirect to="/"/> }
        </SignUpForm>
      </MainLayout>
    )
  }
}