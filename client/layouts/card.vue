<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import {
  ScrollInfo,
  Positioning,
  defaultScrollInfo
} from '@/components/mixins/Positioning'

@Component({
  components: {
    HeroBanner: () => import('@/components/HeroBanner.vue')
  }
})
export default class Layout extends Mixins(Positioning) {
  private toolbarHeight = '72px'
  private scrollInfo: ScrollInfo = defaultScrollInfo
  private heroHeight = '50vh'
  private resetHeight = 0

  private get isHero() {
    return this.$vuex.core.isHero
  }

  private get backgroundImage() {
    if (this.isHero && this.$vuex.core.hero.img) {
      const hero = this.$vuex.core.hero.img
      const img = hero.includes('/') ? hero.split('/').pop() : hero
      return (
        'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/media/' +
        img +
        ')'
      )
    }
  }

  created() {
    this.$on('scroll', (scrollInfo: ScrollInfo) => {
      this.scrollInfo = scrollInfo
    })
  }

  mouted() {
    this.resetHeight = (this.$refs.hero as Element).clientHeight
  }

  beforeDestroy() {
    this.$off('scroll')
  }

  private onScroll(scrollInfo: ScrollInfo) {
    this.scrollInfo = scrollInfo
  }
}
</script>

<template>
  <v-app :style="{ position: 'relative', minHeight: '100vh' }">
    <base-drawer class="drawer" />
    <div
      v-if="isHero"
      ref="hero"
      class="hero-content"
      :style="{
        height: heroHeight,
        backgroundImage
      }"
    >
      <v-row class="fill-height pa-3" align="center">
        <v-col cols="12" md="7" offset-md="5">
          <h1 class="display-3 font-weight-light">
            {{ $vuex.core.hero.heading }}
          </h1>

          <h2 class="subheading text-uppercase pl-2 mb-4">
            {{ $vuex.core.hero.subHeading }}
          </h2>
        </v-col>
      </v-row>
    </div>
    <base-toolbar
      start-color="white"
      :scroll-info="scrollInfo"
      :height="toolbarHeight"
      :hero-height="heroHeight"
      class="relative toolbar"
    />
    <base-container class="relative" :style="{ zIndex: 10 }">
      <nuxt :reset-height="resetHeight" />
    </base-container>
    <base-footer />
  </v-app>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
}
</style>

<style lang="scss" scoped>
.relative {
  position: relative;
}
.toolbar {
  z-index: 20;
}
.drawer {
  z-index: 30;
}
.hero-content {
  position: fixed;
  z-index: 0;
  width: 100%;
  color: white;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
}
</style>
