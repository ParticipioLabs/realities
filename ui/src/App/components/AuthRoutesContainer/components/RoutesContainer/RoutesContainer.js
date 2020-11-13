import React from 'react';
import {
  Redirect,
  Router,
  Route,
  Switch,
} from 'react-router-dom';
import history from 'services/history';
import Home from 'scenes/Home';
import RealityDetails from 'scenes/RealityDetails';
import Graph from 'scenes/Graph';
import About from 'scenes/About';
import Profile from 'scenes/Profile';
import UserProfile from 'scenes/UserProfile';
import RealitiesNavbar from './components/RealitiesNavbar';
import RealitiesFooter from './components/RealitiesFooter';

const RoutesContainer = () => (
  <Router history={history}>
    <div>
      <RealitiesNavbar />
      <Switch>
        <Route exact path="/about" component={About} />
        <Route exact path="/:orgSlug/graph" component={Graph} />
        <Route exact path="/:orgSlug/profile" component={Profile} />
        <Route exact path="/:orgSlug/profile/:personId" component={UserProfile} />
        <Route exact path="/:orgSlug/reality/:needId?/:responsibilityId?" component={RealityDetails} />
        <Route path="/:orgSlug/:needId?/:responsibilityId?" component={Home} />
        <Route
          path="/"
          component={
            <Redirect to={`/${process.env.REACT_APP_PLACEHOLDER_ORG_SLUG}`} />
          }
        />
      </Switch>
      <RealitiesFooter />
    </div>
  </Router>
);

export default RoutesContainer;
