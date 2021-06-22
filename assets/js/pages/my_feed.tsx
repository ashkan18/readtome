import * as React from "react";

import { Redirect } from "react-router";
import {
  Dimmer,
  Divider,
  Header,
  Loader,
} from "semantic-ui-react";
import { myFeed } from "../services/user_service";
import { UserInterest } from "../models/user_interest";
import { Connection } from "../models/connection";
import { FeedComponent } from "../components/feed";
import { useQuery } from 'react-query'

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
  const { isLoading, isError, data } = useQuery('myFeed', myFeed)
  
  if (isError) {
    return <Redirect to="/login" />;
  } 
  
  if (isLoading) {
    return (
      <Dimmer active inverted>
        <Loader inverted content="Loading" />
      </Dimmer>
    );
  }
  if (data) {
    return (
      <>
        <Header as="h1">What's up?</Header>
        <Divider />
        <FeedComponent userInterests={data} loading={isLoading} />
      </>
    );
  }
};
