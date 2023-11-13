<template>
    <!-- Utilisez les props au lieu de $refs -->
    <div class="bar-chart-details" >
    </div>

</template>

<script>
import * as d3 from "d3";

export default {
  name: "BarChartV1Details",
  props: ['detailData'],
  watch: {
    detailData: {
      handler: 'updateChart',
      immediate: true,
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.updateChart(this.detailData);
    });
  },

  methods: {
    updateChart(newData) {
      // Mettez à jour le graphique de détail avec les nouvelles données
      this.createDetailChart(newData);
    },
    createDetailChart(data) {
      const width = 400;
      const height = 200;

      // Sélectionnez le conteneur du graphique de détail
      const svg = d3.select('.bar-chart-detail')
          .attr('width', width)
          .attr('height', height);

      // Utilisez les données pour créer le graphique de détail
      // Exemple avec des barres verticales
      svg.selectAll('rect')
          .data(data)
          .enter()
          .append('rect')
          .attr('x', (d, i) => i * (width / data.length))
          .attr('y', d => height - d)
          .attr('width', width / data.length - 2)
          .attr('height', d => d)
          .attr('fill', 'steelblue');
    },
  },

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
