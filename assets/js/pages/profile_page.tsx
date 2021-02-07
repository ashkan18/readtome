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
import { getMe, uploadPhoto } from "../services/user_service";
import Reader from "../models/reader";
import { getToken } from "../services/auth_service";

interface State {
  name?: string;
  email?: string;
  emailConfirmation?: string;
  loading: boolean;
  updated: boolean;
  uploading: boolean;
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
    case "PHOTO_UPLOADED":
      return {
        ...state,
        uploading: false,
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
    uploading: false,
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
    dispatch({ type: "UPLOADING_PHOTO" });
    uploadPhoto(getToken(), file).then((user) =>
      dispatch({ type: "PHOTO_UPLOADED", me: user })
    );
  };

  return (
    <Segment basic>
      <Grid columns={2} relaxed="very">
        <Grid.Column width="12">
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
        </Grid.Column>
        <Grid.Column width="2">
          <Image
            as="div"
            src={state?.me?.photos[0]?.thumb}
            size="medium"
            circular
          />
          <Input
            multiple
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => uploadProfilePhoto(e.target.files[0])}
            loading={state.uploading}
          />
        </Grid.Column>
      </Grid>
    </Segment>
  );
};
