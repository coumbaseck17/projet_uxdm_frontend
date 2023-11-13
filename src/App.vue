<template>
  <div>
    <h1>Popularity</h1>
    <BarChartVue>
    </BarChartVue>

  </div>
</template>

<script>
import BarChartVue from "@/components/bar-chart/BarChartV1.vue";
import BarChartV1Details from "@/components/bar-chart/BarChartV1Details.vue";

export default {
  name: 'App',
  components: {
    BarChartVue,
    // eslint-disable-next-line vue/no-unused-components
    BarChartV1Details,
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
