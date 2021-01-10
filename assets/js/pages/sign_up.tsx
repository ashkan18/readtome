import * as React from "react";
import { Button, Form, Message } from "semantic-ui-react";
import MainLayout from "../components/main_layout";
import { Header } from "../components/header";
import styled from "styled-components";
import { signUp } from "../services/auth_service";

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
    case "CONFIRMATION_ERROR":
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
  const [emailConfirmation, setEmailConfirmation] = React.useState<
    string | null
  >();
  const [username, setUsername] = React.useState<string | null>();
  const [password, setPassword] = React.useState<string | null>();
  const [passwordConfirmation, setPasswordConfirmation] = React.useState<
    string | null
  >();
  const initialState: State = {
    loading: false,
    signedUp: false,
  };
  const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(
    reducer,
    initialState
  );

  const attemptSignUp = () => {
    if (email !== emailConfirmation) {
      dispatch({
        type: "CONFIRMATION_ERROR",
        data: "Email and confirmation didn't match",
      });
      return;
    } else if (password !== passwordConfirmation) {
      dispatch({
        type: "CONFIRMATION_ERROR",
        data: "Password and confirmation didn't match",
      });
      return;
    }
    signUp(name, username, email, password)
      .then((token) => {
        dispatch({ type: "SUCCESSFUL_SIGNUP", data: token });
      })
      .catch((error) => {
        dispatch({
          type: "SIGNUP_FAILED",
          data: `Couldn't sign up. ${error}`,
        });
      });
  };

  return (
    <MainLayout>
      <Header me={null} />
      <SignUpForm>
        <Form
          onSubmit={() => attemptSignUp()}
          error={state.error !== undefined}
        >
          <Form.Group width={2}>
            <Form.Field>
              <Form.Input
                type="text"
                label="Name"
                placeholder="Name"
                onChange={(event) => setName(event.target.value)}
                disabled={state.loading}
              />
            </Form.Field>
            <Form.Field>
              <Form.Input
                type="text"
                label="Username"
                placeholder="Username"
                onChange={(event) => setUsername(event.target.value)}
                disabled={state.loading}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group width={2}>
            <Form.Field>
              <Form.Input
                label="Email"
                type="email"
                placeholder="Email"
                onChange={(event) => setEmail(event.target.value)}
                disabled={state.loading}
              />
            </Form.Field>
            <Form.Field>
              <Form.Input
                type="email"
                label="Confrim Email"
                placeholder="Confirm Email"
                onChange={(event) => setEmailConfirmation(event.target.value)}
                disabled={state.loading}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group width={2}>
            <Form.Field>
              <Form.Input
                type="password"
                label="Password"
                placeholder="Password"
                onChange={(event) => setPassword(event.target.value)}
                disabled={state.loading}
              />
            </Form.Field>
            <Form.Field>
              <Form.Input
                type="password"
                label="Confirm Password"
                placeholder="Confirm Password"
                onChange={(event) =>
                  setPasswordConfirmation(event.target.value)
                }
                disabled={state.loading}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group width={2}>
            <Form.Field>
              <Button
                basic
                type="submit"
                color="orange"
                loading={state.loading}
              >
                Signup
              </Button>
            </Form.Field>
          </Form.Group>
          <Message error header="Could not sign up." content={state.error} />
        </Form>
      </SignUpForm>
    </MainLayout>
  );
};
