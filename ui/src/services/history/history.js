import createBrowserHistory from 'history/createBrowserHistory';

export default createBrowserHistory({ basename: process.env.PUBLIC_URL });
