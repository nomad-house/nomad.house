<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import {
  ScrollInfo,
  Positioning,
  defaultScrollInfo
} from '@/components/mixins/Positioning'
@Component({})
export default class Layout extends Mixins(Positioning) {
  @Prop({ default: '100vh', required: false }) heroHeight!: string
  @Prop({ default: 0, required: false }) resetHeight!: number
  @Prop({ default: 'transparent', required: false }) toolbarStartColor!: string

  private scrollInfo: ScrollInfo = defaultScrollInfo
  private height = '72px'

  created() {
    this.$on('scroll', (scrollInfo: ScrollInfo) => {
      this.scrollInfo = scrollInfo
      this.$emit('scroll', scrollInfo)
    })
  }

  beforeDestroy() {
    this.$off('scroll')
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
      :start-color="toolbarStartColor"
      :scroll-info="scrollInfo"
      :height="height"
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
