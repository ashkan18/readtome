import * as React from "react";

import { Redirect, useParams } from "react-router";
import {
  Dimmer,
  Divider,
  Feed,
  Header,
  Icon,
  Loader,
  Image,
} from "semantic-ui-react";
import { getReader } from "../services/user_service";
import Reader from "../models/reader";
import { UserInterest } from "../models/user_interest";

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
        user: action.data,
        loading: false,
      };
    default:
      return state;
  }
};

interface State {
  user: Reader;
  loading: boolean;
  error?: string;
}

interface Action {
  data?: Reader;
  error?: string;
  type: string;
}

export const User = () => {
  const { userId } = useParams<{ userId: string }>();
  const initialState = {
    user: null,
    loading: true,
    error: null,
  };
  const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(
    stateReducer,
    initialState
  );

  const fetchData = () => {
    dispatch({ type: "START_LOADING" });
    getReader(userId)
      .then((reader) => dispatch({ type: "DATA_FETCHED", data: reader }))
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

  const renderIcon = (type: string) => {
    switch (type) {
      case "LISTENED":
        return (
          <Feed.Label>
            <Icon name="headphones" />
          </Feed.Label>
        );
      case "WATCHED":
        return (
          <Feed.Label>
            <Icon name="tv" />
          </Feed.Label>
        );
      case "SAW":
        return (
          <Feed.Label>
            <Icon name="pallet" />
          </Feed.Label>
        );
      case "READ":
        return (
          <Feed.Label>
            <Icon name="newspaper" />
          </Feed.Label>
        );
    }
  };

  const renderInterest = (interest: UserInterest) => {
    return (
      <Feed.Event>
        {renderIcon(interest.type)}
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
            <Feed.Date>1 Hour Ago</Feed.Date>
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
  } else if (state.user) {
    return (
      <>
        {state.loading && (
          <Dimmer active inverted>
            <Loader inverted content="Loading" />
          </Dimmer>
        )}
        {state.user.interests && (
          <>
            <Header as="h1">
              {state.user.name}'s things ({state.user.interests.edges.length})
            </Header>
            <Divider />
            <Feed>
              {state.user.interests.edges.map((i_edge) =>
                renderInterest(i_edge.node)
              )}
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
