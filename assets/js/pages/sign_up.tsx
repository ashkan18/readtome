import * as React from "react";
import { Redirect } from "react-router";
import axios from "axios";
import { Input, Button, InputOnChangeData, Form } from "semantic-ui-react";
import { SyntheticEvent, FormEvent } from "react";
import MainLayout from "../components/main_layout";
import { Header } from "../components/header";
import styled from "styled-components";

const SignUpForm = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-grow: 1;
  padding-top: 50px;
`;

interface State {
  loading: boolean;
  signedUp: boolean;
  error?: string;
}
interface Action {
  type: string;
  data?: string;
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "ATTEMPT_SIGNUP":
      return {
        ...state,
        loading: true,
      };
    case "SUCCESSFUL_SIGNUP":
      return {
        ...state,
        loading: false,
        signedUp: true,
      };
    case "SIGNUP_FAILED":
      return {
        ...state,
        loading: false,
        signedUp: false,
        error: action.data,
      };
    default:
      return state;
  }
};

export const Signup = () => {
  const [name, setName] = React.useState<string | null>();
  const [email, setEmail] = React.useState<string | null>();
  const [username, setUsername] = React.useState<string | null>();
  const [password, setPassword] = React.useState<string | null>();
  const initialState: State = {
    loading: false,
    signedUp: false,
  };
  const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(
    reducer,
    initialState
  );

  const signUp = () => {
    axios
      .post("/api/signup", {
        user: {
          name: name,
          email: email,
          username: username,
          password: password,
        },
      })
      .then((response) => {
        dispatch({ type: "SUCCESSFUL_SIGNUP" });
      })
      .catch((error) => {
        dispatch({
          type: "SIGNUP_FAILED",
          data: "Username and Password don't match, please retry.",
        });
      });
  };

  return (
    <MainLayout>
      <Header me={null} />
      <SignUpForm>
        <Form onSubmit={() => signUp()}>
          <Form.Group width={2}>
            <Form.Field>
              <Input
                type="text"
                placeholder="Name"
                onChange={(event) => setName(event.target.value)}
                disabled={state.loading}
              />
            </Form.Field>
            <Form.Field>
              <Input
                type="text"
                placeholder="Username"
                onChange={(event) => setUsername(event.target.value)}
                disabled={state.loading}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group width={2}>
            <Form.Field>
              <Input
                type="email"
                placeholder="Email"
                onChange={(event) => setEmail(event.target.value)}
                disabled={state.loading}
              />
            </Form.Field>
            <Form.Field>
              <Input
                type="email"
                placeholder="Confirm Email"
                onChange={(event) => setEmail(event.target.value)}
                disabled={state.loading}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group width={2}>
            <Form.Field>
              <Input
                type="password"
                placeholder="Password"
                onChange={(event) => setPassword(event.target.value)}
                disabled={state.loading}
              />
            </Form.Field>
            <Form.Field>
              <Input
                type="password"
                placeholder="Confirm Password"
                onChange={(event) => setPassword(event.target.value)}
                disabled={state.loading}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group width={2}>
            <Form.Field>
              <Button basic type="submit" color="orange">
                Signup
              </Button>
            </Form.Field>
          </Form.Group>
        </Form>
      </SignUpForm>
    </MainLayout>
  );
};
