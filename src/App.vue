<template>
  <div>
    <h1>Popularity</h1>
    <BarChartV1></BarChartV1>
  </div>
</template>

<script>
import BarChartV1 from "@/components/bar-chart/BarChartV1.vue";

export default {
  name: 'App',
  components: {
    BarChartV1
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
