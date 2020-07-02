<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class InstructionsList extends Vue {}
</script>

<template>
  <v-timeline align-top dense>
    <v-timeline-item
      v-for="(step, index) of $vuex.recipes.activeRecipe.instructions"
      :key="`${index + 1}`"
      fill-dot
    >
      <template :slot="'icon'">{{ index + 1 }}</template>
      <v-card class="elevation 2">
        <v-card-text>
          {{ step }}
        </v-card-text>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>
