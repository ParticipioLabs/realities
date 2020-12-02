// eslint-disable-next-line import/prefer-default-export
export function getOrgSlug() {
  // when possible (most of the time) you should use
  // const { orgSlug } = useParams();
  // but that's not possible when you're not inside a <Route>
  // the second preferred option is to use useRouteMatch('/:orgSlug')
  // but there are rendering bugs with that (e.g. makes every component that
  // uses useAuth (with useRouteMatch in it) to completely rerender)
  // https://github.com/ReactTraining/react-router/issues/7699
  // so in the meantime when we can't use useParams we'll do this
  const match = window.location.pathname.match(/[^/]+/);
  return match ? match[0] : '';
}
