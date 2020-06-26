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
    Object.assign(this, post.attributes)
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
  <v-container v-if="!!body" pt-0 pb-1 pl-4 pr-4>
    <component :is="body" />
  </v-container>
</template>
