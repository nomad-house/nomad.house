import Vue from 'vue'
import { mutationTree, getterTree } from 'nuxt-typed-vuex'
import { Author } from './core'

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
  slug: string
  title: string
  subtitle?: string
  hero: string
  author: Author
  tags?: Tag[]
  published: Date
  updated?: Date
  description?: InstanceType<typeof Vue>
  ingredients: Ingredient[]
  instructions: string[]
}

const defaultRecipe: Recipe = {
  slug: '',
  title: '',
  hero: '',
  author: {
    name: '',
    slug: ''
  },
  published: new Date(),
  ingredients: [],
  instructions: []
}

export interface Tag {
  name: string
  slug: string
  body?: InstanceType<typeof Vue>
}

interface RecipeState {
  activeRecipe: Recipe
  recipes: Recipe[]
  tags: Tag[]
}

export const state = (): RecipeState => ({
  activeRecipe: defaultRecipe,
  recipes: [] as Recipe[],
  tags: [] as Tag[]
})

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
  SET_RECIPES(state, recipes: Recipe[]) {
    state.recipes = recipes
  },
  SET_ACTIVE_RECIPE(state, recipe: Recipe) {
    state.activeRecipe = recipe
  },
  SET_TAGS(state, tags: Tag[]) {
    state.tags = tags
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
