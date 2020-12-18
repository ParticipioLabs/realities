import React from 'react';
import {
  Container, Row, Col, Card, CardBody, CardTitle,
} from 'reactstrap';
import { Link } from 'react-router-dom';

const OrgSelect = () => (
  <Container>
    Pick an organization
    <Row>
      {
        [...Array(10)].map(() => (
          <Col className="py-2" sm={6} md={4}>
            <Card tag={Link} to="/potato">
              <CardBody>
                <CardTitle>
                  orgname here
                </CardTitle>
              </CardBody>
            </Card>
          </Col>
        ))
      }
    </Row>
  </Container>
);

export default OrgSelect;
