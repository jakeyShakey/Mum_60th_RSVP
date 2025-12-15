import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useGLTF } from '@react-three/drei'
import './index.css'
import InvitePage from './pages/InvitePage.jsx'
import RSVPPage from './pages/RSVPPage.jsx'
import ErrorMessage from './components/UI/ErrorMessage.jsx'
import { GuestProvider } from './contexts/GuestContext.jsx'
import { AudioProvider } from './contexts/AudioContext.jsx'

// Preload 3D model immediately
useGLTF.preload('/models/curry.glb')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AudioProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/invite/error" replace />} />

          <Route path="/invite/:token" element={
            <GuestProvider>
              <InvitePage />
            </GuestProvider>
          } />

          <Route path="/rsvp/:token" element={
            <GuestProvider>
              <RSVPPage />
            </GuestProvider>
          } />

          <Route path="*" element={
            <ErrorMessage error="Invalid invitation link" />
          } />
        </Routes>
      </AudioProvider>
    </BrowserRouter>
  </StrictMode>,
)
