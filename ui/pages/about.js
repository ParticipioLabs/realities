import App from '../components/App'
import Header from '../components/Header'

export default (props) => (
  <App>
    <Header pathname={props.url.pathname} />
    <article>
      <h1>About</h1>
      <p>
        A tool for tribal decentralised organisations.
      </p>
    </article>
  </App>
)
