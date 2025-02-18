<template>
  <div class="col-span-2 mt-4">
    <h3 class="text-sm font-medium text-gray-700 mb-3">{{ title }}</h3>
    <div class="grid grid-cols-2 gap-4">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true
    }
  }
});
</script> 