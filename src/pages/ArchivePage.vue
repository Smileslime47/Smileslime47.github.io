<script setup lang="ts">
import { computed, ref } from 'vue'
import { postsService } from '@/service/posts'
import type { PostMeta } from '@/service/posts'
import { toDayKey, toMonthKey } from '@/utils/date'

type DayGroup = {
  dayKey: string
  dayLabel: string
  posts: PostMeta[]
}

type MonthGroup = {
  monthKey: string
  monthLabel: string
  count: number
  days: DayGroup[]
}

const loading = ref(true)
const posts = ref<PostMeta[]>([])

postsService
  .loadAllPostMetas()
  .then((items) => {
    posts.value = items
  })
  .finally(() => {
    loading.value = false
  })

const total = computed(() => posts.value.length)
const monthGroups = computed<MonthGroup[]>(() => buildMonthGroups(posts.value))

function buildMonthGroups(source: PostMeta[]): MonthGroup[] {
  const monthMap = new Map<string, Map<string, PostMeta[]>>()

  for (const post of source) {
    const monthKey = toMonthKey(post.publishedAt)
    const dayKey = toDayKey(post.publishedAt)

    const monthBucket = monthMap.get(monthKey) ?? new Map<string, PostMeta[]>()
    const dayBucket = monthBucket.get(dayKey) ?? []
    dayBucket.push(post)
    monthBucket.set(dayKey, dayBucket)
    monthMap.set(monthKey, monthBucket)
  }

  return [...monthMap.entries()]
    .sort(([a], [b]) => compareTimeKeyDesc(a, b))
    .map(([monthKey, dayMap]) => {
      const days = [...dayMap.entries()]
        .sort(([a], [b]) => compareTimeKeyDesc(a, b))
        .map(([dayKey, dayPosts]) => ({
          dayKey,
          dayLabel: dayKey === 'unknown-day' ? '未标注日期' : dayKey,
          posts: dayPosts,
        }))

      return {
        monthKey,
        monthLabel: monthKey === 'unknown-month' ? '未标注年月' : monthKey,
        count: days.reduce((acc, day) => acc + day.posts.length, 0),
        days,
      }
    })
}

function compareTimeKeyDesc(a: string, b: string): number {
  if (a.startsWith('unknown')) return 1
  if (b.startsWith('unknown')) return -1
  return b.localeCompare(a, 'zh-Hans-CN')
}

</script>

<template>
  <ContentPageLayout>
    <template #hero>
      <p class="eyebrow">归档</p>
      <h1>文章归档</h1>
      <p class="subtitle">先按年月归档，再按天展开时间轴。</p>
      <div class="meta">
        <span>文章总数 {{ total }}</span>
      </div>
    </template>

    <template #default>
      <div v-if="loading" class="state">正在加载归档...</div>
      <div v-else class="archive-list">
        <section
          v-for="month in monthGroups"
          :key="month.monthKey"
          class="archive-month"
        >
          <header class="month-head">
            <h2>{{ month.monthLabel }}</h2>
            <span>{{ month.count }}</span>
          </header>

          <div class="month-body">
            <div
              v-for="day in month.days"
              :key="day.dayKey"
              class="day-group"
            >
              <p class="day-label">{{ day.dayLabel }}</p>
              <router-link
                v-for="post in day.posts"
                :key="post.id"
                :to="post.url"
                class="archive-item"
              >
                <span class="archive-title">{{ post.title }}</span>
              </router-link>
            </div>
          </div>
        </section>
      </div>
    </template>
  </ContentPageLayout>
</template>

<style scoped lang="less">
.eyebrow {
  margin: 0 0 4px;
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--surface-muted);
}

h1 {
  margin: 0;
  color: var(--surface-title);
  font-size: clamp(1.2rem, 2.6vw, 1.6rem);
  line-height: 1.15;
}

.subtitle {
  margin: 4px 0 0;
  color: var(--surface-text);
  font-size: 0.9rem;
}

.meta {
  margin-top: 8px;
}

.meta span {
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid var(--tag-border);
  color: var(--tag-text);
  font-size: 0.74rem;
  background: var(--tag-bg);
}

.state {
  color: var(--surface-text);
}

.archive-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.archive-month {
  border: 1px solid var(--glass-border-soft);
  border-radius: 14px;
  padding: 10px 12px;
  background: color-mix(in oklab, var(--surface-bg) 92%, transparent);
}

.month-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.month-head h2 {
  margin: 0;
  color: var(--surface-title);
  font-size: 1rem;
}

.month-head span {
  font-size: 0.75rem;
  color: var(--surface-muted);
  border: 1px solid var(--tag-border);
  border-radius: 999px;
  padding: 1px 8px;
}

.month-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.day-group {
  display: flex;
  flex-direction: column;
}

.day-label {
  margin: 0 0 2px;
  font-size: 0.8rem;
  color: var(--surface-muted);
}

.archive-item {
  display: block;
  padding: 8px 2px;
  border-bottom: 1px solid var(--glass-border-soft);
  color: var(--surface-text);
  text-decoration: none;
}

.archive-item:hover {
  color: var(--surface-title);
}

.archive-title {
  min-width: 0;
  font-size: 0.95rem;
}

@media (max-width: 640px) {
  .archive-item { padding: 7px 2px; }
}
</style>
