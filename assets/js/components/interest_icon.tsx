import React from "react";
import { Icon } from "semantic-ui-react";

interface Props {
  type: string;
}

export const InterestIcon = (props: Props) => {
  switch (props.type) {
    case "LISTENED":
      return <Icon name="headphones" size={"tiny"}/>;
    case "WATCHED":
      return <Icon name="tv" size={"tiny"}/>;
    case "SAW":
      return <Icon name="pallet" size={"tiny"}/>;
    case "READ":
      return <Icon name="newspaper" size={"tiny"}/>;
  }
};
