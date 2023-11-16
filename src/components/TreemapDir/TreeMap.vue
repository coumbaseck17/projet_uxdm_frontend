<template>
  <div>
    <div class="treemap-chart"></div>
  </div>
</template>

<script>
import * as d3 from 'd3';
export default {
  name: 'TreeMap',
  // the component's data
  data() {
    return {
      data: null,
      width: 600,
      height: 600,
      color: d3.scaleOrdinal(d3.schemeCategory10),
    };
  },

  async mounted() {
    try {
      const response = await fetch(
          "./data/details_v1/all_data_details.json"
      );
      this.data = await response.json();
      this.createTreemap();
    } catch (error) {
      console.error('Erreur lors de la récupération des données de l\'API : ', error);
    }
  },
  methods: {
    createTreemap() {
      if (!this.data || !this.data.genres) {
        return;
      }

      const hierarchy = {
        name: 'root',
        children: Object.keys(this.data.genres).map(genre => ({
          name: genre,
          children: Object.keys(this.data.genres[genre].subgenres).map(subgenre => ({
            name: subgenre,
            value: this.data.genres[genre].subgenres[subgenre].details.nombre_artists_total,
          })),
        })),
      };

      const treemap = d3.treemap()
          .size([this.width, this.height])
          .padding(1)
          .round(true);

      const root = d3.hierarchy(hierarchy)
          .sum(d => d.value)
          .sort((a, b) => b.value - a.value);

      treemap(root);

      const svg = d3.select('.treemap-chart')
          .append('svg')
          .attr('width', this.width)
          .attr('height', this.height);

      // Add rectangles for genres and subgenres
      const rectangles = svg.selectAll('rect')
          .data(root.descendants())
          .enter()
          .append('g')
          .attr('transform', d => `translate(${d.x0},${d.y0})`);

      rectangles
          .append('rect')
          .attr('width', d => d.x1 - d.x0)
          .attr('height', d => d.y1 - d.y0)
          .style('stroke', '#fff')
          .style('fill', d => this.color((d.children ? d : d.parent).data.name));

      // Add labels for genres and subgenres
      rectangles
          .append('text')
          .attr('x', 4)
          .attr('y', 14)
          .attr('fill', '#fff')
          .style('font-size', '12px')
          .text(d => d.data.name);

    },
  },
};
</script>

<style scoped>
.treemap-chart {
  text-align: center;
}

.treemap-chart svg {
  overflow: visible;
}

.treemap-chart rect {
  stroke: #fff;
  fill-opacity: 0.8;
  transition: fill-opacity 0.3s ease-in-out;
}

.treemap-chart rect:hover {
  fill-opacity: 1;
}
</style>