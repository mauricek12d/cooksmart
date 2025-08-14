export type Meal = {
  title: string
  description: string
  time: string
  servings: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  ingredients: string[]
}
