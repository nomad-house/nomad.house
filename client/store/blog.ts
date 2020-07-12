import Vue from 'vue'
import { mutationTree, getterTree } from 'nuxt-typed-vuex'
import { Author } from './core'

export const namespaced = true

export interface Post {
  title: string
  subtitle?: string
  author: Author
  category: string[]
  hero: string
  published: Date
  updated?: Date
  prominent?: boolean
  mbBody?: InstanceType<typeof Vue>
}

export interface Category {
  name: string
  slug: string
  body?: InstanceType<typeof Vue>
}

export const state = () => ({
  posts: [] as Post[],
  categories: [] as Category[]
})

export type BlogState = ReturnType<typeof state>

export const getters = getterTree(state, {
  topCategories(state): string[] {
    const categories = {} as { [slug: string]: number }

    for (const { category = [] } of state.posts) {
      for (const name of category) {
        if (!categories[name]) categories[name] = 0
        categories[name] += 1
      }
    }

    return Object.entries(categories)
      .sort(([_, count1], [__, count2]) => {
        if (count1 < count2) return 1
        if (count1 > count2) return -1
        return 0
      })
      .map(([slug]) => slug)
      .slice(0, 4)
  }
})

export const mutations = mutationTree(state, {
  SET_POSTS(state, posts: Post[]) {
    state.posts = posts
  },
  SET_CATEGORIES(state, categories: Category[]) {
    state.categories = categories
  }
})
