import React from "react";
import { Form } from "semantic-ui-react";
import { FetchedSource } from "../models/user_interest";
import { getToken } from "../services/auth_service";
import { findByISBN } from "../services/book_service";
import { unfurlLink } from "../services/interest_service";
import { isISBN, isUrl } from "../util";
import { AddInterestForm } from "./add_interest_form";

interface Action {
  fetchedSource?: FetchedSource;
  value?: string;
  error?: string;
  type: string;
  sourceType?: string;
}

interface State {
  fetchedSource?: FetchedSource;
  source?: string;
  sourceType?: string;
  sourceMetadata?: any;
  unfurling: boolean;
  loading: boolean;
  fetched: boolean;
  submitted: boolean;
}

const stateReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "LINK_CHANGED":
      return {
        ...state,
        source: action.value,
      };
    case "UNFURLING":
      return {
        ...state,
        unfurling: true,
        sourceType: action.sourceType,
      };
    case "UNFURLED":
      return {
        ...state,
        unfurling: false,
        fetched: true,
        fetchedSource: action.fetchedSource,
      };
    case "FOUND_BOOK":
      return {
        ...state,
        unfurling: false,
        fetched: true,
        fetchedSource: action.fetchedSource,
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
    default:
      return state;
  }
};

interface Props {
  currentLocation: any;
}

export const AddSomethingForm = (props: Props) => {
  const initialState = {
    unfurling: false,
    loading: false,
    submitted: false,
    lookingFor: false,
    fetched: false,
  };
  const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(
    stateReducer,
    initialState
  );

  const fetchLink = () => {
    if (isUrl(state.source)) {
      dispatch({ type: "UNFURLING", sourceType: "link" });
      unfurlLink(getToken(), state.source)
        .then((data) => {
          dispatch({ type: "UNFURLED", fetchedSource: data });
        })
        .catch((error) => dispatch({ type: "UNFURL_FAILED" }));
    } else if (isISBN(state.source)) {
      // assume it's isbn
      dispatch({ type: "UNFURLING", sourceType: "isbn" });
      findByISBN(getToken(), state.source)
        .then((fetchedISBN) =>
          dispatch({ type: "FOUND_BOOK", fetchedSource: fetchedISBN })
        )
        .catch((error) => dispatch({ type: "UNFURL_FAILED" }));
    }
  };

  return (
    <>
      <Form>
        <Form.Field>
          <Form.Input
            type="text"
            placeholder="Link or ISBN"
            disabled={state.unfurling || state.loading}
            onChange={(event) =>
              dispatch({ type: "LINK_CHANGED", value: event.target.value })
            }
            onBlur={(_event) => fetchLink()}
            loading={state.unfurling === true}
          />
        </Form.Field>
      </Form>
      {state.fetched && (
        <AddInterestForm
          fetchedSource={state.fetchedSource}
          link={state.source}
          currentLocation={props.currentLocation}
        />
      )}
    </>
  );
};
