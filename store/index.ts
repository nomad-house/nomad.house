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
    .map((key) => context(key))
    .map((value) => {
      const { attributes } = value as FrontMatter<any>
      return attributes
    })
}

export const actions = {
  nuxtServerInit({ commit }: { commit: Commit }) {
    Object.entries({
      blog: {
        posts: require.context('@/assets/content/posts', false, /\.md$/),
        categories: require.context(
          '@/assets/content/categories',
          false,
          /\.md$/
        ),
        authors: require.context('@/assets/content/authors', false, /\.md$/)
      },
      recipes: {
        recipes: require.context('@/assets/content/recipes', false, /\.md$/),
        tags: require.context('@/assets/content/tags', false, /\.md$/)
      }
    }).forEach(([module, types]) => {
      for (const [type, context] of Object.entries(types)) {
        const items = context ? setContentType({ context }) : []
        const name = type[0].toUpperCase().concat(type.slice(1))
        return commit(`${module}/set${name}`, items)
      }
    })
  }
}
