import React from "react";
import { Feed, Image } from "semantic-ui-react";
import { UserInterest } from "../models/user_interest";
import { InterestIcon } from "./interest_icon";
import { DateTime } from "luxon";
import { interestTypeString } from "../util";

interface Props {
  userInterest: UserInterest
}
export const FeedItem = (props: Props) => {
  const { userInterest } = props
  return (
    <Feed.Event key={`event_${userInterest.id}`}>
      <Feed.Label>
        <InterestIcon type={userInterest.type} />
      </Feed.Label>
      <Feed.Content>
        <Feed.Summary>
          <a href={`/users/${userInterest.user.id}`}>{userInterest.user.username}</a>
          {' '} {interestTypeString(userInterest.type)} {' '}
          <Feed.User as="a" href={userInterest.ref} target="_blank">
            <i>{userInterest.title}</i>
          </Feed.User>{" "}
          by{" "}
          {userInterest.creators.edges
            .map<React.ReactNode>((i_edge) => (
              <a href={`/creators/${i_edge.node.id}`} key={`creator_link_${i_edge.node.id}`}> {i_edge.node.name} </a>
            ))
            .reduce((prev, curr) => [prev, ", ", curr])}
          <Feed.Date>
            {DateTime.fromISO(userInterest.insertedAt, {
              zone: "utc",
            }).toRelative()}
          </Feed.Date>
        </Feed.Summary>

        {userInterest.thumbnail && (
          <Feed.Extra images>
            <Image
              src={userInterest.thumbnail}
              size="mini"
              style={{ width: "100px" }}
            />
          </Feed.Extra>
        )}
      </Feed.Content>
    </Feed.Event>
  );
};
