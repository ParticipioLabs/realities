import React from 'react';
import {
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import Home from 'scenes/Home';
import RealityDetails from 'scenes/RealityDetails';
import Graph from 'scenes/Graph';
import Profile from 'scenes/Profile';
import UserProfile from 'scenes/UserProfile';
import OrgSelect from 'scenes/OrgSelect';
import RealitiesNavbar from './components/RealitiesNavbar';
import RealitiesFooter from './components/RealitiesFooter';

const RoutesContainer = () => (
  <div>
    <RealitiesNavbar />
    <Switch>
      <Route exact path="/:orgSlug/graph" component={Graph} />
      <Route exact path="/:orgSlug/profile" component={Profile} />
      <Route exact path="/:orgSlug/profile/:personId" component={UserProfile} />
      {/* redirecting from old url format */}
      <Redirect
        from="/:orgSlug/reality/:needId/:responsibilityId"
        to="/:orgSlug/reality/:responsibilityId"
      />
      <Route exact path="/:orgSlug/reality/:responsibilityId?" component={RealityDetails} />
      {/* redirecting from old url format */}
      <Redirect
        from="/:orgSlug/:needId/:responsibilityId"
        to="/:orgSlug/:responsibilityId"
      />
      <Route path="/:orgSlug/:responsibilityId?" component={Home} />
      <Route path="/" component={OrgSelect} />
    </Switch>
    <RealitiesFooter />
  </div>
);

export default RoutesContainer;
