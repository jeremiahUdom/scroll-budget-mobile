export const getWeekDateRange = () => {
  const today = new Date()
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(today.getDate() - 6)

  const format = (date: Date) => 
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return `${format(sevenDaysAgo)} — ${format(today)}`
}