import React from "react";
import { Button, Form, FormGroup, Image } from "semantic-ui-react";
import { FetchedSource } from "../models/user_interest";
import { getToken } from "../services/auth_service";
import { addInterest } from "../services/interest_service";

interface Action {
  fetchedSource?: FetchedSource;
  value?: string;
  error?: string;
  type: string;
  sourceType?: string;
}

interface State {
  title?: string;
  lookingFor: boolean;
  creatorNames?: string;
  type?: string;
  image?: string;
  loading: boolean;
  submitted: boolean;
}

interface Props {
  fetchedSource: FetchedSource;
  link: string;
  currentLocation: any;
}

const stateReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "TITLE_CHANGED":
      return {
        ...state,
        title: action.value,
      };
    case "CREATOR_NAMES_CHANGED":
      return {
        ...state,
        creatorNames: action.value,
      };
    case "TYPE_CHANGED":
      return {
        ...state,
        type: action.value,
      };
    case "SUBMITTING":
      return {
        ...state,
        loading: true,
      };
    case "SUBMITTED":
      return {
        ...state,
        loading: false,
        submitted: true,
      };
    default:
      return state;
  }
};

export const AddInterestForm = (props: Props) => {
  const { fetchedSource } = props;
  const initialState = {
    loading: false,
    submitted: false,
    lookingFor: false,
    fetched: false,
    title: fetchedSource.title,
    type: fetchedSource.type,
    creatorNames: fetchedSource.creatorNames,
    image: fetchedSource.image,
  };
  const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(
    stateReducer,
    initialState
  );

  const submit = () => {
    const token = getToken();
    dispatch({ type: "SUBMITTING" });
    addInterest(
      token,
      state.title,
      props.link,
      state.type,
      state.creatorNames.split(","),
      state.image,
      state.lookingFor,
      props.currentLocation?.lat,
      props.currentLocation?.lng,
      props.fetchedSource.externalId,
      props.fetchedSource.metadata
    ).then((_) => dispatch({ type: "SUBMITTED" }));
  };

  return (
    <>
      {!state.submitted && (
        <Form>
          <Form.Group>
            {state.image && <Image size="tiny" src={state.image} />}
          </Form.Group>
          <Form.Group inline>
            <Form.Field
              label="Read"
              control="input"
              type="radio"
              name="type"
              disabled={state.loading}
              checked={state.type === "READ"}
              onChange={(event) =>
                dispatch({ type: "TYPE_CHANGED", value: "READ" })
              }
            />
            <Form.Field
              label="Listened"
              control="input"
              type="radio"
              name="type"
              disabled={state.loading}
              checked={state.type === "LISTENED"}
              onChange={(event) =>
                dispatch({ type: "TYPE_CHANGED", value: "LISTENED" })
              }
            />
            <Form.Field
              label="Watched"
              control="input"
              type="radio"
              name="type"
              disabled={state.loading}
              checked={state.type === "WATCHED"}
              onChange={(event) =>
                dispatch({ type: "TYPE_CHANGED", value: "WATCHED" })
              }
            />
            <Form.Field
              label="Saw"
              control="input"
              type="radio"
              name="type"
              disabled={state.loading}
              checked={state.type === "SAW"}
              onChange={(event) =>
                dispatch({ type: "TYPE_CHANGED", value: "SAW" })
              }
            />
          </Form.Group>
          <Form.Field>
            <Form.Input
              type="text"
              label="Title"
              placeholder="Title"
              value={state.title}
              disabled={state.loading}
              onChange={(event) =>
                dispatch({ type: "TITLE_CHANGED", value: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="By Who?"
              value={state.creatorNames}
              disabled={state.loading}
              placeholder="List creator names comma separated"
              onChange={(event) =>
                dispatch({
                  type: "CREATOR_NAMES_CHANGED",
                  value: event.target.value,
                })
              }
            />
          </Form.Field>
          <FormGroup>
            <Button basic color="orange" onClick={() => submit()}>
              Add!
            </Button>
          </FormGroup>
        </Form>
      )}
      {state.submitted && <div>Thanks for sharing your thingy!</div>}
    </>
  );
};
