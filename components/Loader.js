'use client';

import { Container, Row, Col } from 'react-bootstrap';

export default function Loader() {
  return (
    <Container>
      <Row className="d-flex justify-content-center">
        <Col>
          <div className="LoadingOverlay center-screen">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="loader-size" src="/images/loader-ring.svg" alt="Loading" />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
