import React, { useRef } from 'react';
import { File, X } from 'lucide-react';
import { Button, Card, ListGroup } from 'react-bootstrap';

interface FileUploaderProps {
  onAddFiles: (files: File[]) => void;
  files: File[];
  removeFile: (name: string) => void;
  acceptedFileTypes: Record<string, string[]>;
  maxFileSize: number;
  multiple?: boolean;
  Icon?: React.ElementType;
  allowFolderUpload?: boolean; // ✅ NEW
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onAddFiles,
  files,
  removeFile,
  acceptedFileTypes,
  maxFileSize,
  multiple = true,
  Icon = File,
  allowFolderUpload = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const accept = Object.values(acceptedFileTypes).flat().join(',');

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const validFiles: File[] = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      if (file.size <= maxFileSize) validFiles.push(file);
    }

    if (validFiles.length > 0) onAddFiles(validFiles);
    e.target.value = ''; // reset
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter((file) => file.size <= maxFileSize);
    if (validFiles.length > 0) onAddFiles(validFiles);
  };

  return (
    <Card
      className="p-4 text-center border-dashed border-2"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      style={{ cursor: 'pointer' }}
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="mb-3">
        <Icon size={40} className="text-primary" />
      </div>
      <p className="mb-0 text-muted">Click or drag files here to upload</p>

      <input
        type="file"
        multiple={multiple}
        accept={accept || undefined}
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
        {...(allowFolderUpload ? { webkitdirectory: 'true' } : {})}
      />

      {files.length > 0 && (
        <ListGroup variant="flush" className="mt-4 text-start">
          {files.map((file, idx) => (
            <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center">
              {file.name}
              <Button variant="outline-danger" size="sm" onClick={(e) => { e.stopPropagation(); removeFile(file.name); }}>
                <X size={16} />
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Card>
  );
};

export default FileUploader;
