import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext.jsx'
import '../src/styles/global.css'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <LanguageProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
    </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)
