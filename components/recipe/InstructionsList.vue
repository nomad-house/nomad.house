<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({})
export default class InstructionsList extends Vue {
  @Prop({ required: true }) instructions!: string[]
}
</script>

<template>
  <v-timeline align-top dense>
    <v-timeline-item
      v-for="(step, index) of instructions"
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
