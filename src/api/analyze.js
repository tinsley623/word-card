const SYSTEM_PROMPT = `你是一位精通汉字溯源、语言哲学和跨文化语义学的学者。目标不是翻译，而是让用户掌握这个词的深层含义。

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
5. "origin.description": 用一句话描述该词源头最物理、最具象的画面。中文从甲骨文/篆书构件解析，英文从词根词源解析
6. "origin.coreSymbols": 提炼 3 个核心意象关键词
7. "origin.symbolFormula": 用公式表达核心意象的组合关系（如"温暖 + 时间 + 保护 = 孕育"）
8. "origin.summary": 一句话归结意象的深层含义
9. "insights": 2-3 段深层解析，每段 80-120 字。要有穿透力，展现词源、多领域含义之间的内在联系。用 **粗体** 标注关键概念
10. "epiphany": 一句富有哲学高度的双语金句，中英互为映照而非直译，总结该词的灵魂
11. 只输出 JSON，不要 markdown 代码块标记`

export async function analyzeWord(word) {
  const apiKey = import.meta.env.VITE_LLM_API_KEY

  if (!apiKey) {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      if (res.status === 500 && err.error?.includes('not configured')) {
        return getDemoData(word)
      }
      throw new Error(err.error || `API error: ${res.status}`)
    }

    return res.json()
  }

  const apiBase = import.meta.env.VITE_LLM_API_BASE || 'https://api.deepseek.com/v1'
  const model = import.meta.env.VITE_LLM_MODEL || 'deepseek-chat'

  const res = await fetch(`${apiBase}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: word },
      ],
      temperature: 0.7,
    }),
  })

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }

  const data = await res.json()
  const content = data.choices[0].message.content.trim()

  const jsonStr = content.replace(/^```json?\s*/i, '').replace(/```\s*$/, '')
  return JSON.parse(jsonStr)
}

function getDemoData(word) {
  const demos = {
    '道': {
      word: '道',
      type: 'zh',
      pinyin: 'dào',
      brief: '道路；宇宙运行的法则',
      category: '哲学',
      origin: {
        description: '一个头颅（首）在十字路口（辶）中移动，象征着人在路径上的抉择与前行',
        coreSymbols: ['头颅', '十字路口', '移动'],
        symbolFormula: '意识 + 选择 + 前行 = 道',
        summary: '意识引领下的路径',
      },
      insights: [
        '「道」的甲骨文描绘了「首」在「行」（道路）中的意象，其最初画面是**人在岔路中用头脑选择方向**。这不仅是物理道路，更是**意识介入行动的起点**，将盲目行走升华为有目的的前行。',
        '从具体路径抽象为**万物运行的轨迹与法则**，是中国哲学的核心跃迁。它既是脚下之路，也是治国之道、自然天道。这种从具象到抽象的思维，使「道」成为理解**秩序、方法与终极真理**的枢纽，连接着日常选择与宇宙规律。',
      ],
      epiphany: {
        en: 'The path is both the journey and the law that guides it.',
        zh: '道，既是行之路，亦是导之行之法',
      },
    },
    '意': {
      word: '意',
      type: 'zh',
      pinyin: 'yì',
      brief: '心之所向；意念与意义',
      category: '情感',
      origin: {
        description: '「音」在「心」上，声音抵达内心深处引发的回响与感悟',
        coreSymbols: ['声音', '心灵', '共鸣'],
        symbolFormula: '声音 + 心灵 + 共鸣 = 意',
        summary: '声音触及心灵的那一刻',
      },
      insights: [
        '「意」由「音」与「心」组成，描绘的是**声音抵达心灵时产生的内在回响**。这不是简单的听觉，而是**感知穿透表象后的深层理解**——当一个音符拨动心弦，意义便在那一刻诞生。',
        '从内心感受延伸为**意图、意义、意境**三重维度。意图是心的方向，意义是心的判断，意境是心的境界。这三者构成了人类从**感知到认知再到审美**的完整精神链条。',
      ],
      epiphany: {
        en: 'Meaning is born when sound reaches the heart.',
        zh: '意，乃声音抵达心灵时绽放的花',
      },
    },
    'Serendipity': {
      word: 'Serendipity',
      type: 'en',
      pinyin: '/ˌser.ənˈdɪp.ɪ.ti/',
      brief: '意外发现美好事物的能力',
      category: '哲学',
      origin: {
        description: '源自 Horace Walpole 1754 年造词，取自波斯童话《锡兰三王子》——三位王子总能在旅途中意外发现珍宝',
        coreSymbols: ['意外', '旅途', '珍宝'],
        symbolFormula: '好奇心 + 行走 + 敏锐 = 幸运的发现',
        summary: '命运对好奇心的奖赏',
      },
      insights: [
        'Serendipity 不是单纯的幸运，而是**准备好的心灵遇见意外时迸发的洞察力**。弗莱明发现青霉素、牛顿被苹果砸中——这些"偶然"背后是长期积累的**专注与敏感**。机遇只偏爱有准备的头脑。',
        '这个词揭示了**计划与混沌之间的创造力空间**。过度规划扼杀惊喜，完全放任则一无所获。Serendipity 发生在二者的交界处——你必须**在行走中保持警觉，在秩序中留出缝隙**。',
      ],
      epiphany: {
        en: 'The universe hides its gifts in the cracks of your plans.',
        zh: '宇宙将礼物藏在你计划的缝隙里',
      },
    },
  }

  if (demos[word]) return Promise.resolve(demos[word])

  const isChinese = /[\u4e00-\u9fff]/.test(word)
  return Promise.resolve({
    word,
    type: isChinese ? 'zh' : 'en',
    pinyin: isChinese ? 'pīnyīn' : '/prəˌnʌn.siˈeɪ.ʃən/',
    brief: '释义加载中（请配置 API Key 以获取完整解析）',
    category: '未分类',
    origin: {
      description: `「${word}」的深层字源解析需要 AI 支持。请在 .env 中配置 VITE_LLM_API_KEY 以启用实时分析。`,
      coreSymbols: ['待解析'],
      summary: '等待 AI 解析',
    },
    insights: [
      `当前为演示模式。配置 LLM API Key 后，将为「${word}」生成完整的字源溯析、核心意象和深层哲思。`,
    ],
    epiphany: {
      en: 'Every word carries a universe within.',
      zh: '每一个字，都承载着一个宇宙',
    },
  })
}
