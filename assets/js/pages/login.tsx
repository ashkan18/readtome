import * as React from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { Button, Container, Form, } from "semantic-ui-react";
import { login } from "../services/auth_service";
import { Header } from "../components/header";


interface State {
  loading: boolean
  loggedIn: boolean
  error?: string
}

interface Action {
  type: string;
  data?: string;
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "ATTEMPT_LOGIN":
      return {
        ...state,
        loading: true
      };
    case "SUCCESSFUL_LOGIN":
      return {
        ...state,
        loading: false,
        loggedIn: true
      }
    case "LOGIN_FAILED":
      return {
        ...state,
        loading: false,
        loggedIn: false,
        error: action.data
      }
    default:
      return state;
  }
}

export const Login = () => {
  const initialState: State = {
    loading: false,
    loggedIn: false
  }
  const [userName, setUserName] = React.useState<string | null>(null)
  const [password, setPassword] = React.useState<string | null>(null)
  const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(
    reducer,
    initialState
  );

  const attemptLogin = () => {
    if (userName !== null && password !== null) {
      dispatch({ type: "ATTEMPT_LOGIN" })
      login(userName, password)
        .then((_token) => {
          dispatch({ type: "SUCCESSFUL_LOGIN" })
        })
        .catch((_error) => {
          dispatch({ type: "LOGIN_FAILED", data: "Username and Password don't match, please rety." })
        });
    }
  }

  if (state.loggedIn) {
    return (<Redirect to={"/"} />)
  }
  return (
    <>
      <Header me={null} />
      <Container text style={{ marginTop: '20px' }}>
        <Form onSubmit={() => attemptLogin()}>
          <Form.Group>
            <Form.Field>
              <input placeholder='Username' onChange={(event) => setUserName(event.target.value)} disabled={state.loading} />
            </Form.Field>
            <Form.Field>
              <input placeholder='Password' type="password" onChange={(event) => setPassword(event.target.value)} disabled={state.loading} />
            </Form.Field>
            <Button basic color="orange" type='submit' loading={state.loading}>Login!</Button>
          </Form.Group>
          <div>
            Don't have an account? click <Link to="/signup">here</Link>
          </div>
        </Form>
      </Container>
    </>)
}