import Vue from 'vue'
import { Commit } from 'vuex'

export interface FrontMatter<T> {
  attributes: T
  html: string
  vue: {
    component: InstanceType<typeof Vue>
  }
}

const setContentType = ({
  context
}: {
  context: __WebpackModuleApi.RequireContext
}) => {
  return context
    .keys()
    .map((key) => ({
      key,
      value: context(key)
    }))
    .map(({ key, value }) => {
      const [, slug] = /^\.\/(.*)\.(?:md|json)$/.exec(key) || []
      if (!slug) throw new Error('no slug for ' + key)
      const { attributes } = value as FrontMatter<any>
      return { ...attributes, slug }
    })
}

export const actions = {
  nuxtServerInit({ commit }: { commit: Commit }) {
    Object.entries({
      core: {
        authors: require.context('@/assets/content/authors', false, /\.md$/)
      },
      blog: {
        posts: require.context('@/assets/content/posts', false, /\.md$/),
        categories: require.context(
          '@/assets/content/categories',
          false,
          /\.md$/
        )
      },
      recipes: {
        recipes: require.context('@/assets/content/recipes', false, /\.md$/),
        tags: require.context('@/assets/content/tags', false, /\.md$/)
      }
    }).forEach(([module, types]) => {
      for (const [type, context] of Object.entries(types)) {
        const items = context ? setContentType({ context }) : []
        return commit(`${module}/SET_${type.toUpperCase()}`, items)
      }
    })
  }
}
