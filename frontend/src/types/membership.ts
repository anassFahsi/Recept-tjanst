export type MembershipLevel = {
  id: number
  name: string
  slug: 'basic' | 'premium' | 'premium-plus'
  tier: number
  priceOre: number
  maxSavedRecipes: number
  description: string | null
}