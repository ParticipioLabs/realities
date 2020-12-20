import React from 'react';
import {
  Container, Row, Col, Card, CardBody, CardTitle,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import WrappedLoader from 'components/WrappedLoader';

const GET_ORGS = gql`
  query OrgSelect_getOrgs {
    orgs {
      orgId
      name
      orgSlug
    }
  }
`;

const OrgSelect = () => {
  const { loading, error, data } = useQuery(GET_ORGS);

  if (loading) return <WrappedLoader />;
  if (error) return `Error! ${error.message}`;

  const { orgs } = data;

  return (
    <Container>
      Pick an organization
      <Row>
        {orgs.map((org) => (
          <Col className="py-2" sm={6} md={4} key={org.orgId}>
            <Card tag={Link} to={`/${org.orgSlug}`}>
              <CardBody>
                <CardTitle>
                  {org.name}
                </CardTitle>
              </CardBody>
            </Card>
          </Col>
        )) }
      </Row>
    </Container>
  );
};

export default OrgSelect;
