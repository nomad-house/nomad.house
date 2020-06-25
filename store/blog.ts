import Vue from 'vue'
import { mutationTree, getterTree } from 'nuxt-typed-vuex'

export const namespaced = true

export interface Post {
  readonly title: string
  readonly subtitle: string
  readonly hero: string
  readonly author: Author
  readonly category?: Category[]
  readonly prominent?: boolean
  readonly published: Date
  readonly updated?: Date
  readonly body: InstanceType<typeof Vue>
}

export interface Category {
  readonly name: string
  readonly slug: string
  readonly description?: InstanceType<typeof Vue>
}
export interface Author {
  readonly name: string
  readonly slug: string
  readonly description?: InstanceType<typeof Vue>
}

export const state = () => ({
  posts: [] as Post[],
  categories: [] as Category[],
  authors: [] as Author[]
})

export type BlogState = ReturnType<typeof state>

export const getters = getterTree(state, {
  topCategories(state): string[] {
    const categories = {} as { [slug: string]: number }

    for (const { category = [] } of state.posts) {
      for (const { name } of category) {
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
  setPosts(state, posts: Post[]) {
    state.posts = posts
  },
  setCategories(state, categories: Category[]) {
    state.categories = categories
  },
  setAuthors(state, authors: Author[]) {
    state.authors = authors
  }
})

// export const actions = actionTree(
//   { state, getters, mutations },
//   {
//     getPosts({ commit }) {
//       commit('setPosts', require('@/assets/articles.json'))
//     }
//   }
// )
