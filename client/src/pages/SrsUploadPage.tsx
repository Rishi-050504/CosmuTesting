import React, { useState } from 'react';
import { Container, Row, Col, Button, ListGroup, Form, InputGroup } from 'react-bootstrap';
import { FileUp, ArrowRight, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAnalysis } from '../contexts/AnalysisContext';
import axios from 'axios';
import FileUploader from '../components/specific/FileUploader';
import Loader from '../components/common/Loader'; // For inline loading

const SrsUploadPage: React.FC = () => {
  const [srsFiles, setSrsFiles] = useState<File[]>([]);
  const [checklist, setChecklist] = useState<any[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { setResult, setError } = useAnalysis();
  const navigate = useNavigate();

  const handleAddFiles = (newFiles: File[]) => {
    setSrsFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (name: string) => {
    setSrsFiles(prev => prev.filter(f => f.name !== name));
  };

  // Step 1: Generate Checklist
  const handleGenerateChecklist = async () => {
    if (srsFiles.length === 0) return;
    setIsGenerating(true);
    setError(null);
    const formData = new FormData();
    srsFiles.forEach(file => formData.append('srs', file));

    try {
      const response = await axios.post('/api/generate-checklist', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Add 'selected: true' to each item by default
      const checklistWithSelection = response.data.checklist.map((item: any) => ({
        ...item,
        selected: true,
      }));
      setChecklist(checklistWithSelection);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to generate checklist.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Checklist modification functions
  const handleToggle = (id: number) => {
    setChecklist(
      checklist.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };
  
  const handleAddItem = () => {
    if (newItemText.trim()) {
      const newItem = {
        id: Date.now(),
        text: newItemText,
        compliant: false,
        selected: true,
      };
      setChecklist([...checklist, newItem]);
      setNewItemText('');
    }
  };

  // Step 2: Proceed to Project Upload
  const handleProceed = () => {
    const selectedChecklist = checklist.filter(item => item.selected);
    if (selectedChecklist.length === 0) {
      alert('Please select or add at least one checklist item.');
      return;
    }
    // Save the final checklist to the context and navigate
    setResult({ 
  checklist: selectedChecklist, 
  fileIssues: {}, 
  fileContents: {} 
});
    navigate('/project-upload');
  };

  return (
    <Container className="py-4">
      <Row className="g-5">
        <Col md={7}>
          <div className="upload-card mb-4">
            <h4 className="mb-2">Step 1: Upload SRS Documents</h4>
            <p className="text-muted">Upload .pdf and .txt files to generate a compliance checklist.</p>
            <FileUploader
              onAddFiles={handleAddFiles}
              files={srsFiles}
              removeFile={removeFile}
              acceptedFileTypes={{ 'application/pdf': ['.pdf'], 'text/plain': ['.txt'] }}
              maxFileSize={5 * 1024 * 1024}
              Icon={FileUp}
            />
            <Button
              className="mt-3"
              onClick={handleGenerateChecklist}
              disabled={srsFiles.length === 0 || isGenerating}
            >
              {isGenerating ? <Loader text="Generating..." /> : 'Generate Checklist'}
            </Button>
          </div>
        </Col>

        <Col md={5}>
          <div className="upload-card">
            <h4 className="mb-3">Review Checklist</h4>
            {checklist.length > 0 ? (
              <>
                <ListGroup className="mb-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {checklist.map(item => (
                    <ListGroup.Item key={item.id}>
                      <Form.Check
                        type="checkbox"
                        label={item.text}
                        checked={item.selected}
                        onChange={() => handleToggle(item.id)}
                      />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <InputGroup>
                  <Form.Control
                    placeholder="Add a custom point"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                  />
                  <Button onClick={handleAddItem} variant="outline-secondary"><PlusCircle size={16} /></Button>
                </InputGroup>
              </>
            ) : (
              <p className="text-muted text-center">Your generated checklist will appear here.</p>
            )}
          </div>
        </Col>
      </Row>
      <Row>
        <Col className="text-center mt-5">
          <Button
            className="btn-custom"
            size="lg"
            onClick={handleProceed}
            disabled={checklist.filter(i => i.selected).length === 0}
          >
            Proceed to Project Upload <ArrowRight className="ms-2" />
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default SrsUploadPage;