import React from "react";
import { Header } from "../components/header";
import Reader from "../models/reader";
import { getMe } from "../services/user_service";
import { Redirect, Route, Switch } from "react-router";
import { User } from "./user";
import { CreatorPage } from "./creator_page";
import { ProfilePage } from "./profile_page";
import { MyFeed } from "./my_feed";
import { MapPage } from "./map_page";
import { Container } from "semantic-ui-react";

export const Main = () => {
  const [me, setMe] = React.useState<Reader | null>(null);
  const [needsLogin, setNeedsLogin] = React.useState(false);
  const [currentLocation, setCurrentLocation] = React.useState<any | null>(
    null
  );

  React.useEffect(() => {
    const fetchData = () => {
      getMe()
        .then((me) => setMe(me))
        .catch((_error) => setNeedsLogin(true));
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCurrentLocation({ lat: latitude, lng: longitude });
    });
  }, [])

  if (needsLogin) {
    return <Redirect to="/login" />;
  }

  return (
    <div style={{ width: "100%", height: "100%", display: "flex" }}>
      <Switch >
        <Route path="/feed">
          <Container>
            <Header me={me} currentLocation={currentLocation} />
            <MyFeed />
          </Container>
        </Route>
        <Route path="/users/:userId">
          <Container>
            <Header me={me} currentLocation={currentLocation} />
            <User />
          </Container>
        </Route>
        <Route path="/creators/:creatorId">
          <Container>
            <Header me={me} currentLocation={currentLocation} />
            <CreatorPage />
          </Container>
        </Route>
        <Route path="/profile">
          <Container>
            <Header me={me} currentLocation={currentLocation} />
            <ProfilePage />
          </Container>
        </Route>
        <Route path="/">
          <MapPage me={me} center={currentLocation} />
        </Route>
      </Switch>
    </div>
  );
};
