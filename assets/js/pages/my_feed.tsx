import * as React from "react";

import { Redirect } from "react-router";
import {
  Dimmer,
  Divider,
  Feed,
  Header,
  Loader,
  Image,
  Container,
} from "semantic-ui-react";
import { DateTime } from "luxon";
import { myFeed } from "../services/user_service";
import { UserInterest } from "../models/user_interest";
import { Connection } from "../models/connection";
import { InterestIcon } from "../components/interest_icon";
import { FeedComponent } from "../components/feed";

const stateReducer = (state, action) => {
  switch (action.type) {
    case "START_LOADING":
      return {
        ...state,
        loading: true,
      };
    case "DATA_FETCHED":
      return {
        ...state,
        feed: action.data,
        loading: false,
      };
    default:
      return state;
  }
};

interface State {
  feed: Connection<UserInterest>;
  loading: boolean;
  error?: string;
}

interface Action {
  data?: Connection<UserInterest>;
  error?: string;
  type: string;
}

export const MyFeed = () => {
  const initialState = {
    feed: null,
    loading: true,
    error: null,
  };
  const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(
    stateReducer,
    initialState
  );

  const fetchData = () => {
    dispatch({ type: "START_LOADING" });
    myFeed()
      .then((feed) => dispatch({ type: "DATA_FETCHED", data: feed }))
      .catch((error) => dispatch({ type: "ERROR", error: error }));
  };

  // load data on page initialized
  React.useEffect(() => {
    fetchData();
  }, []);

  if (state.error) {
    return <Redirect to="/login" />;
  } else if (state.feed) {
    return (
      <>
        <Header as="h1">What's up?</Header>
        <Divider />
        <FeedComponent userInterests={state.feed} loading={state.loading} />
      </>
    );
  } else {
    return (
      <Dimmer active inverted>
        <Loader inverted content="Loading" />
      </Dimmer>
    );
  }
};
