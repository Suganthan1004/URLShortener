import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import '../styles/Analytics.css'
import { fetchClickHistory, fetchUrlStats } from '../services/api'

function Analytics() {
  const [urlStats, setUrlStats] = useState([])
  const [selectedUrlId, setSelectedUrlId] = useState(null)
  const [clickHistory, setClickHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [searchError, setSearchError] = useState('')

  // API Base URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

  // Fetch all shortened URLs with stats
  useEffect(() => {
    fetchUrlStats()
  }, [])

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

  const getGlobalClicksInLast24Hours = () => {
    // Note: Since the backend doesn't currently provide a global click history endpoint
    // we would ideally need a new endpoint `GET /urls/clicks` to accurately get this.
    // For now, if we only have stats per URL but no global click history array,
    // this will be an approximation or would require fetching history for all URLs.
    // Assuming backend will be updated or we just show a placeholder if we can't calculate it.
    // For this implementation, let's use a placeholder or 0 if we don't have global click history.
    return 0 // Placeholder until backend can provide global 24h clicks
  }

  const handleClearSelection = () => {
    setSelectedUrlId(null)
    setSearchInput('')
    setSearchError('')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchError('')

    if (!searchInput.trim()) {
      handleClearSelection()
      return
    }

    let codeToSearch = searchInput.trim()
    try {
      const url = new URL(codeToSearch)
      const pathParts = url.pathname.split('/')
      codeToSearch = pathParts[pathParts.length - 1]
    } catch {
      if (codeToSearch.startsWith('/r/')) {
        codeToSearch = codeToSearch.replace('/r/', '')
      }
    }

    const foundUrl = urlStats.find(url => url.shortCode === codeToSearch)

    if (foundUrl) {
      handleSelectUrl(foundUrl.id)
      setSearchInput('')
    } else {
      setSearchError(`Short URL code "${codeToSearch}" not found in your analytics.`)
    }
  }

  const selectedUrl = urlStats.find((url) => url.id === selectedUrlId)
  const selectedUrlClicks24h = selectedUrl ? getClicksInLast24Hours(selectedUrl) : 0

  // Calculate total global 24h clicks by summing up approximations or just showing a placeholder
  // In a real scenario, this requires a specific backend endpoint or fetching all histories.
  // We will pass 0 for now as explained in getGlobalClicksInLast24Hours.
  const globalClicks24h = getGlobalClicksInLast24Hours()

  // Prepare chart data
  const processGlobalChartData = () => {
    if (!urlStats || urlStats.length === 0) {
      return [{ name: 'No Data', clicks: 0 }]
    }

    // Since we only have aggregate stats per URL, the most dynamic way to show 
    // a global trend is to group the total clicks by the URL's creation date.
    // This entirely depends on the real data returned by the API.
    const statsByDate = {}

    urlStats.forEach(url => {
      if (url.createdAt) {
        const dateStr = new Date(url.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        statsByDate[dateStr] = (statsByDate[dateStr] || 0) + (url.totalClicks || 0)
      }
    })

    const data = Object.keys(statsByDate).map(dateStr => ({
      name: dateStr,
      clicks: statsByDate[dateStr]
    }))

    // If for some reason we end up with no valid dates, return flat graph
    return data.length > 0 ? data : [{ name: 'No Data', clicks: 0 }]
  }

  const processSpecificChartData = () => {
    // Group clickHistory by Date
    if (!clickHistory || clickHistory.length === 0) return []

    const clicksByDate = {}
    clickHistory.forEach(click => {
      const dateStr = new Date(click.clickedAt).toLocaleDateString()
      clicksByDate[dateStr] = (clicksByDate[dateStr] || 0) + 1
    })

    const chartData = Object.keys(clicksByDate).map(dateStr => ({
      name: dateStr,
      clicks: clicksByDate[dateStr]
    }))

    // Sort by date or just return if small
    return chartData.length > 0 ? chartData : [{ name: 'No Data', clicks: 0 }]
  }

  const chartData = selectedUrl ? processSpecificChartData() : processGlobalChartData()

  return (
    <div className="analytics-container">
      <h2>URL Analytics Dashboard</h2>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Enter short URL or code to view analytics..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value)
            setSearchError('')
          }}
          className="search-input"
        />
        <button type="submit" className="search-btn">Search</button>
      </form>

      {searchError && <div className="alert alert-error">{searchError}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Summary Stats */}
      <section className="summary-stats">
        {!selectedUrl ? (
          <>
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
            <div className="stat-card">
              <h4>Clicks in Last 24h</h4>
              <div className="stat-value">{globalClicks24h}</div>
              <small style={{ color: '#999' }}>(Approximation)</small>
            </div>
          </>
        ) : (
          <>
            <div className="stat-card highlight">
              <h4>Total Clicks</h4>
              <div className="stat-value">{selectedUrl.totalClicks || 0}</div>
            </div>
            <div className="stat-card highlight">
              <h4>Clicks in Last 24h</h4>
              <div className="stat-value">{selectedUrlClicks24h}</div>
            </div>
            <div className="stat-card">
              <h4>Tracking URL</h4>
              <div className="stat-value" style={{ fontSize: '1.25rem', wordBreak: 'break-all' }}>{selectedUrl.shortCode}</div>
            </div>
          </>
        )}
      </section>

      {/* Activity Chart */}
      <section className="chart-section" style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', marginBottom: '2rem' }}>
        <h3>{selectedUrl ? `Activity for ${selectedUrl.shortCode}` : 'Global All-Time Activity'}</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#667eea"
                strokeWidth={3}
                dot={{ fill: '#667eea', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {selectedUrl && (
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-start' }}>
          <button
            onClick={handleClearSelection}
            className="clear-btn"
            style={{
              padding: '0.6rem 1.2rem',
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              color: '#475569',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.borderColor = '#94a3b8'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
          >
            ← Back to Global Analytics
          </button>
        </div>
      )}

      <div className="analytics-content" style={{ display: selectedUrl ? 'block' : 'grid' }}>
        {/* URL List */}
        {!selectedUrl && (
          <section className="url-list-section">
            <h3>Your Shortened URLs</h3>
            <div className="url-list">
              {urlStats.length === 0 ? (
                <div className="empty-state">
                  <p>No shortened URLs available yet.</p>
                </div>
              ) : (
                urlStats.map((url) => (
                  <div
                    key={url.id}
                    className="url-item"
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
                ))
              )}
            </div>
          </section>
        )}

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
    </div>
  )
}

export default Analytics
