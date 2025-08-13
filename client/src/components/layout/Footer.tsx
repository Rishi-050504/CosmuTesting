
import { Container, Row, Col } from 'react-bootstrap';
 const FooterComponent = () => {
  return (
    <footer className="py-4 mt-auto" style={{ backgroundColor: 'var(--light-bg)', borderTop: '1px solid var(--border-color)'}}>
      <Container>
        <Row>
          <Col className="text-center text-secondary">
            &copy; {new Date().getFullYear()} CosmuQuantaa. All Rights Reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
export default FooterComponent;