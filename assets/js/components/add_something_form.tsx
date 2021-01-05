import React from "react";
import { Button, Form, FormGroup, Image } from "semantic-ui-react";
import { UnfurledLink } from "../models/user_interest";
import { getToken } from "../services/auth_service";
import { addInterest, unfurlLink } from "../services/interest_service";

interface Action {
  data?: UnfurledLink;
  value?: string;
  error?: string;
  type: string;
}

interface State {
  title?: string;
  link?: string;
  creatorNames?: string;
  type?: string;
  thumbnail?: string;
  unfurling: boolean;
  loading: boolean;
  submitted: boolean;
}

const stateReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "UNFURLING":
      return {
        ...state,
        unfurling: true,
      };
    case "UNFURLED":
      const { data } = action;
      return {
        ...state,
        unfurling: false,
        title: data.title,
        type: data.type,
        creatorNames: data.authorName,
        thumbnail: data.thumbnail,
      };
    case "UNFURL_FAILED":
      return {
        ...state,
        unfurling: false,
        title: undefined,
        type: undefined,
        creatorNames: undefined,
        thumbnail: undefined,
      };
    case "TITLE_CHANGED":
      return {
        ...state,
        title: action.value,
      };
    case "LINK_CHANGED":
      return {
        ...state,
        link: action.value,
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

export const AddSomethingForm = () => {
  const initialState = {
    unfurling: false,
    loading: false,
    submitted: false,
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
      state.link,
      state.type,
      state.creatorNames.split(",")
    ).then(() => dispatch({ type: "SUBMITTED" }));
  };

  const fetchLink = () => {
    dispatch({ type: "UNFURLING" });
    unfurlLink(getToken(), state.link)
      .then((data) => {
        dispatch({ type: "UNFURLED", data: data });
      })
      .catch((error) => dispatch({ type: "UNFURL_FAILED" }));
  };

  return (
    <>
      {!state.submitted && (
        <Form>
          <Form.Field>
            <Form.Input
              type="text"
              label="Link"
              placeholder="Link"
              disabled={state.unfurling || state.loading}
              onChange={(event) =>
                dispatch({ type: "LINK_CHANGED", value: event.target.value })
              }
              onBlur={(event) => fetchLink()}
              loading={state.unfurling === true}
            />
          </Form.Field>
          <Form.Group>
            {state.thumbnail && <Image size="tiny" src={state.thumbnail} />}
          </Form.Group>
          <Form.Group inline>
            <Form.Field
              label="Read"
              control="input"
              type="radio"
              name="type"
              disabled={state.unfurling || state.loading}
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
              disabled={state.unfurling || state.loading}
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
              disabled={state.unfurling || state.loading}
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
              disabled={state.unfurling || state.loading}
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
              disabled={state.unfurling || state.loading}
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
              disabled={state.unfurling || state.loading}
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
