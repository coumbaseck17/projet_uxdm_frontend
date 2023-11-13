<template>
    <!-- Utilisez les props au lieu de $refs -->
    <div class="bar-chart-details" > <!-- Assurez-vous que les données sont disponibles -->
      {{ detailData }}
    </div>

</template>

<script src="./BarChartV1Details.js">
export default {
  name: "BarChartV1Details",
  props: ['detailData']
}
</script>

<style scoped>
.bar-chart-details {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
}

</style>
