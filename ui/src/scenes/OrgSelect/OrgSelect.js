import React from 'react';
import PropTypes from 'prop-types';
import {
  Container, Row, Col, Card, CardTitle,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import WrappedLoader from 'components/WrappedLoader';
import useAuth from 'services/useAuth';
import CreateOrgCard from './CreateOrgCard';

const GET_ORGS = gql`
  query OrgSelect_getOrgs {
    orgs {
      orgId
      name
      orgSlug
    }
  }
`;

const GridCol = ({ children }) => <Col className="py-2" sm={6} md={4}>{children}</Col>;

GridCol.propTypes = {
  children: PropTypes.element.isRequired,
};

const OrgSelect = () => {
  const { loading, error, data } = useQuery(GET_ORGS);
  const { isLoggedIn } = useAuth();

  if (loading) return <WrappedLoader />;
  if (error) return `Error! ${error.message}`;

  const { orgs } = data;

  return (
    <Container>
      Pick an organization
      <Row>
        { isLoggedIn && (
        <GridCol>
          <CreateOrgCard />
        </GridCol>
        )}
        {orgs.map((org) => (
          <GridCol key={org.orgId}>
            <Card body tag={Link} to={`/${org.orgSlug}`}>
              <CardTitle>
                {org.name}
              </CardTitle>
            </Card>
          </GridCol>
        )) }
      </Row>
    </Container>
  );
};

export default OrgSelect;
