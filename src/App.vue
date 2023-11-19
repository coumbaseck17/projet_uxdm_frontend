<template>
  <div>
    <Sunburst/>

  </div>
</template>

<script>
import Sunburst from "@/components/sunburst-chart/SunburstChart.vue";
export default {
  name: 'App',
  components: {
    Sunburst
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
}
</style>
