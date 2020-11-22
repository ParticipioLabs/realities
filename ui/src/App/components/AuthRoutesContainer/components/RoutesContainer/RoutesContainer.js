import React from 'react';
import {
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import Home from 'scenes/Home';
import RealityDetails from 'scenes/RealityDetails';
import Graph from 'scenes/Graph';
import About from 'scenes/About';
import Profile from 'scenes/Profile';
import UserProfile from 'scenes/UserProfile';
import RealitiesNavbar from './components/RealitiesNavbar';
import RealitiesFooter from './components/RealitiesFooter';

const RoutesContainer = () => (
  <div>
    <RealitiesNavbar />
    <Switch>
      <Route exact path="/:orgSlug/about" component={About} />
      <Route exact path="/:orgSlug/graph" component={Graph} />
      <Route exact path="/:orgSlug/profile" component={Profile} />
      <Route exact path="/:orgSlug/profile/:personId" component={UserProfile} />
      <Route exact path="/:orgSlug/reality/:needId?/:responsibilityId?" component={RealityDetails} />
      <Route path="/:orgSlug/:needId?/:responsibilityId?" component={Home} />
      <Route
        path="/"
        render={
            // this is the only place we should use this env var. in the future
            // the route "/" should be some kind of org select screen
            () => <Redirect to={`/${process.env.REACT_APP_PLACEHOLDER_ORG_SLUG}`} />
          }
      />
    </Switch>
    <RealitiesFooter />
  </div>
);

export default RoutesContainer;
