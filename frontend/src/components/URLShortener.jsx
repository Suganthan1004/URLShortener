import { useState } from 'react'
import '../styles/URLShortener.css'

function URLShortener() {
  const [longUrl, setLongUrl] = useState('')
  const [shortenedUrl, setShortenedUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  // API Base URL - adjust based on your backend
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

  const validateUrl = (url) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleShorten = async (e) => {
    e.preventDefault()
    setError('')
    setShortenedUrl(null)
    setCopied(false)

    if (!longUrl.trim()) {
      setError('Please enter a URL')
      return
    }

    if (!validateUrl(longUrl)) {
      setError('Please enter a valid URL (e.g., https://example.com)')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/urls/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ longUrl: longUrl.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to shorten URL')
      }

      const data = await response.json()
      setShortenedUrl(data)
      setLongUrl('')
    } catch (err) {
      setError(err.message || 'Error shortening URL. Please try again.')
      console.error('Shorten URL error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyToClipboard = () => {
    if (shortenedUrl) {
      const shortUrlFull = `${import.meta.env.VITE_APP_URL || 'http://localhost:5173'}/r/${shortenedUrl.shortCode}`
      navigator.clipboard.writeText(shortUrlFull)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="shortener-container">
      <section className="shortener-form-section">
        <h2>Create a Shortened URL</h2>
        <form onSubmit={handleShorten} className="shorten-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter your long URL (e.g., https://example.com/very/long/path)"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              disabled={loading}
              className="url-input"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="shorten-btn"
          >
            {loading ? 'Shortening...' : 'Shorten URL'}
          </button>
        </form>

        {error && <div className="alert alert-error">{error}</div>}

        {shortenedUrl && (
          <div className="result-section">
            <div className="result-card">
              <div className="result-item">
                <label>Original URL:</label>
                <div className="url-display original">
                  <a href={shortenedUrl.longUrl} target="_blank" rel="noopener noreferrer">
                    {shortenedUrl.longUrl}
                  </a>
                </div>
              </div>

              <div className="result-item">
                <label>Shortened URL:</label>
                <div className="url-display shortened">
                  <span className="short-code-highlight">{shortenedUrl.shortCode}</span>
                  <button
                    type="button"
                    onClick={handleCopyToClipboard}
                    className={`copy-btn ${copied ? 'copied' : ''}`}
                    title="Copy to clipboard"
                  >
                    {copied ? '✓ Copied!' : '📋 Copy'}
                  </button>
                </div>
              </div>

              <div className="result-item">
                <label>Created At:</label>
                <div className="timestamp">
                  {new Date(shortenedUrl.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="quick-stats">
              <div className="stat-box">
                <span className="stat-value">{shortenedUrl.totalClicks}</span>
                <span className="stat-label">Total Clicks</span>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="info-section">
        <h3>How It Works</h3>
        <div className="info-steps">
          <div className="step">
            <div className="step-number">1</div>
            <h4>Enter URL</h4>
            <p>Paste your long URL in the input field above</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h4>Generate</h4>
            <p>Click the Shorten button to generate a unique short code</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h4>Share</h4>
            <p>Copy the shortened URL and share it anywhere</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h4>Track</h4>
            <p>View analytics in the Analytics tab to track clicks</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default URLShortener
