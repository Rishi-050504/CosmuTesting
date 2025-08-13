import  { useState } from 'react';
import {ListGroup } from 'react-bootstrap';
import { Folder, File,ChevronRight, ChevronDown } from 'lucide-react';
const FileExplorer = ({ tree, onSelectFile }) => {
  const [openFolders, setOpenFolders] = useState({});

  const toggleFolder = (path) => {
    setOpenFolders(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const renderTree = (node, path = '', depth = 0) => {
    if (typeof node !== 'object' || node === null) return null;

    return Object.entries(node).map(([name, content]) => {
      const currentPath = path ? `${path}/${name}` : name;
      const isFolder = typeof content === 'object' && content !== null && !content.original;

      if (isFolder) {
        const isOpen = openFolders[currentPath];
        return (
          <div key={currentPath}>
            <ListGroup.Item action onClick={() => toggleFolder(currentPath)} style={{'--depth': depth}}>
              {isOpen ? <ChevronDown size={16} className="me-1" /> : <ChevronRight size={16} className="me-1" />}
              <Folder size={16} className="me-2" color="var(--accent-color)" />
              {name}
            </ListGroup.Item>
            {isOpen && renderTree(content, currentPath, depth + 1)}
          </div>
        );
      } else {
        return (
          <ListGroup.Item action key={currentPath} onClick={() => onSelectFile(currentPath, content)} style={{'--depth': depth}}>
            <File size={16} className="me-2" />
            {name}
          </ListGroup.Item>
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
export default FileExplorer;