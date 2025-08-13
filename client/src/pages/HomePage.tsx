import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Rocket, Orbit, Telescope, Sparkles } from 'lucide-react';
import AnimatedBackground from '../components/specific/AnimatedBackground';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="homepage-dark-wrapper">
            <AnimatedBackground />
            
            <Container className="text-center hero-section-dark">
                <h1 className="hero-title-dark">
                   CosmuQuantaa
                </h1>
                <p className="hero-subtitle-dark">
                    Automate Code Audits. Elevate Your Standards.
                </p>
                <p className="hero-description-dark">
                    Leverage AI to analyze your project against SRS documents, identify non-compliance, and receive intelligent code suggestions to streamline your development workflow.
                </p>
                <Button onClick={() => navigate('/upload')} className="btn-custom btn-star-trail" size="lg">
                    Launch Analysis <Rocket className="ms-2" size={20} />
                </Button>
            </Container>

            <Container className="features-section-dark">
                <h2 className="text-center section-title-dark">A Seamless Four-Step Process</h2>
                <Row>
                    {/* Feature 1 */}
                    <Col md={6} lg={3} className="mb-4">
                        <Card className="text-center h-100 feature-card-dark">
                            <Card.Body>
                                <div className="mb-3">
                                    <Rocket color="#a9a9d8" size={48} />
                                </div>
                                <Card.Title as="h3" className="text-light">1. Launch</Card.Title>
                                <Card.Text className="text-secondary">
                                    Securely upload your project's .zip file and Software Requirements Specification (SRS) document.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    {/* Feature 2 */}
                    <Col md={6} lg={3} className="mb-4">
                         <Card className="text-center h-100 feature-card-dark">
                            <Card.Body>
                                <div className="mb-3">
                                    <Orbit color="#a9a9d8" size={48} />
                                </div>
                                <Card.Title as="h3" className="text-light">2. Analyze</Card.Title>
                                <Card.Text className="text-secondary">
                                    Our AI generates a compliance checklist from your SRS and cross-references it with your codebase.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    {/* Feature 3 */}
                    <Col md={6} lg={3} className="mb-4">
                         <Card className="text-center h-100 feature-card-dark">
                            <Card.Body>
                                <div className="mb-3">
                                    <Telescope color="#a9a9d8" size={48} />
                                </div>
                                <Card.Title as="h3" className="text-light">3. Review</Card.Title>
                                <Card.Text className="text-secondary">
                                    View non-compliant code side-by-side with AI-powered suggestions in an integrated editor.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    {/* Feature 4 */}
                    <Col md={6} lg={3} className="mb-4">
                         <Card className="text-center h-100 feature-card-dark">
                            <Card.Body>
                                <div className="mb-3">
                                    <Sparkles color="#a9a9d8" size={48} />
                                </div>
                                <Card.Title as="h3" className="text-light">4. Refactor</Card.Title>
                                <Card.Text className="text-secondary">
                                    Accept the changes you want and download the refactored, compliant project folder.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default HomePage;