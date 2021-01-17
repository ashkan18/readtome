import React from "react";
import { Icon } from "semantic-ui-react";

interface Props {
  type: string;
}

export const InterestIcon = (props: Props) => {
  switch (props.type) {
    case "LISTENED":
      return <Icon name="headphones" />;
    case "WATCHED":
      return <Icon name="tv" />;
    case "SAW":
      return <Icon name="pallet" />;
    case "READ":
      return <Icon name="newspaper" />;
  }
};
