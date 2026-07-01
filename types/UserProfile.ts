export type UserProfile = {
  id: string
  email: string
  avatarUrl?: string
  scrollBudgetInMs: number
  trackingEnabled: boolean
  createdAt: Date
  updatedAt: Date
}