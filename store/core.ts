import Vue from 'vue'
import {
  mutationTree,
  actionTree,
  getterTree,
  useAccessor
} from 'nuxt-typed-vuex'
import * as blogModule from './blog'

export interface Link {
  text: string
  href: string
  to: string
}

export interface Tab extends Link {
  component: typeof Vue
}

export interface Author {
  name: string
  slug: string
  body?: InstanceType<typeof Vue>
}

export const namespaced = true

export const state = () => ({
  drawerOpen: false,
  links: [] as Link[],
  tabs: [] as Tab[],
  paginationScrollY: 0,
  authors: [] as Author[]
})

export type CoreState = ReturnType<typeof state>

export const getters = getterTree(state, {
  drawerOpen(state) {
    return state.drawerOpen
  }
})

export const mutations = mutationTree(state, {
  TOGGLE_DRAWER(state, open?: boolean) {
    state.drawerOpen = typeof open === 'boolean' ? open : !state.drawerOpen
  },
  SET_LINKS(state, links: Link[]) {
    state.links = links
  },
  SET_AUTHORS(state, authors: Author[]) {
    state.authors = authors
  },
  SET_VIEWPORT_RESET(state, scrollY: number) {
    state.paginationScrollY = scrollY
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    initialize({ commit }) {
      const blog = useAccessor(
        this.app.store!,
        { ...blogModule, namespaced: true },
        'blog'
      )
      commit(
        'SET_LINKS',
        blog.topCategories.map((category) => ({
          text: category,
          href: `/${category.toLowerCase()}`,
          to: `/${category.toLowerCase()}`
        }))
      )
    }
  }
)
