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
  private heroHeight = '30vh'
  private resetHeight = 0

  created() {
    this.$on('scroll', (scrollInfo: ScrollInfo) => {
      this.scrollInfo = scrollInfo
      this.$emit('scroll', scrollInfo)
    })
  }

  mouted() {
    this.resetHeight = (this.$refs.hero as Element).clientHeight
  }

  beforeDestroy() {
    this.$off('scroll')
  }

  onScroll(scrollInfo: ScrollInfo) {
    this.scrollInfo = scrollInfo
  }
}
</script>

<template>
  <v-app :style="{ position: 'relative', minHeight: '100vh' }">
    <base-drawer />
    <div
      ref="hero"
      class="hero-container"
      :style="{
        height: heroHeight,
        backgroundImage: 'url(' + require('@/static/media/blurcamera.jpg') + ')'
      }"
    >
      <hero-banner :scroll-info="scrollInfo" />
    </div>
    <base-toolbar
      start-color="white"
      :scroll-info="scrollInfo"
      :height="toolbarHeight"
      :hero-height="heroHeight"
      :style="{ zIndex: 20 }"
      class="relative"
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
.hero-container {
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
