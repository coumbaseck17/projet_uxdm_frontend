<template>
  <TreemapV1/>
</template>

<script>
import TreemapV1 from '@/components/TreemapDir/TreeMap.vue'

export default {
  name: 'App',
  components: {
    TreemapV1
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  display: flex;
}
</style>
