import { useState } from 'react'
import './App.css'
import URLShortener from './components/URLShortener'
import Analytics from './components/Analytics'

function App() {
  const [currentPage, setCurrentPage] = useState('shortener')

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🔗 URL Shortener with Analytics</h1>
        <nav className="app-nav">
          <button 
            className={`nav-btn ${currentPage === 'shortener' ? 'active' : ''}`}
            onClick={() => setCurrentPage('shortener')}
          >
            Shorten URL
          </button>
          <button 
            className={`nav-btn ${currentPage === 'analytics' ? 'active' : ''}`}
            onClick={() => setCurrentPage('analytics')}
          >
            Analytics
          </button>
        </nav>
      </header>

      <main className="app-main">
        {currentPage === 'shortener' && <URLShortener />}
        {currentPage === 'analytics' && <Analytics />}
      </main>

      <footer className="app-footer">
        <p>URL Shortener © 2026 | Fast. Reliable. Trackable.</p>
      </footer>
    </div>
  )
}

export default App
