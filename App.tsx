import React from 'react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import NovelDetail from './pages/NovelDetail';
import Reader from './pages/Reader';
import AuthorDashboard from './pages/AuthorDashboard';
import ChapterEditor from './pages/ChapterEditor';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <MemoryRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="novel/:novelId" element={<NovelDetail />} />
            <Route path="author" element={<AuthorDashboard />} />
            <Route path="author/novel/:novelId/chapter/:chapterId?" element={<ChapterEditor />} />
          </Route>

          <Route path="/read/:novelId/:chapterId" element={<Reader />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

export default App;