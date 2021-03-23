<template>
<pre>{{ countyData }}</pre>
<button @click="fetchCountyData">click</button>
<pre>{{ countyId }}</pre>
<button @click="fetchCountyId">click</button>
</template>

<script>
import store from './store/index.js'

export default {
  name: 'App',
  components: {
  },
  computed: {
    countyData(){
      return store.state.countyData
    },
    countyId(){
      return store.state.countyId
    }
  },
  methods: {
    fetchCountyData(){
      store.dispatch('fetchCountyData')
    },
    fetchCountyId(){
      store.dispatch('fetchCountyId')
    }
  },
}
</script>