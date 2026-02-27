import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { FounderProvider } from './context/FounderContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FounderProvider>
      <App />
    </FounderProvider>
  </StrictMode>,
)
