<template>
  <div className="chart-container">
    <div>
      <div className="pictogram-chart"></div>
    </div>
    <div className="genre-details">
      <!-- Contenu des détails du genre -->
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import axios from 'axios';
import pic1000 from '@/data/pic1000.png';
import pic100 from '@/data/pic100.png';
import pic10 from '@/data/pic10.png';
import pic1 from '@/data/pic1.png';

export default {
  data() {
    return {
      data: null,
      marges: {haut: 20, droit: 20, bas: 30, gauche: 60},
      largeurTotale: 900,
      hauteurTotale: 400,
      innerWidth: 0,
      innerHeight: 0,
      currentGenre: null, // Track the currently selected genre
    };
  },

  async mounted() {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/statistiques');
      this.data = response.data;
      this.innerWidth = this.largeurTotale - this.marges.gauche - this.marges.droit;
      this.innerHeight = this.hauteurTotale - this.marges.haut - this.marges.bas;
      this.drawChart();
    } catch (error) {
      console.error('Erreur lors de la récupération des données de l\'API : ', error);
    }
  },

  methods: {
    drawChart() {
      if (!this.data || !this.data.genres) {
        return;
      }

      const genres = Object.keys(this.data.genres).sort((a, b) => {
        return this.data.genres[b].details.nombre_artists_total - this.data.genres[a].details.nombre_artists_total;
      });

      const svg = d3.select('.pictogram-chart').append('svg')
          .attr('width', this.largeurTotale)
          .attr('height', this.hauteurTotale);

      const yScale = d3.scaleBand()
          .domain(genres)
          .range([0, this.innerHeight])
          .padding(0.1);

      const yAxis = d3.axisLeft(yScale);

      svg.append('g')
          .attr('class', 'y axis')
          .call(yAxis).selectAll('.domain, .tick line')
          .style('stroke', 'transparent');

      const pictogramGroups = svg.selectAll('.pictogram')
          .data(genres)
          .enter()
          .append('g')
          .attr('class', 'pictogram')
          .attr('transform', (genre) => `translate(100, ${yScale(genre)})`)
          .on('click', (event, genre) => {
            this.showSubgenres(genre);
          })
          .on('mouseover', (event, genre) => {
            this.showGenreDetails(genre);
          })
          .on('mouseout', () => {
            this.hideGenreDetails();
          });

      pictogramGroups.selectAll('image')
          .data((genre) => {
            const count = this.data.genres[genre].details.nombre_artists_total;
            return [
              ...Array(Math.floor(count / 1000)).fill(pic1000),
              ...Array(Math.floor((count % 1000) / 100)).fill(pic100),
              ...Array(Math.floor((count % 100) / 10)).fill(pic10),
              ...Array(count % 10).fill(pic1),
            ];
          })
          .enter()
          .append('image')
          .attr('class', 'pictogram')
          .attr('x', (d, i) => i * 40)
          .attr('y', 0)
          .attr('width', 40)
          .attr('height', 40)
          .attr('xlink:href', (d) => d);

      svg.selectAll('.label')
          .data(genres)
          .enter()
          .append('text')
          .attr('class', 'label')
          .text((genre) => `${genre} `)
          .attr('x', 10)
          .attr('y', (genre) => yScale(genre) + yScale.bandwidth() / 2)
          .attr('dy', '.35em')
          .style('font-size', '14px')
          .style('fill', 'black')
          .style('text-anchor', 'start');
    },

    showSubgenres(genre) {
      // Update currentGenre to the selected genre
      this.currentGenre = genre;

      // Remove the existing chart
      d3.select('.pictogram-chart').selectAll('*').remove();

      // Draw the new chart for subgenres
      const subgenres = Object.keys(this.data.genres[genre].subgenres).sort((a, b) => {
        return this.data.genres[genre].subgenres[b].details.nombre_artists_total - this.data.genres[genre].subgenres[a].details.nombre_artists_total;
      });

      const svg = d3.select('.pictogram-chart').append('svg')
          .attr('width', this.largeurTotale)
          .attr('height', this.hauteurTotale);

      const yScale = d3.scaleBand()
          .domain(subgenres)
          .range([0, this.innerHeight])
          .padding(0.1);

      const yAxis = d3.axisLeft(yScale);

      svg.append('g')
          .attr('class', 'y axis')
          .call(yAxis).selectAll('.domain, .tick line')
          .style('stroke', 'transparent');

      const pictogramGroups = svg.selectAll('.pictogram')
          .data(subgenres)
          .enter()
          .append('g')
          .attr('class', 'pictogram')
          .attr('transform', (subgenre) => `translate(100, ${yScale(subgenre)})`)
          .on('mouseover', (event, subgenre) => {
            // Logique pour afficher les détails du subgenre
            this.showSubgenreDetails(subgenre);
          })
          .on('mouseout', () => {
            // Logique pour masquer les détails du subgenre
            this.hideSubgenreDetails();
          });

      pictogramGroups.selectAll('image')
          .data((subgenre) => {
            const count = this.data.genres[genre].subgenres[subgenre].details.nombre_artists_total;
            return [
              ...Array(Math.floor(count / 1000)).fill(pic1000),
              ...Array(Math.floor((count % 1000) / 100)).fill(pic100),
              ...Array(Math.floor((count % 100) / 10)).fill(pic10),
              ...Array(count % 10).fill(pic1),
            ];
          })
          .enter()
          .append('image')
          .attr('class', 'pictogram')
          .attr('x', (d, i) => i * 40)
          .attr('y', 0)
          .attr('width', 40)
          .attr('height', 40)
          .attr('xlink:href', (d) => d);

      svg.selectAll('.label')
          .data(subgenres)
          .enter()
          .append('text')
          .attr('class', 'label')
          .text((subgenre) => `${subgenre} `)
          .attr('x',0)
          .attr('y', (subgenre) => yScale(subgenre) + yScale.bandwidth() / 2)
          .attr('dy', '.35em')
          .style('font-size', '14px')
          .style('fill', 'black')
          .style('text-anchor', 'start');
    },

    showSubgenreDetails(subgenre) {
      // Logique pour afficher les détails du subgenre
      // Vous pouvez utiliser la classe 'genre-details' ou toute autre méthode pour afficher les détails
      // Mise à jour des détails du genre actuel
      const subgenreDetails = this.data.genres[this.currentGenre].subgenres[subgenre].details;




        // Logique pour afficher les détails du genre
        const detailsContainer = d3.select('.genre-details');
        detailsContainer.html(`<p>Nombre de groupe: ${subgenreDetails.nombre_groupes} / Actifs : ${subgenreDetails.nombre_actif_groupes}</p>
        <p>Nombre de solos: ${subgenreDetails.nombre_solos} / Actifs : ${subgenreDetails.nombre_actif_solos} </p>
        <p>Nombre autres: ${subgenreDetails.nombre_autres} / Actifs : ${subgenreDetails.nombre_actif_autres} </p>`);
      },



    hideSubgenreDetails() {
      // Logique pour masquer les détails du subgenre
      // Vous pouvez effacer les détails du subgenre de la classe 'genre-details' ou utiliser une autre méthode
      d3.select('.genre-details').html('');
    },

    showGenreDetails(genre) {
      // Logique pour afficher les détails du genre
      const detailsContainer = d3.select('.genre-details');
      detailsContainer.html(`<p>Nombre de groupe: ${this.data.genres[genre].details.nombre_groupes} / Actifs : ${this.data.genres[genre].details.nombre_actif_groupes}</p>
        <p>Nombre de solos: ${this.data.genres[genre].details.nombre_solos} / Actifs : ${this.data.genres[genre].details.nombre_actif_solos} </p>
        <p>Nombre autres: ${this.data.genres[genre].details.nombre_autres} / Actifs : ${this.data.genres[genre].details.nombre_actif_autres} </p>`);
    },


    hideGenreDetails() {
      // Logique pour masquer les détails du genre
      // Vous pouvez effacer les détails du genre de la classe 'genre-details' ou utiliser une autre méthode
      d3.select('.genre-details').html('');
    },
  },
};
</script>

<style scoped>
.chart-container {
  display: flex;
}

.pictogram-chart {
  margin-right: 20px;
}

.genre-details {
  font-size: 16px;
}

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

.label {
  font-size: 14px;
  fill: black;
  cursor: pointer;
}

.pictogram {
  cursor: pointer;
}

.pictogram:hover {
  filter: brightness(70%);
}
</style>
