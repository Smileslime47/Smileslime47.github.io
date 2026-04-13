export function parseDateValue(value?: string): Date | null {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatZhDate(value?: string, fallback = '未标注日期'): string {
  if (!value) return fallback
  const date = parseDateValue(value)
  if (!date) return value

  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export function pad2(value: number): string {
  return String(value).padStart(2, '0')
}

export function toMonthKey(value?: string): string {
  const date = parseDateValue(value)
  return date ? `${date.getFullYear()}-${pad2(date.getMonth() + 1)}` : 'unknown-month'
}

export function toDayKey(value?: string): string {
  const date = parseDateValue(value)
  return date ? `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}` : 'unknown-day'
}
