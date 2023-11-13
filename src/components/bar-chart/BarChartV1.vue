<template>
  <div class="chart-container">
    <div>
      <div class="bar-chart" ref="detailsContainer" >
        <!-- Bar chart initial -->
        <svg ref="mainChart"></svg>
        </div>
      </div>
    <BarChartV1Details  v-if="showDetails"
                       :detailData="detailData" >
    </BarChartV1Details>
  </div>
</template>

<script>
import BarChartV1Details from "@/components/bar-chart/BarChartV1Details.vue";
import axios from "axios";
import * as d3 from "d3";

export default {
  name: 'BarChart',
  components: {BarChartV1Details},

  data() {
    return {
      data: null,
      genres : null,
      showDetails: false,
      detailData: null,
    };
  },

  async mounted() {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/statistiques');
      this.data = response.data;
      this.drawChart();
    } catch (error) {
      console.error('Erreur lors de la récupération des données de l\'API : ', error);
    }

  },

  methods: {
    async drawChart() {
      if (!this.data || !this.data.genres) {
        return;
      }

      const width = 600;
      const height = 400;
      const margin = { top: 20, right: 20, bottom: 30, left: 60 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      // Triez les genres en fonction du nombre d'artistes total de manière décroissante
      this.genres = Object.keys(this.data.genres).sort((a, b) => {
        return this.data.genres[b].details.nombre_artists_total - this.data.genres[a].details.nombre_artists_total;
      });

      const svg = d3.select('.bar-chart').append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', `translate(${margin.left}, ${margin.top})`);

      // Créer une échelle de couleurs ordinales en bleu
      const colorScale = d3.scaleOrdinal(d3.schemeYlOrBr[this.genres.length].reverse());

      // Create the scales
      const xScale = d3.scaleLinear()
          .domain([0, d3.max(this.genres, (genre) => this.data.genres[genre].details.nombre_artists_total)])
          .range([0, innerWidth]);

      const yScale = d3.scaleBand()
          .domain(this.genres)
          .range([0, innerHeight])
          .padding(0.1);

      // Create the axes
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      // Append the axes to the SVG
      svg.append('g')
          .attr('transform', `translate(0, ${innerHeight})`)
          .call(xAxis);

      svg.append('g')
          .call(yAxis);


      // Append the bars
      svg.selectAll('rect')
          .data(this.genres)
          .enter()
          .append('rect')
          .attr('x', 0)
          .attr('y', (genre) => yScale(genre))
          .attr('width', (genre) => xScale(this.data.genres[genre].details.nombre_artists_total))
          .attr('height', yScale.bandwidth())
          .attr('fill', (genre) => colorScale(genre))
          .on('mouseover', function (genre) {
            // Change the color of the bar , empty => black
            d3.select(this).attr('fill', '');

            // Créez le graphique en lollipop détaillé
            const lollipopChart = d3.select('.bar-chart').append('svg')
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top + height})`);

            // Ajoutez des échelles pour les axes Y et X
            const lollipopYScale = d3.scaleLinear()
                .domain([0, this.data.genres[genre].details.nombre_artists_total])
                .range([0, -height + margin.top + margin.bottom]);

            const lollipopXScale = d3.scaleLinear()
                .domain([0, this.data.genres[genre].details.nombre_artists_total])
                .range([0, innerWidth]);

            // Ajoutez l'axe Y
            lollipopChart.append('g')
                .attr('transform', 'translate(0, 0)')
                .call(d3.axisLeft(lollipopYScale));

            // Ajoutez l'axe X
            lollipopChart.append('g')
                .attr('transform', `translate(0, ${-margin.top})`)
                .call(d3.axisBottom(lollipopXScale));

            lollipopChart.append('circle')
                .attr('cx', lollipopXScale(this.data.genres[genre].details.nombre_artists_total) / 2)
                .attr('cy', lollipopYScale(this.data.genres[genre].details.nombre_artists_total))
                .attr('r', 5)
                .attr('fill', 'red');

            lollipopChart.append('line')
                .attr('x1', lollipopXScale(this.data.genres[genre].details.nombre_artists_total) / 2)
                .attr('y1', lollipopYScale(this.data.genres[genre].details.nombre_artists_total))
                .attr('x2', lollipopXScale(this.data.genres[genre].details.nombre_artists_total) / 2)
                .attr('y2', 0)
                .attr('stroke', 'red');


            // Affichez le graphique en lollipop détaillé
            lollipopChart.style('display', 'block');


          })
          .on('mouseout', function () {
            // Reset the color of the bar after hover
            d3.select(this).attr('fill', (genre) => colorScale(genre));

            // Supprimez le graphique en lollipop détaillé
            d3.selectAll('.lollipop-chart').remove();

          });

      // Append the labels
      svg.selectAll('text')
          .data(this.genres)
          .enter()
          .append('text')
          .text((genre) => `${genre} - ${this.data.genres[genre].details.nombre_artists_total}`)
          .attr('x', (genre) => xScale(this.data.genres[genre].details.nombre_artists_total) + 5)
          .attr('y', (genre) => yScale(genre) + yScale.bandwidth() / 2)
          .attr('dy', '.35em')
          .style('font-size', '20px')
          .style('fill', 'black')
          .style('text-anchor', 'start');

    },

  },
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
