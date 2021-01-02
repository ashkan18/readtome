import * as React from "react";

import { Redirect, useParams } from "react-router";
import { Dimmer, Divider, Feed, Header, Icon, Loader } from "semantic-ui-react";
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
            <Feed.User as="a" href={interest.ref}>
              <i>{interest.title}</i>
            </Feed.User>{" "}
            by {interest.user.name}
            <Feed.Date>1 Hour Ago</Feed.Date>
          </Feed.Summary>
          <Feed.Meta>
            <Feed.Like>
              <Icon name="like" />4 Likes
            </Feed.Like>
          </Feed.Meta>
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
