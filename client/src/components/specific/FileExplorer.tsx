// import  { useState } from 'react';
// import {ListGroup } from 'react-bootstrap';
// import { Folder, File,ChevronRight, ChevronDown } from 'lucide-react';
// const FileExplorer = ({ tree, onSelectFile }) => {
//   const [openFolders, setOpenFolders] = useState({});

//   const toggleFolder = (path) => {
//     setOpenFolders(prev => ({ ...prev, [path]: !prev[path] }));
//   };

//   const renderTree = (node, path = '', depth = 0) => {
//     if (typeof node !== 'object' || node === null) return null;

//     return Object.entries(node).map(([name, content]) => {
//       const currentPath = path ? `${path}/${name}` : name;
//       const isFolder = typeof content === 'object' && content !== null && !content.original;

//       if (isFolder) {
//         const isOpen = openFolders[currentPath];
//         return (
//           <div key={currentPath}>
//             <ListGroup.Item action onClick={() => toggleFolder(currentPath)} style={{'--depth': depth}}>
//               {isOpen ? <ChevronDown size={16} className="me-1" /> : <ChevronRight size={16} className="me-1" />}
//               <Folder size={16} className="me-2" color="var(--accent-color)" />
//               {name}
//             </ListGroup.Item>
//             {isOpen && renderTree(content, currentPath, depth + 1)}
//           </div>
//         );
//       } else {
//         return (
//           <ListGroup.Item action key={currentPath} onClick={() => onSelectFile(currentPath, content)} style={{'--depth': depth}}>
//             <File size={16} className="me-2" />
//             {name}
//           </ListGroup.Item>
//         );
//       }
//     });
//   };

//   return (
//     <div className="editor-panel">
//       <div className="panel-header">Project Structure</div>
//       <div className="panel-content p-0">
//         <ListGroup variant="flush" className="file-explorer">
//           {renderTree(tree)}
//         </ListGroup>
//       </div>
//     </div>
//   );
// };
// export default FileExplorer;
import React, { useState, type ReactNode } from 'react';
import { ListGroup } from 'react-bootstrap';
import { Folder, File as FileIcon, ChevronRight, ChevronDown } from 'lucide-react';

// Define the structure of the props for type safety
interface FileExplorerProps {
  tree: object;
  onSelectFile: (path: string, content: any) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ tree, onSelectFile }) => {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  const toggleFolder = (path: string) => {
    setOpenFolders(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const renderTree = (node: any, path = '', depth = 0): ReactNode[] => {
    if (typeof node !== 'object' || node === null) return [];

    return Object.entries(node).map(([name, content]: [string, any]) => {
      const currentPath = path ? `${path}/${name}` : name;
      const isFolder = typeof content === 'object' && content !== null && !content.__isFile; // Check for our file marker

      if (isFolder) {
        const isOpen = openFolders[currentPath];
        return (
          <div key={currentPath}>
            <ListGroup.Item action onClick={() => toggleFolder(currentPath)} style={{ paddingLeft: `${depth * 20 + 12}px` }}>
              {isOpen ? <ChevronDown size={16} className="me-1" /> : <ChevronRight size={16} className="me-1" />}
              <Folder size={16} className="me-2" color="var(--accent-color)" />
              {name}
            </ListGroup.Item>
            {isOpen && renderTree(content, currentPath, depth + 1)}
          </div>
        );
      } else { // It's a file
        return (
          <ListGroup.Item action key={currentPath} onClick={() => onSelectFile(content.path, content)} style={{ paddingLeft: `${depth * 20 + 12}px` }}>
            <FileIcon size={16} className="me-2" />
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