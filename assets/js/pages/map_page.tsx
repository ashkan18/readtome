import * as React from "react";
import ReactMapboxGl, { Feature, Layer, Marker, Popup } from "react-mapbox-gl";

import { Coordinate } from "../models/coordinate";
import { svg } from "../components/icon";
import { UserInterest } from "../models/user_interest";
import { UserInterestMarker } from "../components/user_interest_marker";
import { Dimmer, Icon, Loader } from "semantic-ui-react";
import Reader from "../models/reader";
import { Header } from "../components/header";
import { getToken } from "../services/auth_service";
import { fetchUserInterest } from "../services/interest_service";

const Map = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoiYXNoa2FuMTgiLCJhIjoiY2pzdnk5eGRpMGMxcTN5bzRsOHRjdDR2cCJ9.qaLMKiKsDDLnMPLJ-s4rIQ",
  minZoom: 8,
  maxZoom: 15,
});

const mapStyle = {
  flex: 1,
};

const flyToOptions = {
  speed: 0.8,
};

const layoutLayer = { "icon-image": "londonCycle" };

// Create an image for the Layer
const image = new Image();
image.src = "data:image/svg+xml;charset=utf-8;base64," + btoa(svg);
const images: any = ["londonCycle", image];

interface Props {
  center: Coordinate;
  me: Reader | null;
  onStyleLoad?: (map: any) => any;
  switchPage?: (any) => void;
}

interface State {
  selectedUserInterest?: UserInterest;
  userInterests: Array<UserInterest>;
  zoom: number;
  centerLat?: number;
  centerLng?: number;
}

interface Action {
  type: string;
  item?: UserInterest;
  userInterests?: Array<UserInterest>;
  coordinate?: { lat: number; lng: number };
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "INSTANCE_SELECTED":
      const selectedUserInterest = action.item;
      return {
        ...state,
        selectedUserInterest: selectedUserInterest,
        zoom: 15,
        centerLat: selectedUserInterest.location.lat,
        centerLng: selectedUserInterest.location.lng,
      };
    case "RESET_SELECT":
      if (state.selectedUserInterest !== undefined)
        return { ...state, selectedUserInterest: undefined };
      else return state;
    case "GOT_USER_INTERESTS":
      return { ...state, userInterests: action.userInterests };
    case "GOT_CURRENT_LOCATION":
      if (action.coordinate !== null) {
        return {
          ...state,
          centerLat: action.coordinate.lat,
          centerLng: action.coordinate.lng,
        };
      } else {
        return state;
      }

    default:
      return state;
  }
};

export const MapPage = (props: Props) => {
  const initialState = {
    userInterests: [],
    zoom: 13,
  };

  const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(
    reducer,
    initialState
  );

  const onDrag = () => {
    dispatch({ type: "RESET_SELECT" });
  };
  const onToggleHover = (cursor: string, { map }: { map: any }) => {
    map.getCanvas().style.cursor = cursor;
  };

  const onMarkerClick = (userInterest: UserInterest) => {
    dispatch({ type: "INSTANCE_SELECTED", item: userInterest });
  };

  const search = (term: string | null, location: Coordinate = props.center) => {
    const token = getToken();
    if (token && location?.lat) {
      dispatch({ type: "FETCHING_USER_INTERESTS" });
      fetchUserInterest(token, term, location.lat, location.lng)
        .then((userInterests) =>
          dispatch({ type: "GOT_USER_INTERESTS", userInterests })
        )
        .catch((_error) => dispatch({ type: "GETTING_USER_INTERESTS_FAILED" }));
    }
  };

  React.useEffect(() => {
    if (props.center) {
      setTimeout(() => search(null, props.center), 1200);
      dispatch({ type: "GOT_CURRENT_LOCATION", coordinate: props.center });
    }
  }, [props.center]);

  if (!props.center) {
    return (
      <Dimmer active inverted>
        <Loader inverted content="🌎 Getting your location..." />
      </Dimmer>
    );
  }

  return (
    <Map
      style="mapbox://styles/ashkan18/ckhzblkri2mr719n224l706o0"
      containerStyle={mapStyle}
      flyToOptions={flyToOptions}
      onDrag={onDrag}
      center={state.centerLng && [state.centerLng, state.centerLat]}
      zoom={[state.zoom]}
      movingMethod={"easeTo"}
    >
      <Header me={props.me} currentLocation={props.center} />
      <Marker coordinates={[props.center.lng, props.center.lat]}>
        <Icon name="user circle outline" color="orange" size="big" />
      </Marker>
      <Layer type="symbol" id="marker" layout={layoutLayer} images={images}>
        {state.userInterests?.map((bi, index) => (
          <Feature
            key={bi.id}
            onMouseEnter={onToggleHover.bind(this, "pointer")}
            onMouseLeave={onToggleHover.bind(this, "")}
            onClick={() => onMarkerClick(bi)}
            coordinates={[bi.location.lng, bi.location.lat]}
          />
        ))}
      </Layer>

      {state.selectedUserInterest && (
        <Popup
          coordinates={[
            state.selectedUserInterest.location.lng,
            state.selectedUserInterest.location.lat,
          ]}
          anchor="bottom"
          offset={[0, -15]}
        >
          <UserInterestMarker userInterest={state.selectedUserInterest} />
        </Popup>
      )}
    </Map>
  );
};
