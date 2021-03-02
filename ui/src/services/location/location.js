import { useHistory, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function getOrgSlug() {
  const path = window.location.pathname.replace(
    new RegExp(`^${process.env.PUBLIC_URL}`), '',
  );
  const match = path.match(/[^/]+/);
  const firstPart = match ? match[0] : '';
  if (firstPart !== 'auth-callback') {
    return firstPart;
  }
  return new URLSearchParams(window.location.search).get('orgSlug');
}

function useListenHistory(fn) {
  const [state, setState] = useState(fn());
  const history = useHistory();

  useEffect(() => history.listen(() => {
    const newState = fn();

    if (newState !== state) {
      setState(newState);
    }
  }));

  return state;
}

export function useOrgSlug() {
  // when possible (most of the time) you should use
  // const { orgSlug } = useParams();
  // but that's not possible when you're not inside a <Route>
  // the second preferred option is to use useRouteMatch('/:orgSlug')
  // but there are rendering bugs with that (and seemingly useLocation)
  // (e.g. makes every component that uses useAuth (with useRouteMatch in it)
  // to completely rerender)
  // https://github.com/ReactTraining/react-router/issues/7699
  // so in the meantime when we can't use useParams we'll do this
  return useListenHistory(getOrgSlug);
}

export function useAtHome() {
  const location = useLocation();
  return location.pathname === '/';
}
