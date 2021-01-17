import React from "react";
import { Card, Image } from "semantic-ui-react";
import { UserInterest } from "../models/user_interest";
import { User } from "../pages/user";
import { InterestIcon } from "./interest_icon";

interface Props {
  userInterest: UserInterest;
}

export const UserInterestMarker = (props: Props) => {
  const { userInterest } = props;
  return (
    <Card>
      <Card.Content>
        <Image floated="right" size="tiny" src={userInterest.thumbnail} />
        <Card.Header>{userInterest.title}</Card.Header>
        <Card.Meta>
          {userInterest.creators.edges.map((edge) => edge.node.name).join(",")}
        </Card.Meta>
        <Card.Description as="a" href={`/users/${userInterest.user.id}`}>
          {"  "}
          <InterestIcon type={userInterest.type} />
          {userInterest.user.username}
        </Card.Description>
      </Card.Content>
    </Card>
  );
};
