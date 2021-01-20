import React from "react";
import { Header } from "../components/header";
import MainLayout from "../components/main_layout";
import Reader from "../models/reader";
import { getMe } from "../services/user_service";
import { Home } from "../components/home";
import { Redirect, Route, Switch } from "react-router";
import { User } from "./user";
import { CreatorPage } from "./creator_page";
import { ProfilePage } from "./profile_page";
import { MyFeed } from "./my_feed";

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
      <Header me={me} currentLocation={currentLocation} />
      <Switch>
        <Route path="/feed">
          <MyFeed />
        </Route>
        <Route path="/users/:userId">
          <User />
        </Route>
        <Route path="/creators/:creatorId">
          <CreatorPage />
        </Route>
        <Route path="/profile">
          <ProfilePage />
        </Route>
        <Route path="/">
          <Home location={currentLocation} />
        </Route>
      </Switch>
    </MainLayout>
  );
};
