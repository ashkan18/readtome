import * as React from "react";

import { Redirect } from "react-router";
import {
  Dimmer,
  Divider,
  Feed,
  Header,
  Loader,
  Image,
} from "semantic-ui-react";
import { DateTime } from "luxon";
import { myFeed } from "../services/user_service";
import { UserInterest } from "../models/user_interest";
import { Connection } from "../models/connection";
import { InterestIcon } from "../components/interest_icon";

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

  const renderType = (type: string) => {
    switch (type) {
      case "LISTENED":
        return <b> listened to </b>;
      case "WATCHED":
        return <b> watched </b>;
      case "SAW":
        return <b> saw </b>;
      case "READ":
        return <b> read </b>;
    }
  };

  const renderInterest = (interest: UserInterest) => {
    return (
      <Feed.Event>
        <Feed.Label>
          <InterestIcon type={interest.type} />
        </Feed.Label>
        <Feed.Content>
          <Feed.Summary>
            {renderType(interest.type)}
            <Feed.User as="a" href={interest.ref}>
              <i>{interest.title}</i>
            </Feed.User>{" "}
            by{" "}
            {interest.creators.edges
              .map<React.ReactNode>((i_edge) => (
                <a href={`/creators/${i_edge.node.id}`}> {i_edge.node.name} </a>
              ))
              .reduce((prev, curr) => [prev, ", ", curr])}
            <Feed.Date>
              {DateTime.fromISO(interest.insertedAt, {
                zone: "utc",
              }).toRelative()}
            </Feed.Date>
          </Feed.Summary>

          {interest.thumbnail && (
            <Feed.Extra images>
              <Image
                src={interest.thumbnail}
                size="mini"
                style={{ width: "100px" }}
              />
            </Feed.Extra>
          )}
        </Feed.Content>
      </Feed.Event>
    );
  };

  if (state.error) {
    return <Redirect to="/login" />;
  } else if (state.feed) {
    return (
      <>
        {state.loading && (
          <Dimmer active inverted>
            <Loader inverted content="Loading" />
          </Dimmer>
        )}
        {state.feed && (
          <>
            <Header as="h1">What's up?</Header>
            <Divider />
            <Feed>
              {state.feed.edges.map((i_edge) => renderInterest(i_edge.node))}
            </Feed>
          </>
        )}
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
