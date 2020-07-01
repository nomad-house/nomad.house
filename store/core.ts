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

export const namespaced = true

export const state = () => ({
  drawerOpen: false,
  links: [] as Link[],
  tabs: [] as Tab[],
  paginationScrollY: 0
})

export type CoreState = ReturnType<typeof state>

export const getters = getterTree(state, {
  drawerOpen(state) {
    return state.drawerOpen
  }
})

export const mutations = mutationTree(state, {
  toggleDrawer(state, open?: boolean) {
    state.drawerOpen = typeof open === 'boolean' ? open : !state.drawerOpen
  },
  setLinks(state, links: Link[]) {
    state.links = links
  },
  setPaginationY(state, scrollY: number) {
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
        'setLinks',
        blog.topCategories.map((category) => ({
          text: category,
          href: `/${category.toLowerCase()}`,
          to: `/${category.toLowerCase()}`
        }))
      )
    }
  }
)
