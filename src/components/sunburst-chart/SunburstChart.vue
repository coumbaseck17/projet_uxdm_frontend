<template>
  <div>
    <div v-show="!showGenres" class="sunburst-chart"><div id="details-container" class="details-container"></div><div id="details-container" class="details-container"></div></div>
    <div v-show="showGenres" class="sunburst-chart-genres"><div id="details-container-genres" class="details-container-genres"></div><div id="details-container-genres" class="details-container-genres"></div></div>

  </div>

</template>


<script>
import * as d3 from 'd3';
import {filterArtists} from "@/data";

export default {
  data() {
    return {
      data: null,
      dataArtists: null,
      marges: {haut: 40, droit: 20, bas: 30, gauche: 60},
      largeurTotale: 1800,
      hauteurTotale: 1200,
      innerWidth: 0,
      innerHeight: 0,
      currentGenre: null,
      subgenre :'',
      selectedFilter:'all',
      labelLegend: 'artistes',
      selectedArtist: null,
      showGenres: false

//
      // Track the currently selected genre
    };
  },

  async mounted() {
    try {
      const response = await fetch("./data/details_v1/all_data_details.json");
      this.data = await response.json();
      this.drawChart();


    } catch (error) {
      console.error('Erreur lors de la récupération des données de l\'API : ', error);
    }
  },

  methods: {

    async drawChart() {
      // Clear previous sunburst chart genres
      d3.selectAll('svg').remove()

      this.labelLegend = 'artistes';

      if (!this.data || !this.data.genres) {
        return;
      }

      const hierarchy = {
        name: 'root',
        children: []
      };
      for (const genre of Object.keys(this.data.genres)) {
        const genreObj = {
          name: genre,
          children: []
        };
        const subgenres = this.data.genres[genre].subgenres;
        for (const subgenre of Object.keys(subgenres)) {
          const subgenreObj = {
            name: subgenre,
            value: subgenres[subgenre].details.nombre_artists_total,

          };


          genreObj.children.push(subgenreObj);
        }

        hierarchy.children.push(genreObj);
      }

      const width = 600;
      const height = 600;
      const radius = Math.min(width, height) / 2;

      const color = d3.scaleOrdinal().range([
        '#FFD700',
        '#FFEC8B',
        '#98FB98',
        '#ADE199',
        '#B0EDEF',
        '#DDA0DD',
        '#DB7093',
        '#FFA07A',
        '#FFC0CB',
        '#FFDEAD'

      ]);
      const partition = d3.partition().size([2 * Math.PI, radius]);

      const root = d3.hierarchy(hierarchy)
          .sum(d => d.value)
          .sort((a, b) => b.value - a.value);

      partition(root);

      const svg = d3.select('.sunburst-chart')
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', `translate(${width / 2},${height / 2})`);

      const arc = d3.arc()
          .startAngle(d => d.x0)
          .endAngle(d => d.x1)
          .innerRadius(d => d.y0)
          .outerRadius(d => d.y1);

      svg.selectAll('path')
          .data(root.descendants())
          .enter()
          .append('path')
          .attr('display', d => (d.depth ? null : 'none'))
          .attr('d', arc)
          .style('stroke', '#fff')
          .style('fill', d => color((d.children ? d : d.parent).data.name))
          .on('mouseover', (event, d) => {
            const genreName = d.data.name;
            const artistCount = d.value;

            const detailsContainer = document.getElementById('details-container');
            detailsContainer.innerHTML = `Genre: ${genreName}, Number of artists: ${artistCount}`;
            detailsContainer.style.left = `${event.pageX + 10}px`; // Offset pour éviter de cacher la souris
            detailsContainer.style.top = `${event.pageY + 10}px`; // Offset pour éviter de cacher la souris
            detailsContainer.style.display = 'block';
          })
          .on('mousemove', (event) => {
            const detailsContainer = document.getElementById('details-container');
            detailsContainer.style.left = `${event.pageX + 10}px`; // Offset pour éviter de cacher la souris
            detailsContainer.style.top = `${event.pageY + 10}px`; // Offset pour éviter de cacher la souris
          })
          .on('mouseout', () => {
            const detailsContainer = document.getElementById('details-container');
            detailsContainer.style.display = 'none';
          })
          .on('click', (event, d) => {
            if (d.depth === 1) { // Limiter l'action du clic à la première couche (profondeur 1)
              // Toggle visibility of the existing sunburst
              this.showGenres = true;

              if (d && d.data && d.data.name) {
                const genreColor = color(d.data.name);
                console.log(genreColor);
                this.drawChartGenre(d.data.name,genreColor); // Draw the chart for the clicked genre
              }
            }
          });

      svg.selectAll('.genre-label')
          .data(root.descendants().filter(d => d.depth === 1))
          .enter()
          .append('text')
          .attr('class', 'genre-label')
          .attr('transform', d => {
            const radius = Math.max(0, (d.y0 + d.y1) / 2);
            const angle = ((d.x0 + d.x1) / 2 * 180 / Math.PI) - 90;
            const x = radius * Math.cos(angle * Math.PI / 180);
            const y = radius * Math.sin(angle * Math.PI / 180);
            return `translate(${x},${y}) rotate(${angle})`;
          })
          .attr('dy', '0.35em')
          .text(d => d.data.name)
          .style('text-anchor', 'middle')
          .style('font-size', '12px')
          .style('fill', 'black')
          .style('pointer-events', 'none')
      ;

      svg.selectAll('.subgenre-label')
          .data(root.descendants().filter(d => d.depth === 2 && d.value >= 50))
          .enter()
          .append('text')
          .attr('class', 'subgenre-label')
          .attr('transform', d => {
            const radius = Math.max(0, (d.y0 + d.y1) / 2);
            const angle = ((d.x0 + d.x1) / 2 * 180 / Math.PI) - 90;
            const x = radius * Math.cos(angle * Math.PI / 180);
            const y = radius * Math.sin(angle * Math.PI / 180);
            return `translate(${x},${y}) rotate(${angle})`;
          })
          .attr('dy', '0.35em')
          .text(d => d.data.name)
          .style('text-anchor', 'middle')
          .style('font-size', '10px')
          .style('fill', 'black')
          .style('pointer-events', 'none');


    },

    async drawChartGenre(genreName,genreColor) {

      const color = d3.scaleOrdinal().range([`${genreColor}`]);
      if (!this.data || !this.data.genres || !this.data.genres[genreName]) {
        console.error(`Genre "${genreName}" not found in the data.`);
        return;
      }

      const hierarchy = {
        name: 'root',
        children: []
      };
        const genreObj = {
          name: genreName,
          children: []
        };
        const subgenres = this.data.genres[genreName].subgenres;
        for (const subgenre of Object.keys(subgenres)) {
          const subgenreObj = {
            name: subgenre,
            value: this.data.genres[genreName].subgenres[subgenre].details.nombre_artists_total,
            children: []
          };

          try {
            this.dataArtists =  await filterArtists(genreName, subgenre);

            Object.values(this.dataArtists).forEach((artist, index) => {
              subgenreObj.children.push({
                name: artist.name,
                value: artist.deezerFans,
                artistIndex: index // Garder une référence à l'indice de l'artiste
              });
            });
          }
          catch(error) {
            console.log( "error")
          }


          genreObj.children.push(subgenreObj);
        }

        hierarchy.children.push(genreObj);


      const width = 600;
      const height = 600;
      const radius = Math.min(width, height) / 2;

      const partition = d3.partition().size([2 * Math.PI, radius]);

      const root = d3.hierarchy(hierarchy)
          .sum(d => d.value)
          .sort((a, b) => b.value - a.value);

      partition(root);


      const svg = d3.select('.sunburst-chart-genres')
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', `translate(${width / 2},${height / 2})`);

      const arc = d3.arc()
          .startAngle(d => d.x0)
          .endAngle(d => d.x1)
          .innerRadius(d => d.y0)
          .outerRadius(d => d.y1);


      svg.selectAll('path')
          .data(root.descendants())
          .enter()
          .append('path')
          .attr('display', d => (d.depth ? null : 'none'))
          .attr('d', arc)
          .style('stroke', '#fff')
          .style('fill', d => color((d.children ? d : d.parent).data.name))
          .on('mouseover', (event, d) => {
            const genreName = d.data.name;
            const artistCount = d.value;

            const detailsContainer = document.getElementById('details-container-genres');
            detailsContainer.innerHTML = `${genreName}, Number of deezer fans: ${artistCount}`;
            detailsContainer.style.left = `${event.pageX + 10}px`; // Offset pour éviter de cacher la souris
            detailsContainer.style.top = `${event.pageY + 10}px`; // Offset pour éviter de cacher la souris
            detailsContainer.style.display = 'block';
          })
          .on('mousemove', (event) => {
            const detailsContainer = document.getElementById('details-container-genres');
            detailsContainer.style.left = `${event.pageX + 10}px`; // Offset pour éviter de cacher la souris
            detailsContainer.style.top = `${event.pageY + 10}px`; // Offset pour éviter de cacher la souris
          })
          .on('mouseout', () => {
            const detailsContainer = document.getElementById('details-container-genres');
            detailsContainer.style.display = 'none';
          })
          .on('click', (event, d) => {
            if (d.depth === 1) { // Limiter l'action du clic à la première couche (profondeur 1)
              // Toggle visibility of the existing sunburst
              const sunburstSVG = d3.select('.sunburst-chart-genres svg');
              const isHidden = sunburstSVG.style('display') === 'none';
              sunburstSVG.style('display', isHidden ? 'block' : 'none');
              this.showGenres = false;
              this.drawChart()
            }
          });

      svg.selectAll('.genre-label')
          .data(root.descendants().filter(d => d.depth === 1))
          .enter()
          .append('text')
          .attr('class', 'genre-label')
          .attr('transform', d => {
            const radius = Math.max(0, (d.y0 + d.y1) / 2);
            const angle = ((d.x0 + d.x1) / 2 * 180 / Math.PI) - 90;
            const x = radius * Math.cos(angle * Math.PI / 180);
            const y = radius * Math.sin(angle * Math.PI / 180);
            return `translate(${x},${y}) rotate(${angle})`;
          })
          .attr('dy', '0.35em')
          .text(d => d.data.name)
          .style('text-anchor', 'middle')
          .style('font-size', '12px')
          .style('fill', 'black')
          .style('pointer-events', 'none');
      svg.selectAll('.subgenre-label')
          .data(root.descendants().filter(d => d.depth === 2 && d.value >= 200000))
          .enter()
          .append('text')
          .attr('class', 'subgenre-label')
          .attr('transform', d => {
            const radius = Math.max(0, (d.y0 + d.y1) / 2);
            const angle = ((d.x0 + d.x1) / 2 * 180 / Math.PI) - 90;
            const x = radius * Math.cos(angle * Math.PI / 180);
            const y = radius * Math.sin(angle * Math.PI / 180);
            return `translate(${x},${y}) rotate(${angle})`;
          })
          .attr('dy', '0.35em')
          .text(d => d.data.name)
          .style('text-anchor', 'middle')
          .style('font-size', '10px')
          .style('fill', 'black')
          .style('pointer-events', 'none');
      svg.selectAll('.artist-label')
          .data(root.descendants().filter(d => d.depth === 3 && d.value >= 900000))
          .enter()
          .append('text')
          .attr('class', 'artist-label')
          .attr('transform', d => {
            const radius = Math.max(0, (d.y0 + d.y1) / 2);
            const angle = ((d.x0 + d.x1) / 2 * 180 / Math.PI) - 90;
            const x = radius * Math.cos(angle * Math.PI / 180);
            const y = radius * Math.sin(angle * Math.PI / 180);
            return `translate(${x},${y}) rotate(${angle})`;
          })
          .attr('dy', '0.35em')
          .text(d => {
            if (d.depth === 3) {
              const artist = d.data;
              return `${artist.name}`;
            }
            return null;
          })
          .style('text-anchor', 'middle')
          .style('font-size', '5px')
          .style('fill', 'black')
          .style('pointer-events', 'none');
    }
  },
};


</script>

<style scoped>


.axis path,
.axis line {
  fill: none;
  stroke: black;
  shape-rendering: crispEdges;
}

.axis text {
  font-family: 'Arial', sans-serif;
  font-size: 12px;
}

.filter-container label {
  margin-bottom: 5px;
}

.artists-container svg {
  width: 2500px; /* Définissez la largeur du contenu que vous souhaitez pouvoir faire défiler */
  overflow-x: auto; /* Activez le défilement horizontal si nécessaire */
}

.details-container,
.details-container-genres {
  position: absolute;
  display: none;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  z-index: 999;
}

</style>
