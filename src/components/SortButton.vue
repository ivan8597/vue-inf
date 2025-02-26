<template>
  <button @click="toggleSort">
    <span>{{ field }}</span>
    <span :class="['sort-icon', `sort-icon-${direction}`]"></span>
  </button>
</template>

<script>
export default {
  props: {
    field: String,
    direction: String
  },
  methods: {
    toggleSort() {
      const newDirection = this.direction === 'asc' ? 'desc' : 'asc'
      this.$emit('sort', { field: this.field, direction: newDirection })
    }
  }
}
</script> 