import createBrowserHistory from 'history/createBrowserHistory';

export default createBrowserHistory({ basename: process.env.REACT_APP_BASEPATH });
