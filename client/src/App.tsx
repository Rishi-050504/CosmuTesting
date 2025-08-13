import { Routes, Route, Navigate } from 'react-router-dom';
import { AnalysisProvider } from './contexts/AnalysisContext'; // Import the provider
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import SrsUploadPage from './pages/SrsUploadPage';
import ProjectUploadPage from './pages/ProjectUploadPage';
import LoadingPage from './pages/LoadingPage';
import AnalysisPage from './pages/AnalysisPage';
import EditorPage from './pages/EditorPage';
import DownloadPage from './pages/DownloadPage';

export default function App() {
  return (
    <AnalysisProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="srs-upload" element={<SrsUploadPage />} /> 
          <Route path="project-upload" element={<ProjectUploadPage />} />
          <Route path="analysis" element={<LoadingPage />} />
          <Route path="analysis-results" element={<AnalysisPage />} /> 
          <Route path="editor" element={<EditorPage />} />
          <Route path="download" element={<DownloadPage />} />
          <Route path="upload" element={<Navigate to="/srs-upload" replace />} />
        </Route>
      </Routes>
    </AnalysisProvider>
  );
}