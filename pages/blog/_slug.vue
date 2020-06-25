<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Post, Author, Category } from '../../store/blog'
import { FrontMatter } from '../../store'

@Component({
  layout: 'card',
  data: () => ({
    title: '',
    author: {},
    category: [],
    hero: '',
    published: '',
    body: undefined
  }),
  async created(this: BlogPost) {
    const post: FrontMatter<Post> = await import(
      `@/assets/content/posts/${this.$route.params.slug}.md`
    )
    this.title = post.attributes.title
    this.subtitle = post.attributes.subtitle
    this.author = post.attributes.author
    this.category = post.attributes.category
    this.hero = post.attributes.hero
    this.published = post.attributes.published
    this.updated = post.attributes.updated
    this.prominent = post.attributes.prominent
    this.body = post.vue.component
  }
})
export default class BlogPost extends Vue implements Post {
  title!: string
  subtitle?: string
  author!: Author
  category!: Category[]
  hero!: string
  published!: Date
  updated?: Date
  prominent?: boolean
  body?: InstanceType<typeof Vue> = undefined
}
</script>

<template>
  <div class="feed-container">
    <v-container v-if="!!body" pt-0 pb-1 pl-4 pr-4>
      <component :is="body" />
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
.feed-container {
  background-color: gray;
}
</style>
