<template>
  <div class="search-bar">
    <input 
      type="text" 
      v-model="searchText"
      @input="onInput"
      placeholder="Поиск..."
    />
    <button 
      v-if="searchText" 
      data-test="clear-button"
      @click="clearSearch"
    >
      Очистить
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchText: ''
    }
  },
  methods: {
    onInput() {
      this.$emit('search', this.searchText)
    },
    clearSearch() {
      this.searchText = ''
      this.$emit('search', '')
    }
  }
}
</script> 