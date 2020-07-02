<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Recipe, Tag, Ingredient } from '../../store/recipes'
import { Author } from '../../store/core'
import { FrontMatter } from '../../store'
import RecipeDescription from '@/components/recipe/RecipeDescription.vue'
import IngredientsList from '@/components/recipe/IngredientsList.vue'
import InstructionsList from '@/components/recipe/InstructionsList.vue'

const tabs = {
  Description: RecipeDescription,
  Ingredients: IngredientsList,
  Instructions: InstructionsList
}
type Tab = keyof typeof tabs

@Component({
  layout: 'card',
  components: {
    RecipeDescription,
    IngredientsList,
    InstructionsList
  },
  data: (): Recipe => ({
    title: '',
    hero: '',
    author: {
      name: '',
      slug: ''
    },
    published: new Date(),
    description: '',
    ingredients: [],
    instructions: []
  }),
  async created(this: RecipeCard) {
    const recipe: FrontMatter<Recipe> = await import(
      `@/assets/content/recipes/${this.$route.params.slug}.md`
    )
    Object.assign(this, recipe.attributes)
  }
})
export default class RecipeCard extends Vue implements Recipe {
  tabs = new Map(Object.entries(tabs) as [Tab, typeof Vue][])
  activeTab: Tab = 'Description'
  title!: string
  subtitle?: string
  hero!: string
  author!: Author
  tags?: Tag[]
  published!: Date
  updated?: Date
  description?: string
  ingredients!: Ingredient[]
  instructions!: string[]

  get showTabs() {
    return this.$vuetify.breakpoint.smAndDown
  }
}
</script>

<template>
  <div>
    <!-- <v-container v-if="showTabs" class="container" pt-0 pb-1 pl-4 pr-4>
      <v-tabs centered grow flat>
        <v-tab
          v-for="([tab], key) in tabs"
          :key="key"
          class="tab text-xs-subtitle-2"
          >{{ tab }}</v-tab
        >
      </v-tabs>
      <v-tabs-items v-model="activeTab">
        <v-tab-item v-for="([, Component], key) in tabs" :key="key">
          <component
            :is="Component"
            :description="description"
            :ingredients="ingredients"
            :instructions="instructions"
          />
        </v-tab-item>
      </v-tabs-items>
    </v-container>
    <v-container v-if="!showTabs" class="container" pt-0 pb-1 pl-4 pr-4>
      <ingredients-list :ingredients="ingredients" />
      <instructions-list :instructions="instructions" />
    </v-container> -->
  </div>
</template>

<style lang="scss" scoped>
.container {
  background-color: white;
}
.tab {
  width: 33.33%;
  max-width: 33.33%;
}
</style>
