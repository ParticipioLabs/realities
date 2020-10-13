import PropTypes from 'prop-types';
import { gql, useQuery } from '@apollo/client';
import withAuth from '@/components/withAuth';

const GET_VIEWER_NAME = gql`
  query UpdateViewerName_person($email: String!) {
    person(email: $email) {
      nodeId
      name
    }
  }
`;


const ViewerName = withAuth(({ auth }) => {
  const { loading, error, data } = useQuery(GET_VIEWER_NAME, {
    variables: { email: auth.email },
  });

  if (loading) return auth.email;
  if (error) return `Error! ${error.message}`;
  const viewer = data.person || {};
  return viewer.name || auth.email;
});

ViewerName.propTypes = {
  auth: PropTypes.shape({
    email: PropTypes.string,
  }),
};

ViewerName.defaultProps = {
  auth: {
    email: '',
  },
};

export default ViewerName;
