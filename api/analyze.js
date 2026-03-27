export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { word } = req.body
  if (!word) {
    return res.status(400).json({ error: 'Missing word parameter' })
  }

  const apiKey = process.env.LLM_API_KEY
  const apiBase = process.env.LLM_API_BASE || 'https://api.deepseek.com/v1'
  const model = process.env.LLM_MODEL || 'deepseek-chat'

  if (!apiKey) {
    return res.status(500).json({ error: 'LLM API key not configured' })
  }

  const systemPrompt = `你是一位精通汉字溯源、语言哲学和跨文化语义学的学者。目标不是翻译，而是让用户掌握这个词的深层含义。

用户会输入一个汉字或英文单词，你需要深度挖掘它的灵魂，返回结构化 JSON 数据。

## 输出 JSON 格式（严格遵循，不要输出任何 JSON 之外的内容）：

{
  "word": "Incubate",
  "type": "en",
  "pinyin": "/ˈɪŋ.kjə.beɪt/",
  "brief": "孵化；酝酿",
  "category": "生命",
  "origin": {
    "description": "母鸡趴在蛋上，用体温将混沌的蛋液催化为有序的生命",
    "coreSymbols": ["温暖", "时间", "保护"],
    "symbolFormula": "温暖 + 时间 + 保护 = 孕育",
    "summary": "以耐心守护混沌，直到秩序自行涌现"
  },
  "insights": [
    "Incubate 源自拉丁语 incubāre（趴在上面），最初的物理画面是**母鸡用体温覆盖鸡蛋**。这不是简单的加热，而是一种**恰到好处的温度传递**——太高会杀死胚胎，太低则无法启动分化。这个词的灵魂是：**创造条件，而非创造结果**。",
    "从生物学延伸到商业（孵化器）和医学（潜伏期），incubate 揭示了一个深层模式：**所有伟大的事物都需要一段看似无事发生的酝酿期**。在这段沉默中，混沌正在被悄然编排为秩序。急于打开蛋壳，只会得到一滩黏液。"
  ],
  "epiphany": {
    "en": "Greatness is not built — it is hatched.",
    "zh": "伟大不是建造出来的，而是孵化出来的"
  }
}

## 规则：
1. "type": 中文字用 "zh"，英文词用 "en"
2. "pinyin": 中文给拼音（带声调），英文给音标
3. "brief": 一句话核心释义
4. "category": 归属领域（哲学、情感、自然、科学、生命等）
5. "origin.description": 用一句话描述该词源头最物理、最具象的画面
6. "origin.coreSymbols": 提炼 3 个核心意象关键词
7. "origin.symbolFormula": 用公式表达核心意象的组合关系
8. "origin.summary": 一句话归结意象的深层含义
9. "insights": 2-3 段深层解析，每段 80-120 字，用 **粗体** 标注关键概念
10. "epiphany": 一句富有哲学高度的双语金句
11. 只输出 JSON，不要 markdown 代码块标记`

  try {
    const response = await fetch(`${apiBase}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: word },
        ],
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      return res.status(response.status).json({ error: `LLM API error: ${response.status}` })
    }

    const data = await response.json()
    const content = data.choices[0].message.content.trim()
    const jsonStr = content.replace(/^```json?\s*/i, '').replace(/```\s*$/, '')
    const result = JSON.parse(jsonStr)

    return res.status(200).json(result)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
