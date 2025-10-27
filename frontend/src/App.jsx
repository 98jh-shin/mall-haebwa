import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [apiStatus, setApiStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Backend API 연결 테스트
    const checkAPI = async () => {
      try {
        const response = await axios.get('/api')
        setApiStatus(response.data)
        setError(null)
      } catch (err) {
        setError('API 연결 실패: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    checkAPI()
  }, [])

  const checkHealth = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/health')
      alert('Health Check: ' + JSON.stringify(response.data, null, 2))
    } catch (err) {
      alert('Health Check 실패: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <header className="header">
        <h1>🛍️ E-Commerce AI Platform</h1>
        <p>React + Vite + FastAPI</p>
      </header>

      <main className="main">
        <div className="card">
          <h2>🎯 API 연결 상태</h2>
          {loading ? (
            <p>로딩 중...</p>
          ) : error ? (
            <div className="error">
              <p>❌ {error}</p>
              <small>Backend 서버가 실행 중인지 확인해주세요. (http://localhost:8000)</small>
            </div>
          ) : (
            <div className="success">
              <p>✅ Backend API 연결 성공!</p>
              <pre className="code">
                {JSON.stringify(apiStatus, null, 2)}
              </pre>
              <button onClick={checkHealth} className="button">
                Health Check 실행
              </button>
            </div>
          )}
        </div>

        <div className="card">
          <h2>📋 프로젝트 정보</h2>
          <ul className="info-list">
            <li><strong>Frontend:</strong> React 18 + Vite</li>
            <li><strong>Backend:</strong> FastAPI (Python)</li>
            <li><strong>Database:</strong> MongoDB (예정)</li>
            <li><strong>AI/LLM:</strong> 구현 예정</li>
          </ul>
        </div>

        <div className="card">
          <h2>🚀 다음 단계</h2>
          <ul className="checklist">
            <li>✅ Vite + React 프론트엔드 설정</li>
            <li>✅ FastAPI 백엔드 연동</li>
            <li>⏳ MongoDB 데이터베이스 연결</li>
            <li>⏳ 사용자 인증 시스템</li>
            <li>⏳ 상품 관리 API</li>
            <li>⏳ AI 검색 기능</li>
          </ul>
        </div>
      </main>
    </div>
  )
}

export default App
