import React, { useState, useRef, type ReactNode } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { Container, Row, Col, Button, ListGroup } from 'react-bootstrap';
import {
  Folder,
  File as FileIcon,
  Check,
  X,
  GitCompareArrows,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import axios from 'axios';
import { useAnalysis } from '../contexts/AnalysisContext';

// Helper function to build a nested file tree (no changes here)
const buildFileTree = (paths: string[]) => {
  const tree: any = {};
  paths.forEach(path => {
    const parts = path.split(/[/\\]/);
    let currentLevel = tree;
    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        currentLevel[part] = { __isFile: true, path };
      } else {
        currentLevel[part] = currentLevel[part] || {};
        currentLevel = currentLevel[part];
      }
    });
  });
  return tree;
};

// --- FileExplorer Component (no changes here) ---
const FileExplorer = ({
  tree,
  onSelectFile,
  selectedFile
}: {
  tree: any;
  onSelectFile: (path: string) => void;
  selectedFile: string | null;
}) => {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (selectedFile) {
      const parts = selectedFile.split(/[/\\]/);
      let currentPath = '';
      const newOpenFolders = { ...openFolders };
      for (let i = 0; i < parts.length - 1; i++) {
        currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i];
        newOpenFolders[currentPath] = true;
      }
      setOpenFolders(newOpenFolders);
    }
  }, [selectedFile]);

  const toggleFolder = (path: string) => {
    setOpenFolders(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const renderTree = (node: any, path = '', depth = 0): ReactNode[] => {
    const sortedEntries = Object.entries(node).sort(([, a]: [string, any], [, b]: [string, any]) => {
      if (a.__isFile && !b.__isFile) return 1;
      if (!a.__isFile && b.__isFile) return -1;
      return 0;
    });

    return sortedEntries.map(([name, content]: [string, any]) => {
      const currentPath = path ? `${path}/${name}` : name;
      if (content.__isFile) {
        return (
          <ListGroup.Item
            action
            key={currentPath}
            active={selectedFile === content.path}
            onClick={() => onSelectFile(content.path)}
            style={{ paddingLeft: `${depth * 20 + 12}px` }}
            className="file-explorer-item"
          >
            <FileIcon size={16} className="me-2" /> {name}
          </ListGroup.Item>
        );
      } else {
        const isOpen = openFolders[currentPath];
        return (
          <div key={currentPath}>
            <ListGroup.Item
              action
              onClick={() => toggleFolder(currentPath)}
              style={{ paddingLeft: `${depth * 20 + 12}px` }}
              className="file-explorer-item"
            >
              {isOpen ? <ChevronDown size={16} className="me-1" /> : <ChevronRight size={16} className="me-1" />}
              <Folder size={16} className="me-2" color="var(--accent-color)" /> {name}
            </ListGroup.Item>
            {isOpen && renderTree(content, currentPath, depth + 1)}
          </div>
        );
      }
    });
  };

  return (
    <div className="editor-panel">
      <div className="panel-header">Project Structure</div>
      <div className="panel-content p-0">
        <ListGroup variant="flush" className="file-explorer">
          {renderTree(tree)}
        </ListGroup>
      </div>
    </div>
  );
};

// --- Main EditorPage Component ---
const EditorPage = () => {
  const { result, error, updateFileContent } = useAnalysis();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isModifiedByUser, setIsModifiedByUser] = useState(false);
  const editorRef = useRef<any>(null);

  if (error) return <Container className="text-center py-5"><h2>An error occurred</h2><p>{error}</p></Container>;
  if (!result) return <Container className="text-center py-5"><h2>Loading analysis data...</h2></Container>;

  const fileTree = buildFileTree(Object.keys(result.fileContents));
  
  const currentIssue = selectedFile ? result.fileIssues[selectedFile] : null;
  const originalContent = selectedFile ? result.fileContents[selectedFile] : '';
  const modifiedCodeFromState = currentIssue ? currentIssue.suggestion : originalContent;

  const handleFileSelect = (path: string) => {
    setSelectedFile(path);
    setIsModifiedByUser(false);
  };

  const handleAccept = async () => {
    if (!selectedFile) return;

    const modifiedEditorModel = editorRef.current?.getModel()?.modified;
    if (!modifiedEditorModel) return;

    const newFileContent = modifiedEditorModel.getValue();

    try {
      await axios.post('http://localhost:3001/api/update', {
        filePath: selectedFile,
        newContent: newFileContent,
      });
      
      updateFileContent(selectedFile, newFileContent);
      setIsModifiedByUser(false);
      alert(`Changes for ${selectedFile} have been applied successfully.`);
    } catch (err) {
      alert(`Failed to apply changes for ${selectedFile}.`);
      console.error("Failed to update file:", err);
    }
  };

  const handleReject = () => {
    if (!selectedFile) return;
    alert(`Suggestion for ${selectedFile} was rejected.`);
    if (result && result.fileIssues[selectedFile]) {
        updateFileContent(selectedFile, result.fileContents[selectedFile]);
    }
  };

  // CORRECTED: This function is now attached to the editor's model listener
  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
    const modifiedEditorModel = editor.getModel().modified;

    // Listen for changes in the content of the modified editor
    modifiedEditorModel.onDidChangeContent(() => {
      const suggestion = currentIssue ? currentIssue.suggestion : originalContent;
      const currentValue = modifiedEditorModel.getValue();
      if (currentValue !== suggestion) {
          setIsModifiedByUser(true);
      }
    });
  };

  const showAcceptButton = currentIssue || isModifiedByUser;
  const editorOptions = { readOnly: false, minimap: { enabled: true }, scrollBeyondLastLine: false, fontSize: 14, renderSideBySide: true };

  return (
    <Container fluid className="editor-page-container px-4">
      <Row className="editor-layout-row g-3" style={{ height: 'calc(100vh - 120px)' }}>
        <Col lg={3} className="d-flex flex-column">
          <FileExplorer tree={fileTree} onSelectFile={handleFileSelect} selectedFile={selectedFile} />
        </Col>
        <Col lg={9} className="d-flex flex-column">
          <div className="editor-panel flex-grow-1 d-flex flex-column">
            <div className="panel-header d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <GitCompareArrows className="me-2" />
                {selectedFile ? `Reviewing: ${selectedFile}` : 'Select a file to review'}
              </div>
              {showAcceptButton && (
                <div className="d-flex gap-2">
                  <Button variant="success" size="sm" onClick={handleAccept}>
                    <Check size={16} /> Accept Suggestion
                  </Button>
                  {currentIssue && (
                    <Button variant="danger" size="sm" onClick={handleReject}>
                      <X size={16} /> Reject
                    </Button>
                  )}
                </div>
              )}
            </div>
            <div className="editor-container flex-grow-1">
              {selectedFile ? (
                <DiffEditor
                  height="100%"
                  language={selectedFile?.split('.').pop() || 'plaintext'}
                  original={originalContent}
                  modified={modifiedCodeFromState}
                  theme="vs-dark"
                  options={editorOptions}
                  onMount={handleEditorMount} // Use onMount to get access to the editor instance
                />
              ) : (
                <div className="d-flex justify-content-center align-items-center h-100 text-secondary">
                  <p>Select a file from the explorer to see its content.</p>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default EditorPage;