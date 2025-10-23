import { useState } from 'react'
import './App.css'

function App() {
  const [apiResponse, setApiResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [name, setName] = useState('')

  const FUNCTION_URL = import.meta.env.VITE_FUNCTION_URL

  const callFunction = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const url = name ? `${FUNCTION_URL}?name=${encodeURIComponent(name)}` : FUNCTION_URL
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setApiResponse(data)
    } catch (err) {
      setError(err.message)
      console.error('Function call error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>


      <div className="card" style={{ marginTop: '2rem', paddingTop: '2rem' }}>
        <h2>DO Functions Integration</h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <input 
            type="text" 
            placeholder="Dein Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ 
              padding: '0.5rem', 
              fontSize: '1rem',
              marginRight: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #444'
            }}
          />
          <button onClick={callFunction} disabled={loading}>
            {loading ? 'Loading...' : 'Call Function API'}
          </button>
        </div>

        {error && (
          <div style={{ color: '#ff6b6b', marginTop: '1rem' }}>
            <strong>Error:</strong> {error}
            <br />
            <small>Hast du die VITE_FUNCTION_URL gesetzt?</small>
          </div>
        )}

        {apiResponse && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            background: '#1a1a1a', 
            borderRadius: '8px',
            textAlign: 'left'
          }}>
            <strong>Function Response:</strong>
            <pre style={{ 
              marginTop: '0.5rem',
              overflow: 'auto',
              fontSize: '0.9rem'
            }}>
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        )}

        <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '1rem' }}>
          Diese App ruft eine DO Function ab.<br />
          Function URL: <code>{FUNCTION_URL}</code>
        </p>
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
