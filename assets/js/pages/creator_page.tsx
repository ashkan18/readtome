import * as React from "react";

import { Redirect, useParams } from "react-router";
import {
  Dimmer,
  Divider,
  Feed,
  Header,
  Loader,
  Image,
} from "semantic-ui-react";
import { UserInterest } from "../models/user_interest";
import { Creator } from "../models/creator";
import { getCreator } from "../services/creator_service";
import { interestTypeString } from "../util";

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

  const renderInterest = (interest: UserInterest) => {
    return (
      <Feed.Event>
        <Feed.Label>
          {interest.user?.photos?.length > 0 && (
            <Image src={interest.user.photos[0].thumb} />
          )}
        </Feed.Label>
        <Feed.Content>
          <Feed.Summary>
            <a href={`/users/${interest.user.id}`}>{interest.user.name}</a>
            <b>{interestTypeString(interest.type)}</b>
            <Feed.User as="a" href={interest.ref}>
              <i>{interest.title}</i>
            </Feed.User>{" "}
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
