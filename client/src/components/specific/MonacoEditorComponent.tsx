import { DiffEditor } from '@monaco-editor/react';
import { Button} from 'react-bootstrap';
import {Check, X, GitCompareArrows } from 'lucide-react';
const MonacoEditorComponent = ({ language, originalCode, modifiedCode, onAccept, onReject }) => {
  const editorOptions = {
    readOnly: false,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
  };

  return (
    <div className="editor-panel">
      <div className="panel-header"><GitCompareArrows /> Code & Suggestion</div>
      <div className="editor-container">
        <DiffEditor
          height="100%"
          language={language}
          original={originalCode}
          modified={modifiedCode}
          theme="vs-dark"
          options={editorOptions}
        />
      </div>
      <div className="suggestion-controls">
        <Button variant="success" onClick={onAccept}><Check className="me-1" size={16} /> Accept Suggestion</Button>
        <Button variant="danger" onClick={onReject}><X className="me-1" size={16} /> Reject</Button>
      </div>
    </div>
  );
};
export default MonacoEditorComponent;
