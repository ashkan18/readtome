import React from "react";
import { Card } from "semantic-ui-react";
import { UserInterest } from "../models/user_interest";

interface Props {
  userInterest: UserInterest;
}

export const UserInterestMarker = (props: Props) => {
  const { userInterest } = props;
  return (
    <Card>
      <Card.Content>{userInterest.title}</Card.Content>
    </Card>
  );
};
