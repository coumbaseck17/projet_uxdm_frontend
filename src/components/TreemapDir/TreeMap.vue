<template>
  <div class="chart-container">
    <div>
      <div class="treemap" ref="treemap"></div>
    </div>
    <div class="genre-details">
      <!-- Contenu des détails du genre -->
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';
//import * as file  from "@/data/details_v1/all_data_details.json"
export default {

  name: 'TreeMap',
  // the component's data
  data () {
    return {
      jsonData: null,
      rootNode: {},
      margin: {
        top: 20,
        right: 0,
        bottom: 0,
        left: 0
      },
      width: 960,
      height: 530,
      selected: null,
      color: {}
    }
  },

  mounted() {
    this.createTreemap();
    /**d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_dendrogram_full.json", function (error, data) {
     if (error) console.log(error)
     this.jsonData = data
     console.log(data)
     })*/


  },
  methods: {
    async createTreemap() {
      // Set up the dimensions of your SVG container
      const width = 800;
      const height = 600;

      // Create an SVG container
      const svg = d3.select(this.$refs.treemap)
          .attr('width', width)
          .attr('height', height);

      const response = await fetch(
          "./data/all_data_details.json"
      )

      const data = await response.json()
      console.log(data)
      //let filePath= "../../data/details_v1/all_data_details.json";
      const genresData = Object.entries(data.genres).map(([genre, details]) => ({
        genre,
        nombre_artists_total: details.nombre_artists_total
      }));

      console.log(genresData)

      // Create hierarchy based on the total number of artists
      const root = d3.hierarchy({ children: genresData })
          .sum(d => d.nombre_artists_total);

      console.log(root);
      // Then d3.treemap computes the position of each element of the hierarchy
      //const treemap = d3.treemap()
      //    .size([width, height])
      //    .padding(2);

      //treemap(root);

      const colorScale = d3.scaleSequential(d3.interpolateViridis)
          .domain([0,9]);

      // Create rectangles based on the treemap layout
      svg.selectAll('rect')
          .data(data.genres)
          .enter()
          .append('rect')
          .attr('x', (d) => d.x0)
          .attr('y', (d) => d.y0)
          .attr('width', (d) => d.x1 - d.x0)
          .attr('height', (d) => d.y1 - d.y0)
          .style('fill', (d, i) => colorScale(i));

      // Add text labels to the rectangles
      svg.selectAll('text')
          .data(data.genres)
          .enter()
          .append('text')
          .attr('x', (d) => d.x0 + 5)
          .attr('y', (d) => d.y0 + 15)
          .text((d) => d.data.name)
          .attr('fill', 'white');

    },
  },
};
</script>

<style scoped>
/* Vos styles CSS spécifiques au composant ici */
.chart-container {
  display: flex;
}

.treemap {
  /* Ajoutez des styles si nécessaire */
}

.genre-details {
  /* Ajoutez des styles si nécessaire */
}
</style>