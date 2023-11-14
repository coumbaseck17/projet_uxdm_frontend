<template>
  <div>
    <h2>Sous-genres du genre {{ currentGenre }}</h2>

    <!-- Bouton de retour à la page précédente -->
    <router-link :to="{ name: 'pictogram-chart' }">
      <button>Retour</button>
    </router-link>

    <div class="subgenre-chart"></div>

    <GenreDetailsComponent :genre-details="currentGenreDetails"></GenreDetailsComponent>

    <!-- Émettre un événement pour dessiner le graphique d'artistes -->
    <button @click="drawArtistChart">Dessiner le graphique d'artistes</button>
  </div>
</template>

<script>
import * as d3 from "d3";
import pic1000 from "@/data/pic1000.png";
import pic100 from "@/data/pic100.png";
import pic10 from "@/data/pic10.png";
import pic1 from "@/data/pic1.png";
import axios from "axios";

export default {
  props: ['genre'],

  data() {
    return {

      currentGenre: this.$route.params.genre,
      marges: {haut: 40, droit: 20, bas: 30, gauche: 60},
      largeurTotale: 900,
      hauteurTotale: 600,
      innerWidth: 0,
      innerHeight: 0,
    };
  },
  async mounted() {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/statistiques');
      this.data = response.data;
      this.innerWidth = this.largeurTotale - this.marges.gauche - this.marges.droit;
      this.innerHeight = this.hauteurTotale - this.marges.haut - this.marges.bas;
    this.drawArtistChart()
    } catch (error) {
      console.error('Erreur lors de la récupération des données de l\'API : ', error);
    }
  },
  methods: {
    drawArtistChart() {


      // Draw the new chart for subgenres
      const subgenres = Object.keys(this.data.genres[this.currentGenre].subgenres).sort((a, b) => {
        return this.data.genres[this.currentGenre].subgenres[b].details.nombre_artists_total - this.data.genres[this.currentGenre].subgenres[a].details.nombre_artists_total;
      });
      // Create a new SVG container for subgenres
      const svg = d3.select('.subgenre-chart').append('svg')
          .attr('width', this.largeurTotale)
          .attr('height', this.hauteurTotale);

      // Create a scale for the y-axis based on subgenres
      const yScale = d3.scaleBand()
          .domain(subgenres)
          .range([0, this.innerHeight])
          .padding(0.5);

      // Add the y-axis inside the container
      const yAxis = d3.axisLeft(yScale);
      svg.append('g')
          .attr('class', 'y axis')
          .call(yAxis).selectAll('.domain, .tick line')
          .style('stroke', 'transparent');

      // Create groups for each subgenre
      const subgenreGroups = svg.selectAll('.subgenre-group')
          .data(subgenres)
          .enter()
          .append('g')
          .attr('class', 'subgenre-group')
          .attr('transform', (subgenre) => `translate(150, ${yScale(subgenre)})`)
          .on('mouseover', (event, subgenre) => {
            this.showSubgenreDetails(subgenre);
          })
          .on('mouseout', () => {
            this.hideSubgenreDetails();
          })
          .on('click', (event, subgenre) => {
            this.subgenre = subgenre;
            this.showArtists(subgenre);
          });

      // Add pictograms for each subgenre
      subgenreGroups.selectAll('.pictogram')
          .data((subgenre) => {
            const count = this.data.genres[this.currentGenre].subgenres[subgenre].details.nombre_artists_total;
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
          .attr('y', -20) // Adjust the vertical position of pictograms
          .attr('width', 40)
          .attr('height', 40)
          .attr('xlink:href', d => d);

      // Add subgenre names as text labels
      subgenreGroups.append('text')
          .attr('class', 'label')
          .text(subgenre => subgenre)
          .attr('x', -125) // Adjust the horizontal position of subgenre names
          .attr('y', 0)
          .style('font-size', '14px')
          .style('fill', 'black')
          .style('text-anchor', 'start');
    },
    showSubgenreDetails(subgenre) {
      this.currentGenreDetails = this.data.genres[this.currentGenre].subgenres[subgenre].details;

    },

    hideSubgenreDetails() {
      d3.select('.genre-details').html('');
    },

  },
};
</script>

<style scoped>
/* Styles spécifiques à ce composant */
</style>
