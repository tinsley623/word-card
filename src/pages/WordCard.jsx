import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import html2canvas from 'html2canvas'
import { analyzeWord } from '../api/analyze'
import CardContent from '../components/CardContent'
import '../styles/wordcard.css'

export default function WordCard() {
  const { word } = useParams()
  const navigate = useNavigate()
  const cardRef = useRef(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setData(null)

    analyzeWord(decodeURIComponent(word))
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [word])

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f5f0e8',
      })
      const link = document.createElement('a')
      link.download = `词卡-${decodeURIComponent(word)}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Download failed:', err)
    }
  }, [word])

  const decodedWord = decodeURIComponent(word)

  return (
    <div className="wordcard-page">
      <div className="wordcard-nav">
        <button className="nav-btn" onClick={() => navigate('/')}>
          ← 返回
        </button>
        {data && (
          <button className="nav-btn nav-btn-dark" onClick={handleDownload}>
            ↓ 下载 PNG
          </button>
        )}
      </div>

      {loading && (
        <div className="card-loading">
          <div className="loading-char">{decodedWord}</div>
          <div className="loading-text">
            正在解析「{decodedWord}」的灵魂<span className="loading-dots" />
          </div>
        </div>
      )}

      {error && (
        <div className="card-error">
          <h2>解析失败</h2>
          <p>{error}</p>
          <button className="nav-btn" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>
            返回首页
          </button>
        </div>
      )}

      {data && <CardContent ref={cardRef} data={data} />}
    </div>
  )
}
