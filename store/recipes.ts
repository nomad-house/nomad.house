import Vue from 'vue'
import { mutationTree, getterTree } from 'nuxt-typed-vuex'

export const namespaced = true

interface Quantity {
  quantity: number
  label?: string
}

export interface Ingredient {
  quantities: Quantity[]
  mass?: Quantity
  name: string
  preparation?: string
  options?: string
}

export interface Recipe {
  title: string
  subtitle?: string
  hero: string
  author: Author
  tags?: Tag[]
  published: Date
  updated?: Date
  description?: string
  ingredients: Ingredient[]
  instructions: string[]
}

export interface Tag {
  name: string
  slug: string
  body?: InstanceType<typeof Vue>
}

export interface Author {
  name: string
  slug: string
  body?: InstanceType<typeof Vue>
}

export const state = () => ({
  recipes: [] as Recipe[],
  tags: [] as Tag[],
  authors: [] as Author[]
})

export type RecipeState = ReturnType<typeof state>

export const getters = getterTree(state, {
  topTags(state): string[] {
    const top = {} as { [slug: string]: number }

    for (const { tags = [] } of state.recipes) {
      for (const { name } of tags) {
        if (!top[name]) top[name] = 0
        top[name] += 1
      }
    }

    return Object.entries(top)
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
  setRecipes(state, recipes: Recipe[]) {
    state.recipes = recipes
  },
  setTags(state, tags: Tag[]) {
    state.tags = tags
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
