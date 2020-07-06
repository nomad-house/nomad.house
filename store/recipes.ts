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

export interface Instruction {
  name?: string
  text: string
  beforeImage?: string
  afterImage?: string
  tip?: string
}

export interface Duration {
  hours: number
  minutes: number
}

interface Yield {
  servings?: number
  description?: string
}

export interface Recipe {
  slug: string
  title: string
  description?: string
  author: string
  published: Date
  updated?: Date
  images: { image: string; aspectRatio: string }[]
  prepTime?: Duration
  cookTime?: Duration
  yield?: Yield
  categories?: string[]
  cuisines?: string[]
  cookingMethods?: string[]
  tags?: string[]
  suitableForDiet?: string[]
  nutrition?: {
    servingSize?: string
    calories?: number
    carbohydrateContent?: number
    cholesterolContent?: number
    fatContent?: number
    fiberContent?: number
    proteinContent?: number
    saturatedFatContent?: number
    sodiumContent?: number
    sugarContent?: number
    transFatContent?: number
    unsaturatedFatContent?: number
  }
  ingredients: Ingredient[]
  instructions: Instruction[]
  subRecipes?: {
    title: string
    description?: string
    yield?: Yield
    ingredients: Ingredient[]
    instructions: Instruction[]
  }[]
  body?: InstanceType<typeof Vue>
}

const defaultRecipe: Recipe = {
  slug: '',
  title: '',
  images: [],
  author: '',
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
      for (const name of tags) {
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
    const active = { ...recipe }
    if (typeof recipe.published === 'string') {
      active.published = new Date(recipe.published)
    }
    if (typeof recipe.updated === 'string') {
      active.updated = new Date(recipe.updated)
    }
    state.activeRecipe = active
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
