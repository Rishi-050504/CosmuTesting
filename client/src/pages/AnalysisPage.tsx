
import { Link, useNavigate } from 'react-router-dom';
import { useAnalysis } from '../contexts/AnalysisContext';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { CheckCircle, ListChecks, File, XCircle } from 'lucide-react'; // Import XCircle
import Chatbot from '../components/specific/Chatbot';

const AnalysisPage = () => {
    const navigate = useNavigate();
    const { result, isLoading } = useAnalysis();

    if (isLoading) {
        return <div className="text-center p-5">Still loading results...</div>;
    }

    if (!result) {
        return (
            <Container className="text-center py-5">
                <h2>No analysis data found.</h2>
                <p className="text-secondary">Please <Link to="/upload">upload your files</Link> to start an analysis.</p>
            </Container>
        );
    }

    const { checklist, fileIssues } = result;

    return (
        <Container fluid className="py-4 px-4">
            <Row className="g-4">
                {/* Left Section: Checklist */}
                <Col md={6}>
                    <Card className="h-100" style={{backgroundColor: 'var(--light-bg)', border: '1px solid var(--border-color)'}}>
                        <Card.Header as="h5" className="d-flex align-items-center" style={{backgroundColor: 'rgba(0,0,0,0.2)', borderColor: 'var(--border-color)'}}>
                            <ListChecks className="me-2" /> SRS Compliance Checklist
                        </Card.Header>
                        <Card.Body>
                            <ListGroup variant="flush">
                                {checklist.map(item => (
                                    <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-start">
                                        {item.text}
                                        {item.compliant 
                                            ? <CheckCircle size={20} className="text-success" /> 
                                            : <XCircle size={20} className="text-danger" />
                                        }
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Right Section: Files with Issues */}
                <Col md={6}>
                    <Card className="h-100" style={{backgroundColor: 'var(--light-bg)', border: '1px solid var(--border-color)'}}>
                        <Card.Header as="h5" className="d-flex align-items-center" style={{backgroundColor: 'rgba(0,0,0,0.2)', borderColor: 'var(--border-color)'}}>
                            <XCircle className="me-2" /> Files with Issues
                        </Card.Header>
                        <Card.Body>
                            {Object.keys(fileIssues).length > 0 ? (
                                <ListGroup variant="flush">
                                    {Object.entries(fileIssues).map(([file, data]) => (
                                        <ListGroup.Item key={file} action onClick={() => navigate('/editor')}>
                                            <div className="d-flex w-100 justify-content-between">
                                                <h5 className="mb-1 d-flex align-items-center"><File size={16} className="me-2" /> {file}</h5>
                                            </div>
                                            <p className="mb-1 text-secondary">{data.issue}</p>
                                            <small className="gradient-text fw-bold">Click to review & fix</small>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <div className="text-center text-secondary p-5">
                                    <CheckCircle size={40} className="text-success mb-3" />
                                    <h4>No issues found!</h4>
                                    <p>Your project appears to be compliant with the SRS document.</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* Bottom Section: Chatbot */}
            <Row className="mt-4">
                <Col>
                    <div style={{height: '40vh', minHeight: '300px'}}>
                        <Chatbot />
                    </div>
                </Col>
            </Row>
        </Container>
    );
};
export default AnalysisPage;