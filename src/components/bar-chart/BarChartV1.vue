<template>
  <div class="chart-container">
    <div>
      <div class="bar-chart" ref="detailsContainer" >
        <!-- Bar chart initial -->
        <svg ref="mainChart"></svg>
        </div>
      </div>
    <BarChartV1Details  v-if="showDetails"
                       :detailData="detailData" ></BarChartV1Details>
  </div>
</template>

<script src="./BarChartV1.js">
import BarChartV1Details from "@/components/bar-chart/BarChartV1Details.vue";

export default {
  name: 'BarChart',
  components: {BarChartV1Details},
};
</script>

<style scoped>
.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
}

.bar-buttons {
  display: flex;
  justify-content: space-between;
  color: #2c3e50;
}

</style>
