<template>
  <div class="flex items-center border border-gray-300 rounded-lg focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500 transition-all bg-white">
    <component 
      :is="icon" 
      class="w-4 h-4 text-gray-400 ml-3" 
      v-if="icon"
    />
    <input
      :value="modelValue"
      @input="(e) => $emit('update:modelValue', (e.target as HTMLInputElement)?.value ?? '')"
      v-bind="$attrs"
      class="w-full px-3 py-2 border-0 focus:ring-0 rounded-lg text-gray-700"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    icon: {
      type: Object,
      default: null
    }
  },
  emits: ['update:modelValue']
});
</script> 