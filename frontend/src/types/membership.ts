export type MembershipLevel = {
  id: number
  name: string
  slug: 'basic' | 'premium' | 'premium-plus'
  tier: number
  priceOre: number
  maxSavedRecipes: number | null
  description: string | null
}