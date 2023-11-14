<template>
  <div>
    <!-- Filter radio box -->

    <!-- Dessiner le graphique principal avec d3.js -->
    <div class="pictogram-chart"></div>

    <!-- Genre details -->
    <GenreDetailsComponent :genre-details="currentGenreDetails"></GenreDetailsComponent>
    <router-link :to="{ name: 'subgenre-chart',params : {genre:'Country'} }">
      <button>Country</button>
    </router-link>
  </div>
</template>

<script>
import * as d3 from 'd3';

import pic1000000 from "@/data/pic100000.png";
import pic100000 from "@/data/pic100000.png";
import pic10000 from "@/data/pic10000.png";
import pic1000 from "@/data/pic1000.png";
import pic100 from "@/data/pic100.png";
import pic10 from "@/data/pic10.png";
import pic1 from "@/data/pic1.png";
import GenreDetailsComponent from './GenreDetailsComponent.vue';

import axios from "axios"; // Assurez-vous que le chemin est correct

export default {
  data() {
    return {
      data: null,
      marges: {haut: 40, droit: 20, bas: 30, gauche: 60},
      largeurTotale: 900,
      hauteurTotale: 600,
      innerWidth: 0,
      innerHeight: 0,
      currentGenre: null,
      currentGenreDetails: null,
      subgenre :'',
      selectedFilter:'all',
      labelLegend: 'artistes',
      legend: [
        { label: '1000000+', icon: pic1000000, value: '1000000+'},
        { label: '100000', icon: pic100000, value: '100000' },
        { label: '10000', icon: pic10000, value: '10000' },
        { label: '1000', icon: pic1000, value: '1000' },
        { label: '100', icon: pic100, value: '100' },
        { label: '10', icon: pic10, value: '10' },
        { label: '1', icon: pic1, value: '1' },
      ],
      selectedArtist: null
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
  components: {
    GenreDetailsComponent

    // Autres composants si nécessaire
  },
  methods: {


      drawChart() {
        this.labelLegend = "artistes"
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
              this.showSubgenres();
              this.currentGenre=genre;
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

    showSubgenres() {
      // Vérifiez si un genre est sélectionné

      if (this.currentGenre) {

        d3.select('.pictogram-chart').selectAll('*').remove();

        // Faites quelque chose avec les sous-genres, peut-être un appel à une méthode pour les afficher
        this.$router.push(`/subgenre-chart/${this.currentGenre}`)
      } else {
        console.warn("Veuillez sélectionner un genre avant d'afficher les sous-genres.");
        // Ajoutez une logique pour informer l'utilisateur de sélectionner un genre
      }
    },
    showGenreDetails(genre) {
      // Logique pour afficher les détails du genre
      this.currentGenreDetails = this.data.genres[genre].details;

    },    hideGenreDetails() {
      // Logique pour masquer les détails du genre
      // Vous pouvez effacer les détails du genre de la classe 'genre-details' ou utiliser une autre méthode
      d3.select('.genre-details').html('');
    },


  },



  // ... autres options ...
};
</script>

<style scoped>
/* Styles spécifiques à ce composant */
</style>

