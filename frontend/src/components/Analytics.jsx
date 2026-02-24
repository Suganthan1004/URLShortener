import { useState, useEffect } from 'react'
import '../styles/Analytics.css'

function Analytics() {
  const [urlStats, setUrlStats] = useState([])
  const [selectedUrlId, setSelectedUrlId] = useState(null)
  const [clickHistory, setClickHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [error, setError] = useState('')

  // API Base URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

  // Fetch all shortened URLs with stats
  useEffect(() => {
    fetchUrlStats()
  }, [])

  const fetchUrlStats = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE_URL}/urls/stats`)
      if (!response.ok) throw new Error('Failed to fetch stats')

      const data = await response.json()
      setUrlStats(Array.isArray(data) ? data : [])
      if (Array.isArray(data) && data.length > 0) {
        setSelectedUrlId(data[0].id)
        fetchClickHistory(data[0].id)
      }
    } catch (err) {
      setError(err.message || 'Error fetching analytics')
      console.error('Fetch stats error:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchClickHistory = async (urlId) => {
    setHistoryLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/urls/${urlId}/clicks`)
      if (!response.ok) throw new Error('Failed to fetch click history')

      const data = await response.json()
      setClickHistory(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Fetch history error:', err)
      setClickHistory([])
    } finally {
      setHistoryLoading(false)
    }
  }

  const handleSelectUrl = (urlId) => {
    setSelectedUrlId(urlId)
    fetchClickHistory(urlId)
  }

  const getClicksInLast24Hours = (url) => {
    const now = new Date()
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    return clickHistory.filter((click) => {
      const clickDate = new Date(click.clickedAt)
      return clickDate >= twentyFourHoursAgo
    }).length
  }

  const selectedUrl = urlStats.find((url) => url.id === selectedUrlId)
  const selectedUrlClicks24h = selectedUrl ? getClicksInLast24Hours(selectedUrl) : 0

  return (
    <div className="analytics-container">
      <h2>URL Analytics Dashboard</h2>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Loading analytics...</div>
      ) : urlStats.length === 0 ? (
        <div className="empty-state">
          <p>No shortened URLs yet. Create one to see analytics!</p>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <section className="summary-stats">
            <div className="stat-card">
              <h4>Total Shortened URLs</h4>
              <div className="stat-value">{urlStats.length}</div>
            </div>
            <div className="stat-card">
              <h4>Total Clicks (All URLs)</h4>
              <div className="stat-value">
                {urlStats.reduce((sum, url) => sum + (url.totalClicks || 0), 0)}
              </div>
            </div>
            {selectedUrl && (
              <>
                <div className="stat-card highlight">
                  <h4>Clicks (Last 24h)</h4>
                  <div className="stat-value">{selectedUrlClicks24h}</div>
                </div>
                <div className="stat-card">
                  <h4>Total Clicks (This URL)</h4>
                  <div className="stat-value">{selectedUrl.totalClicks || 0}</div>
                </div>
              </>
            )}
          </section>

          <div className="analytics-content">
            {/* URL List */}
            <section className="url-list-section">
              <h3>Your Shortened URLs</h3>
              <div className="url-list">
                {urlStats.map((url) => (
                  <div
                    key={url.id}
                    className={`url-item ${selectedUrlId === url.id ? 'active' : ''}`}
                    onClick={() => handleSelectUrl(url.id)}
                  >
                    <div className="url-info">
                      <div className="short-code">{url.shortCode}</div>
                      <div className="original-url" title={url.longUrl}>
                        {url.longUrl.length > 50
                          ? `${url.longUrl.substring(0, 47)}...`
                          : url.longUrl}
                      </div>
                      <div className="url-meta">
                        Created: {new Date(url.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="url-clicks">{url.totalClicks} clicks</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Click History */}
            {selectedUrl && (
              <section className="click-history-section">
                <h3>Click History - {selectedUrl.shortCode}</h3>

                {historyLoading ? (
                  <div className="loading">Loading click history...</div>
                ) : clickHistory.length === 0 ? (
                  <div className="empty-state">
                    <p>No clicks recorded yet for this URL</p>
                  </div>
                ) : (
                  <div className="click-history">
                    <div className="history-header">
                      <span>Timestamp</span>
                      <span>IP Address</span>
                    </div>
                    <div className="history-list">
                      {clickHistory.map((click, index) => (
                        <div key={index} className="click-item">
                          <span className="click-time">
                            {new Date(click.clickedAt).toLocaleString()}
                          </span>
                          <span className="click-ip">
                            {click.ipAddress || 'Not available'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>

          <button onClick={fetchUrlStats} className="refresh-btn">
            🔄 Refresh Data
          </button>
        </>
      )}
    </div>
  )
}

export default Analytics
