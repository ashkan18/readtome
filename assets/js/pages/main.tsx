import React from "react";
import { Header } from "../components/header";
import MainLayout from "../components/main_layout";
import Reader from "../models/reader";
import { getMe } from "../services/user_service";
import { Redirect, Route, Switch } from "react-router";
import { User } from "./user";
import { CreatorPage } from "./creator_page";
import { ProfilePage } from "./profile_page";
import { MyFeed } from "./my_feed";
import { MapPage } from "./map_page";

export const Main = () => {
  const [me, setMe] = React.useState<Reader | null>(null);
  const [needsLogin, setNeedsLogin] = React.useState(false);
  const [currentLocation, setCurrentLocation] = React.useState<any | null>(
    null
  );

  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    setCurrentLocation({ lat: latitude, lng: longitude });
  });

  React.useEffect(() => {
    const fetchData = () => {
      getMe()
        .then((me) => setMe(me))
        .catch((_error) => setNeedsLogin(true));
    };
    fetchData();
  }, []);

  if (needsLogin) {
    return <Redirect to="/login" />;
  }

  return (
    <MainLayout>
      <Switch>
        <Route path="/feed">
          <Header me={me} currentLocation={currentLocation} />
          <MyFeed />
        </Route>
        <Route path="/users/:userId">
          <Header me={me} currentLocation={currentLocation} />
          <User />
        </Route>
        <Route path="/creators/:creatorId">
          <Header me={me} currentLocation={currentLocation} />
          <CreatorPage />
        </Route>
        <Route path="/profile">
          <Header me={me} currentLocation={currentLocation} />
          <ProfilePage />
        </Route>
        <Route path="/">
          <MapPage me={me} center={currentLocation} />
        </Route>
      </Switch>
    </MainLayout>
  );
};
