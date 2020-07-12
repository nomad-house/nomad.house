<script lang="ts">
import Vue from 'vue'
import { Component, Mixins } from 'vue-property-decorator'
import {
  WithContext,
  Recipe as RecipeSchema,
  HowToStep,
  HowToSection,
  HowToDirection
} from 'schema-dts'
import { Recipe, Duration, Ingredient, Instruction } from '../../store/recipes'
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
    description: undefined
  }),
  head(this: RecipeDetailView) {
    return {
      title: this.recipe.title,
      meta: [
        {
          name: 'description',
          hid: 'description',
          content: this.recipe.description || this.recipe.title
        }
      ],
      script: [
        { type: 'application/ld+json', json: this.structuredData as any }
      ]
    }
  },
  async created(this: RecipeDetailView) {
    const slug = this.$route.params.slug
    const recipe: FrontMatter<Recipe> = await import(
      `@/assets/content/recipes/${slug}.md`
    )
    this.description = {
      extends: recipe.vue.component
    }
    this.$vuex.recipes.SET_ACTIVE_RECIPE({
      slug,
      ...recipe.attributes
    })
    this.$vuex.core.SET_TABS(tabs)
    this.$vuex.core.SET_ACTIVE_TAB(0)
  }
})
export default class RecipeDetailView extends Mixins(Resize) {
  private description?: { extends: InstanceType<typeof Vue> }

  get showTabs() {
    return this.$vuex.core.tabs.length && this.$vuetify.breakpoint.smAndDown
  }

  get activeTab() {
    return this.$vuex.core.activeTab
  }

  get activeComponent() {
    return tabs[this.activeTab].component
  }

  get recipe() {
    return this.$vuex.recipes.activeRecipe
  }

  get structuredData() {
    if (!Object.keys(this.recipe)) {
      return
    }

    function buildTime({ hours, minutes }: Duration) {
      let time = 'PT'
      if (hours) time += `${hours}H`
      if (minutes) time += `${minutes}M`
      return time
    }

    function buildNutritionInfo(nutrition: NonNullable<Recipe['nutrition']>) {
      const info: RecipeSchema['nutrition'] = {
        '@type': 'NutritionInformation' as 'NutritionInformation'
      }

      Object.entries(nutrition)
        .map(([type, value]): [string, string] => {
          switch (type) {
            case 'calories':
              return [type, `${value} calories`]
            case 'servingSize':
              return [type, value as string]
            case 'sodiumContent':
            case 'cholesterolContent':
              return [
                type,
                `${value} milligram(s) ${type.replace('Content', '')}`
              ]
            default:
              return [
                type,
                `${value} gram(s) ${
                  type.includes('Fat')
                    ? type.replace('FatContent', ' fat')
                    : type.replace('Content', '')
                }`
              ]
          }
        })
        .reduce((arr, [type, value]) => (arr[type] = value), info as any)

      return info
    }

    function stringifyIngredient(ingredient: Ingredient) {
      const stringified: string[] = []
      const { quantities, mass, options, name, preparation } = ingredient
      for (const { quantity, label } of quantities) {
        if (quantity) stringified.push(`${quantity}`)
        if (label) stringified.push(` ${label}`)
      }
      if (mass) {
        stringified.push(` (${mass.quantity}${mass.label})`)
      }
      if (options) {
        stringified.push(` ${options}:`)
      }
      stringified.push(' ' + name)
      if (preparation) {
        stringified.push(`, ${preparation}`)
      }
      return stringified.join('')
    }

    function buildHowToStep(instruction: Instruction) {
      const direction: HowToDirection = {
        '@type': 'HowToDirection',
        position: 1,
        text: instruction.text
      }
      if (instruction.name) direction.name = instruction.name
      if (instruction.beforeImage) {
        direction.beforeMedia = {
          '@type': 'ImageObject',
          contentUrl: instruction.beforeImage
        }
      }
      if (instruction.afterImage) {
        direction.afterMedia = {
          '@type': 'ImageObject',
          contentUrl: instruction.afterImage
        }
      }
      const step: HowToStep = {
        '@type': 'HowToStep',
        itemListElement: [direction]
      }
      if (instruction.tip) {
        ;(step.itemListElement as any[]).push({
          '@type': 'HowToTip',
          position: 2,
          text: instruction.tip
        })
      }
      return step
    }

    const {
      title,
      author,
      images,
      published,
      updated,
      prepTime,
      cookTime,
      description,
      yield: _yield,
      tags,
      categories,
      cuisines,
      cookingMethods,
      suitableForDiet,
      nutrition,
      instructions = [],
      ingredients = [],
      subRecipes
    } = this.recipe

    const data: WithContext<RecipeSchema> = {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: title,
      author: {
        '@type': 'Person',
        name: author
      },
      image: images.map(({ image }) => image),
      datePublished: published.toISOString(),
      recipeInstructions: []
    }

    if (updated) data.dateModified = updated.toISOString()
    if (prepTime) data.prepTime = buildTime(prepTime)
    if (cookTime) data.cookTime = buildTime(cookTime)
    if (description) data.description = description
    if (_yield) data.recipeYield = `${_yield} servings`
    if (categories) data.recipeCategory = categories.join(', ')
    if (cuisines) data.recipeCuisine = cuisines.join(', ')
    if (cookingMethods) data.cookingMethod = cookingMethods.join(', ')
    if (tags) data.keywords = tags.join(', ')
    if (suitableForDiet)
      data.suitableForDiet = suitableForDiet
        .map((diet) => `http://schema.org/${diet}`)
        .join(', ') as RecipeSchema['suitableForDiet']
    if (nutrition) data.nutrition = buildNutritionInfo(nutrition)

    data.ingredients = ingredients.map(stringifyIngredient)

    if (subRecipes) {
      subRecipes.forEach(
        ({
          title: subRecipeTitle,
          ingredients: subIngredients,
          instructions: subInstructions
        }) => {
          if (subIngredients) {
            ;(data.ingredients as string[]).push(
              ...subIngredients.map(stringifyIngredient)
            )
          }
          if (subInstructions) {
            const step: HowToSection = {
              '@type': 'HowToSection',
              name: subRecipeTitle,
              itemListElement: []
            }
            subInstructions.forEach((instruction) => {
              ;(step.itemListElement as HowToStep[]).push(
                buildHowToStep(instruction)
              )
            })
          }
        }
      )
    }

    instructions.forEach((instruction) => {
      ;(data.recipeInstructions as HowToStep[]).push(
        buildHowToStep(instruction)
      )
    })

    return data
  }
}
</script>

<template>
  <div>
    <v-container v-if="showTabs" class="container" pt-0 pb-1 pl-4 pr-4>
      <component :is="activeComponent" :description="description" />
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
