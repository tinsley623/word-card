import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/home.css'

const RECOMMENDED = [
  { text: '道', type: 'zh' },
  { text: '意', type: 'zh' },
  { text: '缘', type: 'zh' },
  { text: '惜', type: 'zh' },
  { text: '空', type: 'zh' },
  { text: 'Serendipity', type: 'en' },
  { text: 'Resilience', type: 'en' },
  { text: 'Entropy', type: 'en' },
  { text: 'Ephemeral', type: 'en' },
  { text: 'Incubate', type: 'en' },
]

const BG_CHARS = ['意', '字', '词', '道', '缘']

export default function Home() {
  const [input, setInput] = useState('')
  const navigate = useNavigate()

  const bgElements = useMemo(() =>
    BG_CHARS.map((ch, i) => ({
      ch,
      style: {
        fontSize: `${12 + Math.random() * 16}rem`,
        left: `${(i * 22) + Math.random() * 10}%`,
        top: `${10 + Math.random() * 60}%`,
        transform: `rotate(${-15 + Math.random() * 30}deg)`,
      },
    })), [])

  const handleSearch = () => {
    const word = input.trim()
    if (word) navigate(`/word/${encodeURIComponent(word)}`)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="home">
      <div className="home-bg-chars">
        {bgElements.map(({ ch, style }, i) => (
          <span key={i} className="home-bg-char" style={style}>{ch}</span>
        ))}
      </div>

      <div className="home-content">
        <div className="home-logo">词</div>
        <div className="home-subtitle">一 字 一 世 界</div>
        <p className="home-desc">
          输入单个汉字或英文单词<br />
          深度挖掘其灵魂深处的含义
        </p>

        <div className="search-box">
          <input
            className="search-input"
            placeholder='输入单个汉字或英文单词，如「道」或「Serendipity」'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <button className="search-btn" onClick={handleSearch} aria-label="搜索">
            🔍
          </button>
        </div>

        <p className="home-desc-sub">中文仅支持单个汉字，英文仅支持单个单词。先解词，再铸卡。</p>

        <div className="home-tags">
          <span className="home-tags-label">试试这些：</span>
          {RECOMMENDED.map(({ text }) => (
            <a
              key={text}
              className="home-tag"
              onClick={() => navigate(`/word/${encodeURIComponent(text)}`)}
            >
              {text}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
