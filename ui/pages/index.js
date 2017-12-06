import App from '../components/App'
import Header from '../components/Header'
import Hello from '../components/Hello'
import withData from '../lib/withData'

export default withData((props) => (
  <App>
    <Header pathname={props.url.pathname} />
    <Hello />
  </App>
))
