<template>
    <input
      v-show="$route.path.indexOf('/posts') === 0"
      type="text"
      class="search-input"
      id="search_input"
      placeholder="搜索文档"
    >
  </template>
  
  <script>
  import 'docsearch.js/dist/cdn/docsearch.min.css'
  import docsearch from 'docsearch.js'
  
  export default {
    mounted () {
      docsearch({
        apiKey: '599cec31baffa4868cae4e79f180729b',
        indexName: 'docsearch',
        inputSelector: '#search_input',
        algoliaOptions: { 'facetFilters': ['version:v2_0'] },
        debug: false // Set debug to true if you want to inspect the dropdown
      })
    }
  }
  </script>