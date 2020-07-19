<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({})
export default class RecipeDescription extends Vue {
  @Prop() description?: InstanceType<typeof Vue>

  get recipe() {
    return this.$vuex.recipes.activeRecipe
  }

  get tags() {
    return this.recipe.tags?.join(', ') || []
  }
}
</script>

<template>
  <div>
    <h1>{{ recipe.title }}</h1>
    <h2 v-if="recipe.subtitle">{{ recipe.subtitle }}</h2>
    <v-row>
      <v-col> Published: {{ recipe.published }} </v-col>
      <v-col v-if="recipe.updated"> Updated: {{ recipe.updated }} </v-col>
    </v-row>
    <v-row>
      <v-col> Author: {{ recipe.author }} </v-col>
      <v-col v-if="tags.length"> Tags: {{ tags }} </v-col>
    </v-row>
    <component
      :is="description"
      v-if="!!description"
      class="markdown-recipe-description"
    />
  </div>
</template>

<style lang="scss">
.markdown-recipe-description h2 {
  color: green;
}

.markdown-recipe-description h3 {
  color: green;
}

.markdown-recipe-description p {
  color: green;
}
.special {
  color: red;
}
</style>
