<script lang="ts">
import Vue from 'vue'
import { Component, Mixins } from 'vue-property-decorator'
import { Recipe } from '../../store/recipes'
import { Tab } from '../../store/core'
import { FrontMatter } from '../../store'
import Resize from '@/components/mixins/Resize'
import RecipeDescription from '@/components/recipe/RecipeDescription.vue'
import IngredientsList from '@/components/recipe/IngredientsList.vue'
import InstructionsList from '@/components/recipe/InstructionsList.vue'

const tabs: Tab[] = [
  { text: 'Info', component: RecipeDescription as typeof Vue },
  { text: 'Stuff', component: IngredientsList as typeof Vue },
  { text: 'Steps', component: InstructionsList as typeof Vue }
]

@Component({
  layout: 'card',
  components: {
    RecipeDescription,
    IngredientsList,
    InstructionsList
  },
  data: () => ({
    recipe: {}
  }),
  async created(this: RecipeDetailView) {
    const slug = this.$route.params.slug
    const recipe: FrontMatter<Recipe> = await import(
      `@/assets/content/recipes/${slug}.md`
    )
    this.description = recipe.vue.component
    this.$vuex.recipes.SET_ACTIVE_RECIPE({
      slug,
      ...recipe.attributes
    })
    this.$vuex.core.SET_TABS(tabs)
    this.$vuex.core.SET_ACTIVE_TAB(0)
  }
})
export default class RecipeDetailView extends Mixins(Resize) {
  private description?: InstanceType<typeof Vue>

  get showTabs() {
    return this.$vuex.core.tabs.length && this.$vuetify.breakpoint.smAndDown
  }

  get activeTab() {
    return this.$vuex.core.activeTab
  }

  get activeComponent() {
    return tabs[this.activeTab].component
  }
}
</script>

<template>
  <div>
    <v-container v-if="showTabs" class="container" pt-0 pb-1 pl-4 pr-4>
      <component :is="activeComponent" />
    </v-container>
    <v-container v-if="!showTabs" class="container" pt-0 pb-1 pl-4 pr-4>
      <ingredients-list />
      <instructions-list />
    </v-container>
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
