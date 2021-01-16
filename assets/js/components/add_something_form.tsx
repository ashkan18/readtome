import React from "react";
import { Button, Form, FormGroup, Image } from "semantic-ui-react";
import Book from "../models/book";
import { UnfurledLink } from "../models/user_interest";
import { getToken } from "../services/auth_service";
import { findByISBN } from "../services/book_service";
import { addInterest, unfurlLink } from "../services/interest_service";
import { isUrl } from "../util";
import { AddInterestForm } from "./add_interest_form";
import { BookComponent } from "./book_detail";
import { BookSubmissionForm } from "./book_submission_form";

interface Action {
  unfurledLink?: UnfurledLink;
  book?: Book;
  value?: string;
  error?: string;
  type: string;
  sourceType?: string;
}

interface State {
  unfurledLink?: UnfurledLink;
  source?: string;
  sourceType?: string;
  unfurling: boolean;
  loading: boolean;
  fetched: boolean;
  submitted: boolean;
  book?: Book;
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
      const { unfurledLink } = action;
      return {
        ...state,
        unfurling: false,
        fetched: true,
        unfurledLink: unfurledLink,
      };
    case "FOUND_BOOK":
      const { book } = action;
      return {
        ...state,
        unfurling: false,
        fetched: true,
        book: book,
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
          console.log("---->", data);
          dispatch({ type: "UNFURLED", unfurledLink: data });
        })
        .catch((error) => dispatch({ type: "UNFURL_FAILED" }));
    } else {
      // assume it's isbn
      dispatch({ type: "UNFURLING", sourceType: "isbn" });
      findByISBN(getToken(), state.source)
        .then((book) => dispatch({ type: "FOUND_BOOK", book }))
        .catch((error) => dispatch({ type: "UNFURL_FAILED" }));
    }
  };

  return (
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
      {state.fetched && state.sourceType == "link" && (
        <AddInterestForm
          unfurledLink={state.unfurledLink}
          link={state.source}
        />
      )}
      {state.fetched && state.sourceType == "isbn" && state.book && (
        <>
          <BookComponent book={state.book} />
          <BookSubmissionForm
            book={state.book}
            currentLocation={props.currentLocation}
          />
        </>
      )}
    </Form>
  );
};
