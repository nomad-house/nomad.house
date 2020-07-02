<script lang="ts">
import { Watch, Prop, Component, Mixins } from 'vue-property-decorator'
import { Positioning, ScrollInfo } from '../mixins/Positioning'
import { Resize } from '../mixins/Resize'
import HamburgerIcon from './HamburgerIcon.vue'

@Component({
  components: {
    HamburgerIcon
  }
})
export default class Toolbar extends Mixins(Positioning, Resize) {
  height = 0
  maxWidth = '100%'
  fixed = false

  @Prop({ default: '100vh' }) heroHeight!: string
  @Prop({ default: 'transparent', required: false }) startColor!: string
  @Prop() scrollInfo!: ScrollInfo
  @Watch('scrollInfo')
  onScrollInfo() {
    if (this.$refs.positioning) {
      const { bottom } = (this.$refs
        .positioning as Element).getBoundingClientRect()
      this.fixed = bottom <= 0
    }
  }

  get offsetHeight() {
    return `calc(${this.heroHeight} - ${this.height}px)`
  }

  get color(): 'default' | 'transparent' | string {
    return this.scrollInfo.position > 5 ? 'white' : this.startColor
  }

  get drawerOpen() {
    return this.$vuex.core.drawerOpen
  }

  get links() {
    return this.$vuex.core.links
  }

  get tabs() {
    return this.$vuex.core.tabs
  }

  async created() {
    await this.$vuex.core.initialize()
    this.onResize()
  }

  onClick(e: MouseEvent, link: any) {
    e.stopPropagation()
    if (link.to || !link.href) return
    this.$vuetify.goTo(link.href)
  }

  onResize() {
    const width = this.$isServer ? 0 : window.innerWidth
    this.maxWidth =
      width > 1904
        ? '1785px'
        : width > 1264
        ? '1185px'
        : width > 960
        ? '900px'
        : '100%'
    this.height = (this.$refs.toolbar as Element)?.clientHeight || 0
    this.$vuex.core.SET_VIEWPORT_RESET(
      (this.$refs.positioning as Element)?.clientHeight || 0
    )
    this.$forceUpdate()
  }

  toggleDrawer(state?: boolean) {
    return this.$vuex.core.TOGGLE_DRAWER(state)
  }
}
</script>

<template>
  <base-container>
    <div
      ref="positioning"
      class="positioning"
      :style="{ height: offsetHeight, minHeight: offsetHeight }"
    />
    <div ref="toolbar" class="toolbar-container">
      <v-app-bar
        :fixed="fixed"
        :flat="!fixed"
        :color="color"
        :width="maxWidth"
        :style="{
          marginRight: 'auto',
          marginLeft: 'auto',
          transition: 'width .2s'
        }"
      >
        <v-app-bar-nav-icon class="hidden-md-and-up" @click="toggleDrawer">
          <hamburger-icon :open="drawerOpen" />
        </v-app-bar-nav-icon>
        <v-container ref="firstRow" mx-auto py-0>
          <v-row class="hidden-md-and-up">
            <v-spacer />
            <v-img
              :src="require('@/assets/logo.png')"
              contain
              height="48"
              width="48"
              max-width="48"
              @click="$vuetify.goTo(0)"
            />
          </v-row>
          <v-row align="center" class="hidden-sm-and-down">
            <v-img
              :src="require('@/assets/logo.png')"
              class="mr-5"
              contain
              height="48"
              width="48"
              max-width="48"
              @click="$vuetify.goTo(0)"
            />
            <v-btn
              v-for="(link, i) in links"
              :key="i"
              :to="link.to"
              :color="color === 'transparent' ? 'white' : 'black'"
              class="ml-0 hidden-sm-and-down"
              text
              @click="onClick($event, link)"
            >
              {{ link.text }}
            </v-btn>
            <v-spacer />
            <v-text-field
              :color="color === 'transparent' ? 'white' : 'black'"
              :dark="color === 'transparent'"
              append-icon="mdi-magnify"
              text
              hide-details
              style="max-width: 300px;"
            />
          </v-row>
        </v-container>
        <template v-if="tabs.length" #extension>
          <v-tabs centered grow flat>
            <v-tab
              v-for="({ text }, key) in tabs"
              :key="key"
              class="tab text-xs-subtitle-2"
              >{{ text }}</v-tab
            >
          </v-tabs>
        </template>
      </v-app-bar>
    </div>
  </base-container>
</template>

<style lang="scss" scoped>
.positioning {
  width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
}

.toolbar-container {
  width: 100%;
  padding: 0;
}
</style>
