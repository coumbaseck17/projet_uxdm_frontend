<template>
  <div class="chart-container">
    <div>
      <div class="bar-chart"></div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import axios from 'axios';

export default {
  data() {
    return {
      data : null,
    };
  },

  async mounted() {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/statistiques');
      this.data =response.data;
      console.log(response.data['genres']['Blues'].details);
      this.drawChart()
    } catch (error) {
      console.error('Erreur lors de la récupération des données de l\'API : ', error);
    }
  },

  methods: {
    drawChart() {
      if (!this.data || !this.data.genres) {
        return;
      }

      const width = 600;
      const height = 400;
      const margin = { top: 20, right: 20, bottom: 30, left: 60 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      // Triez les genres en fonction du nombre d'artistes total de manière décroissante
      const genres = Object.keys(this.data.genres).sort((a, b) => {
        return this.data.genres[b].details.nombre_artists_total - this.data.genres[a].details.nombre_artists_total;
      });

      const svg = d3.select('.bar-chart').append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', `translate(${margin.left}, ${margin.top})`);

      // const genres = Object.keys(this.data.genres);

      // Créer une échelle de couleurs ordinales en bleu
      const colorScale = d3.scaleOrdinal(d3.schemeYlOrBr[genres.length].reverse());

      // Create the scales
      const xScale = d3.scaleLinear()
          .domain([0, d3.max(genres, (genre) => this.data.genres[genre].details.nombre_artists_total)])
          .range([0, innerWidth]);

      const yScale = d3.scaleBand()
          .domain(genres)
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
          .data(genres)
          .enter()
          .append('rect')
          .attr('x', 0)
          .attr('y', (genre) => yScale(genre))
          .attr('width', (genre) => xScale(this.data.genres[genre].details.nombre_artists_total))
          .attr('height', yScale.bandwidth())
          .attr('fill', (genre) => colorScale(genre));

      // Append the labels
      svg.selectAll('text')
          .data(genres)
          .enter()
          .append('text')
          .text((genre) => `${genre} - ${this.data.genres[genre].details.nombre_artists_total}`)
          .attr('x', (genre) => xScale(this.data.genres[genre].details.nombre_artists_total) + 5)
          .attr('y', (genre) => yScale(genre) + yScale.bandwidth() / 2)
          .attr('dy', '.35em')
          .style('font-size', '20px') // Ajustez la taille de la police ici
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
  height: 50vh; /* Ajustez la hauteur selon vos besoins */
}

.bar-chart {

}
</style>

