import Vue from 'vue'
import {
  mutationTree,
  actionTree,
  getterTree,
  useAccessor
} from 'nuxt-typed-vuex'
import * as blogModule from './blog'

export interface Link {
  text?: string
  href?: string
  to?: string
}

export interface Tab extends Link {
  component?: typeof Vue
}

export interface Author {
  name: string
  slug: string
  body?: InstanceType<typeof Vue>
}

export interface Hero {
  heading?: string
  subHeading?: string
  img?: string
}

export const namespaced = true

export const state = () => ({
  drawerOpen: false,
  links: [] as Link[],
  tabs: [] as Tab[],
  activeTab: 0,
  paginationScrollY: 0,
  authors: [] as Author[],
  hero: {
    img: 'static/media/recipe_marbled_tea_eggs-1260x600.jpg',
    heading: 'Spiced Tea Eggs',
    subHeading: 'A delicious addition to any meal'
  } as Hero
})

export type CoreState = ReturnType<typeof state>

export const getters = getterTree(state, {
  isHero(state) {
    return Object.keys(state.hero).length
  }
})

export const mutations = mutationTree(state, {
  TOGGLE_DRAWER(state, open?: boolean) {
    state.drawerOpen = typeof open === 'boolean' ? open : !state.drawerOpen
  },
  SET_LINKS(state, links: Link[]) {
    state.links = links
  },
  SET_TABS(state, tabs: Tab[]) {
    state.tabs = tabs.map((tab) => ({ ...tab, component: undefined }))
  },
  SET_ACTIVE_TAB(state, index: number) {
    state.activeTab = index
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
