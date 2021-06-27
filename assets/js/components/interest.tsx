import React from "react";
import { Feed, Image } from "semantic-ui-react";
import { UserInterest } from "../models/user_interest";
import { interestTypeString } from "../util";
import { DateTime } from "luxon";
import { InterestIcon } from "./interest_icon";

interface Props {
  interest: UserInterest
}

export const Interest = (props: Props) => {
  const {interest} = props
  return (
    <Feed.Event key={`event_${interest.id}`}>
      <Feed.Label>
        <InterestIcon type={interest.type}/>
      </Feed.Label>
      <Feed.Content>
        <Feed.Summary>
          <b>{interestTypeString(interest.type)} </b>
          <Feed.User as="a" href={interest.ref} target="_blank">
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
