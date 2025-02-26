<template>
  <div class="pagination">
    <button 
      v-for="page in totalPages" 
      :key="page"
      :class="{ active: page === currentPage }"
      data-test="page-button"
      @click="$emit('page-change', page)"
    >
      {{ page }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    totalItems: Number,
    itemsPerPage: Number,
    currentPage: Number
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage)
    }
  }
}
</script> 