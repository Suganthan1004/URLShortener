  export const fetchUrlStats = async () => {
    setLoading(true)
    setError('')
    try {
      const {data} = await axios.get(`${API_BASE_URL}/urls/stats`)
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

  export const fetchClickHistory = async (urlId) => {
    setHistoryLoading(true)
    try {
      const {data} = await axios.get(`${API_BASE_URL}/urls/${urlId}/clicks`)
      setClickHistory(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Fetch history error:', err)
      setClickHistory([])
    } finally {
      setHistoryLoading(false)
    }
  }
