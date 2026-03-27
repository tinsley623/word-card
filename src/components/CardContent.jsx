import { forwardRef } from 'react'

function parseBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

const CardContent = forwardRef(function CardContent({ data }, ref) {
  const today = new Date().toISOString().split('T')[0]
  const typeLabel = data.type === 'zh' ? '汉字' : '英文'

  return (
    <div className="card-wrap" ref={ref}>
      <div className="card-inner">
        <div className="card-ref">
          REF一{data.category} / {data.word}
        </div>

        <div className="card-meta">
          <span className="card-badge">{typeLabel}</span>
          <span className="card-badge card-badge-date">{today}</span>
        </div>

        <div className="card-char">{data.word}</div>
        <div className="card-pinyin">{data.pinyin}</div>
        <div className="card-brief">{data.brief}</div>

        <div className="card-origin">
          <div className="card-section-label">原始画面 · ORIGIN</div>
          <div className="card-origin-text">{parseBold(data.origin.description)}</div>
        </div>

        <div className="card-symbols">
          <div className="card-symbols-title">核心意象 · Core Symbol</div>
          <div className="card-symbols-list">
            {data.origin.coreSymbols.map((s) => (
              <span key={s} className="card-symbol-tag">{s}</span>
            ))}
          </div>
          {data.origin.symbolFormula && (
            <div className="card-formula">{data.origin.symbolFormula}</div>
          )}
        </div>

        <div className="card-summary">
          <div className="card-summary-label">意象归结</div>
          <div className="card-summary-text">{parseBold(data.origin.summary)}</div>
        </div>

        <div className="card-insights">
          <div className="card-section-label">深层解析 · INSIGHT</div>
          {data.insights.map((text, i) => (
            <div key={i} className="card-insight-block">
              {parseBold(text)}
            </div>
          ))}
        </div>
      </div>

      <div className="card-epiphany">
        <div className="card-epiphany-label">一语道破 · Epiphany</div>
        <div className="card-epiphany-divider" />
        <div className="card-epiphany-en">{data.epiphany.en}</div>
        <div className="card-epiphany-zh">{data.epiphany.zh}</div>
      </div>

      <div className="card-footer">
        <span className="card-footer-text">词卡 · 先解词，后铸卡</span>
        <span className="card-footer-text">{typeLabel}</span>
      </div>
    </div>
  )
})

export default CardContent
