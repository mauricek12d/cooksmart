import { NextResponse } from 'next/server'
import OpenAI from 'openai'

type Meal = {
  title: string
  description: string
  time: string
  servings: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  ingredients: string[]
}

function mockMeals(ingredients: string[]): Meal[] {
  const base = ingredients.length ? ingredients.slice(0, 6).join(', ') : 'pantry staples'
  return [
    {
      title: 'Creamy Chicken Pasta',
      description: `Rich pasta with tender chicken, herbs, and ${base}.`,
      time: '25 min',
      servings: 4,
      difficulty: 'Easy',
      ingredients: ingredients.length ? ingredients : ['chicken', 'pasta', 'garlic', 'cream', 'parsley'],
    },
    {
      title: 'Garlic Broccoli Stir-Fry',
      description: `Crisp broccoli tossed in garlic-soy glaze using ${base}.`,
      time: '15 min',
      servings: 2,
      difficulty: 'Easy',
      ingredients: ingredients.length ? ingredients : ['broccoli', 'garlic', 'soy sauce', 'ginger', 'sesame oil'],
    },
    {
      title: 'Herbed Parmesan Rice',
      description: `Comforting rice with parmesan and herbs; complements ${base}.`,
      time: '20 min',
      servings: 3,
      difficulty: 'Easy',
      ingredients: ingredients.length ? ingredients : ['rice', 'parmesan', 'butter', 'herbs'],
    },
  ]
}

export async function POST(req: Request) {
  try {
    const { ingredients } = await req.json().catch(() => ({ ingredients: [] }))
    const list = Array.isArray(ingredients) ? ingredients.map((s: string) => String(s).trim()).filter(Boolean) : []

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey || apiKey === 'YOUR_OPENAI_KEY') {
      // Dev/mock mode
      return NextResponse.json({ meals: mockMeals(list), source: 'mock' })
    }

    const openai = new OpenAI({ apiKey })
    const system = [
      'You are a friendly chef. Return ONLY JSON with this shape:',
      '{ "meals": [ { "title": "...", "description": "...", "time": "20 min", "servings": 2, "difficulty": "Easy|Medium|Hard", "ingredients": ["a","b"] } ] }',
      'No additional prose.',
    ].join(' ')

    const user = `Using ONLY these ingredients where possible: ${list.join(', ') || 'pantry staples'}. Return 3 meals with concise descriptions (<= 2 sentences each).`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    })

    const content = completion.choices?.[0]?.message?.content ?? '{}'
    let json: any = {}
    try { json = JSON.parse(content) } catch { json = {} }
    const meals: Meal[] = Array.isArray(json?.meals) ? json.meals : mockMeals(list)

    return NextResponse.json({ meals, source: 'openai' })
  } catch (e: any) {
    // Fallback to mock on any error so UX is never blocked
    return NextResponse.json({ meals: mockMeals([]), source: 'error_fallback', error: e?.message }, { status: 200 })
  }
}
