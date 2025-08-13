import React, { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import { Container,ProgressBar} from 'react-bootstrap';
import { CheckCircle, FileCog, ListChecks, ScanLine} from 'lucide-react';
const analysisSteps = [
  { text: 'Parsing SRS Document...', icon: <FileCog /> },
  { text: 'Generating Compliance Checklist...', icon: <ListChecks /> },
  { text: 'Analyzing Project Codebase...', icon: <ScanLine /> },
  { text: 'Finalizing Report...', icon: <CheckCircle /> },
];

const LoadingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const stepDuration = 2000; // 2 seconds per step for simulation
    const totalDuration = stepDuration * analysisSteps.length;

    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(100, p + (100 / (totalDuration / 100))));
    }, 100);

    const stepInterval = setInterval(() => {
      setCurrentStep(prevStep => Math.min(analysisSteps.length - 1, prevStep + 1));
    }, stepDuration);

    const navigationTimeout = setTimeout(() => {
      navigate('/analysis-results'); // Navigate to the new analysis results page
    }, totalDuration + 500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearTimeout(navigationTimeout);
    };
  }, [navigate]);

  const CurrentIcon = analysisSteps[currentStep].icon;

  return (
    <Container className="analysis-page-container">
      <div className="mb-4">
        {React.cloneElement(CurrentIcon, { className: 'loader-icon', size: 64, color: 'var(--accent-color)' })}
      </div>
      <h1 className="display-5 fw-bold gradient-text mb-3">Analyzing Your Project</h1>
      <p className="lead text-secondary mb-5">
        Our AI is hard at work. Please wait a few moments.
      </p>
      <div className="progress-wrapper">
        <div className="d-flex flex-column align-items-center gap-3">
            {analysisSteps.map((step, index) => (
                <div key={index} className={`progress-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}>
                    {index < currentStep ? <CheckCircle size={20} color="var(--accent-color)" /> : React.cloneElement(step.icon, { size: 20 })}
                    <span>{step.text}</span>
                </div>
            ))}
        </div>
        <ProgressBar animated now={progress} className="mt-4" style={{ height: '8px' }} />
      </div>
    </Container>
  );
};
export default LoadingPage;