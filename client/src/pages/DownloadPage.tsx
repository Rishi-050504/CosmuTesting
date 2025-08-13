import { Container, Row, Col, Button, Card, Accordion } from 'react-bootstrap';
import { Download, LifeBuoy, HelpCircle, ShieldCheck } from 'lucide-react';
import axios from 'axios';
const DownloadPage = () => {

  const handleDownload = async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/download', {
      responseType: 'blob', // Important: response is a binary file
    });

    // Create a link to trigger the download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'refactored-project.zip');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Download failed:", error);
    alert("Could not download the project. Please try again.");
  }
};  

  return (
    <Container className="download-page-container">
      <Row className="g-5">
        {/* Left Section: Download */}
        <Col md={7}>
          <h1 className="display-5 fw-bold mb-4">Your Project is Ready</h1>
          <p className="lead text-secondary mb-5">
            The analysis is complete, and your code has been updated based on the suggestions you accepted. Download the refactored project folder as a .zip file.
          </p>
          <Card className="download-card">
            <Card.Body>
              <ShieldCheck size={64} className="text-success mb-4" />
              <Card.Title as="h2" className="mb-3">Download Your Compliant Code</Card.Title>
              <Card.Text className="text-secondary mb-4">
                All accepted changes have been applied. Your project is now packaged and ready for download.
              </Card.Text>
              <Button onClick={handleDownload} className="btn-custom btn-lg">
                <Download className="me-2" />
                Download Project (.zip)
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Section: Help */}
        <Col md={5}>
          <h2 className="d-flex align-items-center mb-4">
            <LifeBuoy className="me-3" color="var(--accent-color)" size={32} />
            Help & FAQ
          </h2>
          <Accordion defaultActiveKey="0" flush>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <HelpCircle className="me-2" /> What's included in the download?
              </Accordion.Header>
              <Accordion.Body>
                The .zip file contains your entire original project folder, with the code in the relevant files updated based on the suggestions you accepted during the review process. Files you didn't modify remain untouched.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <HelpCircle className="me-2" /> What if I rejected a suggestion?
              </Accordion.Header>
              <Accordion.Body>
                If you rejected a suggestion, the original code for that specific issue was kept. Only accepted suggestions are applied to the final code.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>
                <HelpCircle className="me-2" /> How long is my download link valid?
              </Accordion.Header>
              <Accordion.Body>
                For security reasons, your session and download link will expire after 24 hours. We do not store your code long-term. Please be sure to download your files promptly after analysis.
              </Accordion.Body>
            </Accordion.Item>
             <Accordion.Item eventKey="3">
              <Accordion.Header>
                <HelpCircle className="me-2" /> I have an issue with the downloaded code.
              </Accordion.Header>
              <Accordion.Body>
                If you encounter any problems or have questions about the refactored code, please contact our support team through the official support channel. Provide your session ID if possible.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>
    </Container>
  );
};

export default DownloadPage;

