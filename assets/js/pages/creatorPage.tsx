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
import { UserInterest } from "../models/user_interest";
import { Creator } from "../models/creator";
import { getCreator } from "../services/creator_service";

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
        creator: action.data,
        loading: false,
      };
    default:
      return state;
  }
};

interface State {
  creator: Creator;
  loading: boolean;
  error?: string;
}

interface Action {
  data?: Creator;
  error?: string;
  type: string;
}

export const CreatorPage = () => {
  const { creatorId } = useParams<{ creatorId: string }>();
  const initialState = {
    creator: null,
    loading: true,
    error: null,
  };
  const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(
    stateReducer,
    initialState
  );

  const fetchData = () => {
    dispatch({ type: "START_LOADING" });
    getCreator(creatorId)
      .then((creator) => dispatch({ type: "DATA_FETCHED", data: creator }))
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
        <Feed.Content>
          <Feed.Summary>
            {interest.thumbnail && (
              <Image src={interest.thumbnail} size={"tiny"} />
            )}
            <a href={`/users/${interest.user.id}`}>{interest.user.name}</a>
            {renderType(interest.type)}
            <Feed.User as="a" href={interest.ref}>
              <i>{interest.title}</i>
            </Feed.User>{" "}
            <Feed.Date>1 Hour Ago</Feed.Date>
          </Feed.Summary>
        </Feed.Content>
      </Feed.Event>
    );
  };

  if (state.error) {
    return <Redirect to="/login" />;
  } else if (state.creator) {
    return (
      <>
        {state.loading && (
          <Dimmer active inverted>
            <Loader inverted content="Loading" />
          </Dimmer>
        )}
        {state.creator && (
          <>
            <Header as="h1">
              {state.creator.name}'s things (
              {state.creator.userInterests.edges.length})
            </Header>
            <Divider />
            <Feed>
              {state.creator.userInterests.edges.map((i_edge) =>
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
