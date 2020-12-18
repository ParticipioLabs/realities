import React from 'react';
import {
  Container, Row, Col, Card, CardBody, CardTitle,
} from 'reactstrap';

const OrgSelect = () => (
  <Container>
    Pick an organization
    <Row>
      {
        [...Array(10)].map(() => (
          <Col className="py-2" sm={6} md={4}>
            <Card>
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
