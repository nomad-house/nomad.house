<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Ingredient } from '../../store/recipes'

@Component({})
export default class IngredientsList extends Vue {
  getAmount(ingredient: Ingredient): string {
    const amount: string[] = []
    const { quantities, mass } = ingredient
    for (const { quantity, label } of quantities) {
      if (quantity) amount.push(`${quantity}`)
      if (label) amount.push(` ${label}`)
    }
    if (mass) {
      amount.push(` (${mass.quantity}${mass.label})`)
    }
    return amount.join('')
  }

  getName(ingredient: Ingredient): string {
    const name: string[] = []
    if (ingredient.options) name.push(`${ingredient.options}: `)
    name.push(ingredient.name)
    if (ingredient.preparation) name.push(`, ${ingredient.preparation}`)
    return name.join('')
  }

  get recipe() {
    return this.$vuex.recipes.activeRecipe
  }

  get sortedList(): Ingredient[] {
    return [...this.recipe.ingredients].sort((a, b) => {
      if (a.options === 'optional' && b.options !== 'optional') return 1
      if (a.options !== 'optional' && b.options === 'optional') return -1
      return 0
    })
  }
}
</script>

<template>
  <v-simple-table>
    <template :slot="'default'">
      <thead class="container">
        <tr>
          <th class="amount text-left">Amount</th>
          <th class="name text-left">Name</th>
        </tr>
      </thead>
      <tbody class="container">
        <tr v-for="ingredient in sortedList" :key="ingredient.name">
          <td class="amount text-left">{{ getAmount(ingredient) }}</td>
          <td class="name text-left">{{ getName(ingredient) }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<style lang="scss" scoped>
// .container {
//   display: flex;
// }
</style>
