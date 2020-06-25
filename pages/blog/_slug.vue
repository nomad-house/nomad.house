<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Post, Author, Category } from '../../store/blog'

@Component({
  layout: 'card',
  async asyncData({ params }): Promise<Post> {
    const post: Post = await import(
      `@/assets/content/posts/${params.slug}.json`
    )
    return post
  }
})
export default class BlogPost extends Vue implements Post {
  readonly title!: string
  readonly subtitle!: string
  readonly hero!: string
  readonly author!: Author
  readonly category?: Category[]
  readonly prominent?: boolean
  readonly published!: Date
  readonly updated?: Date
  readonly body!: InstanceType<typeof Vue>
}
</script>

<template>
  <div class="feed-container">
    <v-container pt-0 pb-0 pl-4 pr-4> Recipe goes here</v-container>
  </div>
</template>

<style lang="scss" scoped>
.feed-container {
  background-color: gray;
}
</style>
