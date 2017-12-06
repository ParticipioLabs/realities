import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const POSTS_PER_PAGE = 10

function Hello ({ data }) {
  return <div>Hello {data.hello}</div>
}

const hello = gql`
  query {
    hello
  }
`

// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (Hell0)
export default graphql(hello)(Hello)
