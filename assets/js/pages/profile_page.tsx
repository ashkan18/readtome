import * as React from "react";
import {
  Button,
  Form,
  Message,
  Image,
  Segment,
  Grid,
  Input,
} from "semantic-ui-react";
import styled from "styled-components";
import { getMe, uploadPhoto } from "../services/user_service";
import Reader from "../models/reader";

const SignUpForm = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-grow: 1;
  padding-top: 50px;
`;

interface State {
  name?: string;
  email?: string;
  emailConfirmation?: string;
  loading: boolean;
  updated: boolean;
  me?: Reader;
  error?: string;
}
interface Action {
  type: string;
  data?: string;
  me?: Reader;
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "ATTEMPT_PROFILE_UPDATE":
      return {
        ...state,
        loading: true,
      };
    case "SUCCESSFUL_PROFILE_UPDATE":
      return {
        ...state,
        loading: false,
        signedUp: true,
      };
    case "PROFILE_UPDATE_FAILED":
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
    case "GOT_ME":
      return {
        ...state,
        me: action.me,
      };
    default:
      return state;
  }
};

export const ProfilePage = () => {
  const initialState: State = {
    loading: false,
    updated: false,
  };
  const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(
    reducer,
    initialState
  );

  React.useEffect(() => {
    const fetchData = () => {
      getMe()
        .then((me) => dispatch({ type: "GOT_ME", me }))
        .catch((_error) => dispatch({ type: "GOT_ME_FAILED" }));
    };
    fetchData();
  }, []);

  const attemptUpdate = () => {
    if (state.email !== state.emailConfirmation) {
      dispatch({
        type: "CONFIRMATION_ERROR",
        data: "Email and confirmation didn't match",
      });
      return;
    }
    // signUp(name, username, email, password)
    //   .then((token) => {
    //     dispatch({ type: "SUCCESSFUL_SIGNUP", data: token });
    //   })
    //   .catch((error) => {
    //     dispatch({
    //       type: "SIGNUP_FAILED",
    //       data: `Couldn't sign up. ${error}`,
    //     });
    //   });
  };

  const uploadProfilePhoto = (file: any) => {
    // uploadPhoto(file).then((user) => setPhotos(user.photos));
  };

  return (
    <Segment basic>
      <Grid columns={2} relaxed="very">
        <Grid.Column width="3">
          <Image as="div" src={state?.me?.photos[0]?.thumb} size="medium" />
          <Input multiple type="file" accept="image/png, image/jpeg" />
        </Grid.Column>
        <Grid.Column>
          <SignUpForm>
            <Form
              onSubmit={() => attemptUpdate()}
              error={state.error !== undefined}
            >
              <Form.Group width={2}>
                <Form.Field>
                  <Form.Input
                    type="text"
                    label="Name"
                    placeholder="Name"
                    value={state.name || state.me?.name}
                    onChange={(event) =>
                      dispatch({
                        type: "NAME_UPDATE",
                        data: event.target.value,
                      })
                    }
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
                    value={state.email || state.me?.email}
                    onChange={(event) =>
                      dispatch({
                        type: "EMAIL_UPDATE",
                        data: event.target.value,
                      })
                    }
                    disabled={state.loading}
                  />
                </Form.Field>
                <Form.Field>
                  <Form.Input
                    type="email"
                    label="Confrim Email"
                    placeholder="Confirm Email"
                    value={state.emailConfirmation || state.me?.email}
                    onChange={(event) =>
                      dispatch({
                        type: "EMAIL_CONFIRMATION_UPDATE",
                        data: event.target.value,
                      })
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
                    Update
                  </Button>
                </Form.Field>
              </Form.Group>
              <Message
                error
                header="Could not sign up."
                content={state.error}
              />
            </Form>
          </SignUpForm>
        </Grid.Column>
      </Grid>
    </Segment>
  );
};
