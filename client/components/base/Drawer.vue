<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Link } from '@/store/core'

@Component({})
export default class Drawer extends Vue {
  get drawerOpen() {
    return this.$vuex.core.drawerOpen
  }

  get links() {
    return this.$vuex.core.links
  }

  toggleDrawer(state?: boolean) {
    return this.$vuex.core.TOGGLE_DRAWER(state)
  }

  onClick(e: MouseEvent, link: Link) {
    e.stopPropagation()
    if (link.to === '/') {
      this.$vuetify.goTo(0)
      this.toggleDrawer(false)
      return
    }
    if (link.to || !link.href) return
    this.$vuetify.goTo(link.href)
    this.toggleDrawer(false)
  }

  onTransitionend(open: any) {
    if (open !== this.drawerOpen) {
      this.toggleDrawer()
    }
  }
}
</script>

<template>
  <v-navigation-drawer
    app
    dark
    right
    temporary
    :value="drawerOpen"
    @input="onTransitionend"
  >
    <v-list>
      <v-list-item
        v-for="(link, i) in links"
        :key="i"
        :href="link.href"
        @click="onClick($event, link)"
      >
        <v-list-item-title v-text="link.text" />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
