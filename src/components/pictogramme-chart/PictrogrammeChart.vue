<template>
  <div class="flex flex-col min-h-screen">




    <main class="flex flex-1">
      <button @click="drawChart" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" v-if="genreIsSelected & !subgenreIsSelected">
        Retour
      </button>
      <button @click="showSubgenres(currentGenre)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" v-if="subgenreIsSelected">
        Retour
      </button>
      <div class="flex flex-1">

        <div class="container filter-container shadow-left " v-if="currentSubgenre && subgenreIsSelected" >
          <h2 class="v">Filtres</h2>
          <label>
            <input type="radio"  name="filterGroup" v-model="selectedFilter" value="all" @change="applyFilter">  All
          </label>
          <p>GENDER</p>
          <label>
            <input type="radio"  name="filterGroup" v-model="selectedFilter" value="Female" @change="applyFilter">  Female
          </label>
          <label>
            <input type="radio"  name="filterGroup" v-model="selectedFilter" value="Male" @change="applyFilter">  Male
          </label>
          <p>TYPE</p>
          <label>
            <input type="radio"  name="filterGroup" v-model="selectedFilter" value="" @change="applyFilter">  Others
          </label>
          <label>
            <input type="radio"   name="filterGroup" v-model="selectedFilter" value="Group" @change="applyFilter">  Group
          </label>
          <label>
            <input type="radio"  name="filterGroup" v-model="selectedFilter" value="Person"  @change="applyFilter"> Person
          </label>
        </div>

        <div v-if=" !genreIsSelected && !subgenreIsSelected &!currentGenre" class="flex flex-1 container  shadow-left flex-col square-container ">
          <h2 text-white> Statistiques </h2>

          <div class="square">
            <div class="big-number"><b>{{ statistiques.totalArtiste }}</b></div>
            <div class="lines">
              <p>ARTISTES</p>
            </div>
          </div>
          <div class="square">
            <div class="big-number"><b>{{ statistiques.nbSolos }}</b></div>
            <div class="lines">
              <p>ARTISTES SOLOS</p>
            </div>
          </div>
          <div class="square">
            <div class="big-number"><b>{{ statistiques.nbGroupes }}</b></div>
            <div class="lines">
              <p>GROUPES</p>
              <p></p>
            </div>
          </div>
          <div class="square">
            <div class="big-number"><b>{{ statistiques.actifPourcentage }} %</b></div>
            <div class="lines">
              <p>ARTISTES ACTIFS</p>
            </div>
          </div>
        </div>
        <div  class="flex flex-1 container  shadow-left flex-col square-container" v-if="currentGenre && !currentSubgenre && !subgenreIsSelected">
          <h2> {{this.currentGenre}}</h2>
          <div class="square">
            <div class="big-number"><b>{{ statistiques.nbArtistesGenre }}</b></div>
            <div class="lines">
              <p>ARTISTES</p>
            </div>
          </div>
          <div class="square">
            <div class="big-number"><b>{{ statistiques.nbActifSolosGenre }}</b></div>
            <div class="lines">
              <p>ARTISTES</p>
              <p>SOLOS</p>
            </div>
          </div>
          <div class="square">
            <div class="big-number"><b>{{ statistiques.nbActifGroupesGenre }}</b></div>
            <div class="lines">
              <p>GROUPES</p>
              <p></p>
            </div>
          </div>
          <div class="square">
            <div class="big-number"><b>{{ statistiques.actifPourcentageGenre }} %</b></div>
            <div class="lines">
              <p>ARTISTES</p>
              <p>ACTIFS</p>
            </div>
          </div>
        </div>
        <div  class="flex flex-1 container  shadow-left flex-col square-container" v-if="genreIsSelected && currentSubgenre  && !subgenreIsSelected">
          <h2> {{this.currentGenre}}: {{this.currentSubgenre}}</h2>
          <div class="square">
            <div class="big-number"><b>{{ statistiques.nbArtistesSubgenre }}</b></div>
            <div class="lines">
              <p>ARTISTES</p>
            </div>
          </div>
          <div class="square">
            <div class="big-number"><b>{{ statistiques.nbActifSolosSubgenre }}</b></div>
            <div class="lines">
              <p>ARTISTES</p>
              <p>SOLOS</p>
            </div>
          </div>
          <div class="square"> <!-- Ajoutez des classes CSS pour les styles -->
            <div class="big-number"><b>{{ statistiques.nbActifGroupesSubgenre }}</b></div>
            <div class="lines">
              <p>GROUPES</p>
              <p></p>
            </div>
          </div>
          <div class="square"> <!-- Ajoutez des classes CSS pour les styles -->
            <div class="big-number"><b>{{ statistiques.actifPourcentageSubgenre }} %</b></div>
            <div class="lines">
              <p>ARTISTES</p>
              <p>ACTIFS</p>
            </div>
          </div>
        </div>


        <!-- Graphique au milieu -->
        <div class="flex flex-1 flex-col">


          <h2 class="text-2xl text-center mb-4">{{ graphTitle }}</h2>
          <div class="legend flex items-center justify-center mt-4 ">
            <div class="legend flex items-center justify-center mt-4 ">

                    <div v-for="(item, itemIndex) in legend" :key="itemIndex">
                      <img :src="item.icon" alt="Pictogram" class="legend-icon" />

                      <b v-html="formatLabel(item.label, item.value)" ></b>
                    </div>

            </div>


          </div>
          <div class="pictogram-chart" >
            <svg id="graphique" class="w-full h-full border border-gray-300 "></svg>
          </div>



          <!-- Placer la légende en dessous du graphique -->

        </div>
      </div>

      <div class="container details-container" v-if="selectedArtist">
        <div class="artist-details" >
          <!-- Photo de profil centrée -->
          <div class="centered">
            <img :src="selectedArtist.picture" alt="Artist" class="artist-image-small">
            <h2>{{ selectedArtist.name }}</h2>
          </div>
          <div class="artist-details-columns flex justify-between">
            <!-- Colonne de gauche pour les albums, genre, etc. -->
            <div class="details-column">
              <div class="detail-item">
                <p><b> {{ selectedArtist.deezerFans.toLocaleString() }}</b> FANS</p>
              </div>
              <div class="detail-item">
                <p><b>ACTIF : </b> {{ selectedArtist.lifeSpan.ended ? 'OUI' : 'NON' }}</p>
              </div>
              <!-- Assurez-vous que chaque élément a la même hauteur -->
              <div class="detail-item" v-if="selectedArtist.recordLabel.length>0">
                <p><b>Label:</b> {{ Array.from(selectedArtist.recordLabel.values()).join(', ') }}</p>
              </div>
              <div class="detail-item" v-if="selectedArtist.albums.length>0">
                <p><b>Albums:</b></p>
                <ul class="albums-list">
                  <li v-for="album in selectedArtist.albums" :key="album">{{ album }}</li>
                </ul>
              </div>
            </div>

            <!-- Colonne de droite pour d'autres détails -->
            <div class="details-column">
              <div class="detail-item">
                <p> <b>GENRES :</b>{{ selectedArtist.genres.join('- ') }}</p>
              </div>
              <div class="detail-item" v-if="selectedArtist.gender">
                <p><b>GENDER:</b> {{ selectedArtist.gender }}</p>
              </div>
              <!-- Assurez-vous que chaque élément a la même hauteur -->
              <div class="detail-item empty-item">&nbsp;</div>
              <p><b>Lien Deezer:</b> <a :href="selectedArtist.urlDeezer">Deezer</a></p>
              <div class="detail-item"  v-if="selectedArtist.members.length>0">
                <p><b>Membres:</b></p>
                <ul class="members-list">
                  <li v-for="member in selectedArtist.members" :key="member">{{ member }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

</main>
</div>

</template>

<!-- Votre script reste inchangé -->

<!-- Votre style reste inchangé -->

<script>
import * as d3 from 'd3';
import pic1000000F from '../../../public/data/pic1000000F.png';
import pic100000F from '../../../public/data/pic100000F.png';
import pic10000F from '../../../public/data/pic10000F.png';
import pic1000F from '../../../public/data/pic1000F.png';
import pic100F from '../../../public/data/pic100F.png';
import pic10F from '../../../public/data/pic10F.png';
import pic1F from '../../../public/data/pic1F.png';



import pic10000S from '../../../public/data/pic10000S.png';
import pic1000S from '../../../public/data/pic1000S.png';
import pic100S from '../../../public/data/pic100S.png';
import pic10S from '../../../public/data/pic10S.png';
import pic1S from '../../../public/data/pic1S.png';


import pic1000G from '../../../public/data/pic1000G.png';
import pic100G from '../../../public/data/pic100G.png';
import pic10G from '../../../public/data/pic10G.png';
import pic1G from '../../../public/data/pic1G.png';
import {filterArtists} from "@/data";
export default {
  data(){
    return {
      displayFilter: true,
      width :900 , // Augmentez la largeur du graphique
      height : 650, // Augmentez la hauteur du graphique
      innerWidth: 0,
      innerHeight: 0,
      margin : { top: 20, right: 40, bottom: 20, left: 20 }, // Ajustez les marges

      graphTitle: "Titre initial du graphique",
      legend:null,
      legend1: [
        { label: '10 artistes', icon: pic1000G, value: '3' },
        { label: '10 artistes', icon: pic100G, value: '2' },
        { label: '10 artistes', icon: pic10G, value: '1' },
        { label: '10 artiste', icon: pic1G, value: '0'},
      ],
      legend2: [

        { label: '10 artistes', icon: pic10000S, value: '4' },
        { label: '10 artistes', icon: pic1000S, value: '3' },
        { label: '10 artistes', icon: pic100S, value: '2' },
        { label: '10 artistes', icon: pic10S, value: '1' },
        { label: '10 artiste', icon: pic1S, value: '0' },
      ],

      legend3: [
        { label: '10 fans', icon: pic1000000F, value: '6' },
        { label: '10 fans', icon: pic100000F, value: '5' },
        { label: '10 fans', icon: pic10000F, value: '4' },
        { label: '10 fans', icon: pic1000F, value: '3' },
        { label: '10 fans', icon: pic100F, value: '2' },
        { label: '10 fans', icon: pic10F, value: '1' },
        { label: '10 fans', icon: pic1F, value: '0' },
      ],
       selectedArtist : null,
      selectedFilter:'all',

      currentSubgenre:null,
      currentGenre :null,
      genreIsSelected: false,
      subgenreIsSelected:false,


      data:null,


      statistiques : {
        totalArtiste: 0,
        nbGroupes: 0,
        nbSolos: 0,
         nbArtistesGenre: 0,
         nbGroupesGenre: 0,
         nbSolosGenre: 0,
         nbAutresGenre: 0,
         nbActifGroupesGenre: 0,
         nbActifSolosGenre: 0,
         nbActifAutreGenre: 0,
         actifPourcentageGenre: 0,
        actifPourcentage: 0,
        nbArtistesSubgenre: 0,
        nbGroupesSubgenre: 0,
        nbSolosSubgenre: 0,
        nbAutresSubgenre: 0,
        nbActifGroupesSubgenre: 0,
        nbActifSolosSubgenre: 0,
        nbActifAutreSubgenre: 0,
        actifPourcentageSubgenre: 0,

      }
  }},
  async mounted() {



    try {
      const response = await fetch(
          "./data/details_v1/all_data_details.json"
      );
      this.data = await response.json();
      this.innerWidth = this.width - this.margin.left - this.margin.right;
      this.innerHeight = this.height - this.margin.top - this.margin.bottom;

      this.drawChart();
      let nbActif=0;
      for (let genre in this.data.genres) {
        let genreData = this.data.genres[genre];
        this.statistiques.totalArtiste += genreData.details.nombre_artists_total;
       this.statistiques.nbGroupes += genreData.details.nombre_groupes;
        this.statistiques.nbSolos += genreData.details.nombre_solos;
       nbActif+= genreData.details.nombre_actif_total;
        this.statistiques.actifPourcentage = Math.round((nbActif / this.statistiques.totalArtiste) * 100);
      }


    } catch (error) {
      console.error('Erreur lors de la récupération des données de l\'API : ', error);
    }
  },
  methods: {
    formatLabel(label, value) {
      const exponent = parseInt(value);
      return label.replace('10', `10<sup>${exponent}</sup>`);
    },
    drawChart() {
      this.currentSubgenre = "";
      this.currentGenre = "";
      this.currentGenre = "";
      this.genreIsSelected = false;
      this.subgenreIsSelected = "";
      d3.select('.pictogram-chart').selectAll('*').remove();

      this.graphTitle = "Les genres de musiques les plus jouées par nos artistes.";
      this.labelLegend = "artistes";
      this.legend = [...this.legend1];
      if (!this.data || !this.data.genres) {
        return;
      }

      const genres = Object.keys(this.data.genres).sort((a, b) => {
        return this.data.genres[b].details.nombre_artists_total - this.data.genres[a].details.nombre_artists_total;
      });

      const svg = d3.select('.pictogram-chart').append('svg')
          .attr('width', this.width)
          .attr('height', this.height);

      const yScale = d3.scaleBand()
          .domain(genres)
          .range([0, this.innerHeight])
          .padding(0.1);

      const yAxis = d3.axisLeft(yScale);

      svg.append('g')
          .attr('class', 'y axis')
          .call(yAxis)
          .selectAll('.domain, .tick line')
          .style('stroke', 'transparent');

      const pictogramGroups = svg.selectAll('.pictogram')
          .data(genres, genre => genre);

      pictogramGroups.exit().remove();

      const enterPictogramGroups = pictogramGroups.enter()
          .append('g')
          .attr('class', 'pictogram')
          .attr('transform', (genre) => `translate(100, ${yScale(genre)})`)
          .on('mouseover', (event, genre) => {
            this.updateStatistiques(genre, true);
          })
          .on('click', (event, genre) => {
            this.showSubgenres(genre);
          })
          .on('mouseout', () => {
            this.hideDetailsGenre();
          });

      const updatePictograms = enterPictogramGroups.merge(pictogramGroups)
          .selectAll('image')
          .data((genre) => {
            const count = this.data.genres[genre].details.nombre_artists_total;
            return [
              ...Array(Math.floor(count / 1000)).fill(pic1000G),
              ...Array(Math.floor((count % 1000) / 100)).fill(pic100G),
              ...Array(Math.floor((count % 100) / 10)).fill(pic10G),
              ...Array(count % 10).fill(pic1G),
            ];
          });

      updatePictograms.enter()
          .append('image')
          .attr('class', 'pictogram')
          .merge(updatePictograms)
          .transition()
          .duration(500)
          .attr('x', (d, i) => i * 100)
          .attr('y', 0)
          .attr('width', 40)
          .attr('height', 40)
          .attr('xlink:href', (d) => d);

      updatePictograms.exit().remove();

      // Supprimer les libellés existants
      svg.selectAll('.label').remove();

// Ajouter les libellés actualisés
      svg.selectAll('.label')
          .data(genres)
          .enter()
          .append('text')
          .attr('class', 'label')
          .text((genre) => `${genre} `)
          .attr('x', 30) // Ajuster cette valeur pour décaler le texte
          .attr('y', (genre) => yScale(genre) + yScale.bandwidth() / 2 +20)
          .attr('dy', '.35em')
          .style('font-size', '14px')
          .style('fill', 'black')
          .style('text-anchor', 'start');
    },
    toggleDisplay() {
      this.displayFilter = !this.displayFilter; // Inverse l'état d'affichage
    },
    updateGraphTitle(newTitle) {
      this.graphTitle = newTitle; // Modifiez le titre en fonction de vos besoins
    },
    updateLegend(newLegend) {
      this.legend = newLegend; // Mettez à jour la légende en fonction de vos besoins
    },
    updateStatistiques(genreOrSubgenre,isGenre) {
      let dataDetails;
      if(isGenre) {
        dataDetails=this.data.genres[genreOrSubgenre].details;
        this.currentGenre=genreOrSubgenre;


        this.statistiques.nbArtistesGenre =dataDetails.nombre_artists_total;
        this.statistiques.nbGroupesGenre = dataDetails.nombre_groupes;
        this.statistiques.nbSolosGenre = dataDetails.nombre_solos;
        this.statistiques.nbAutresGenre = dataDetails.nombre_autres;
        this.statistiques.nbActifGroupesGenre = dataDetails.nombre_actif_groupes;
        this.statistiques.nbActifSolosGenre = dataDetails.nombre_actif_solos;
        this.statistiques.nbActifAutreGenre = dataDetails.nombre_actif_autres;
        this.statistiques.actifPourcentageGenre = dataDetails.pourcentage_actifs;


      }

      else {
        this.currentSubgenre=genreOrSubgenre;
        dataDetails = this.data.genres[this.currentGenre].subgenres[genreOrSubgenre].details;
        this.statistiques.nbArtistesSubgenre =dataDetails.nombre_artists_total;
        this.statistiques.nbGroupesSubgenre = dataDetails.nombre_groupes;
        this.statistiques.nbSolosSubgenre = dataDetails.nombre_solos;
        this.statistiques.nbAutresSubgenre = dataDetails.nombre_autres;
        this.statistiques.nbActifGroupesSubgenre = dataDetails.nombre_actif_groupes;
        this.statistiques.nbActifSolosSubgenre = dataDetails.nombre_actif_solos;
        this.statistiques.nbActifAutreSubgenre = dataDetails.nombre_actif_autres;
        this.statistiques.actifPourcentageSubgenre = dataDetails.pourcentage_actifs;

      }


    },
    hideDetailsGenre() {
      this.currentGenre="";
    },
    hideDetailsSubgenre(){
      this.currentSubgenre="";

    },

    showSubgenres(genre) {
      this.backSubgenrePage();
      this.graphTitle = "Les sous-genres du " + genre;
      this.legend = [...this.legend2];

      // Mise à jour de currentGenre vers le genre sélectionné
      this.currentGenre = genre;
      this.genreIsSelected = true;
      this.selectedArtist = "";

      // Retrait du graphique existant
      d3.select('.pictogram-chart').selectAll('*').remove();

      // Dessin du nouveau graphique pour les sous-genres
      const subgenres = Object.keys(this.data.genres[genre].subgenres).sort((a, b) => {
        return this.data.genres[genre].subgenres[b].details.nombre_artists_total - this.data.genres[genre].subgenres[a].details.nombre_artists_total;
      });

      // Création d'un nouveau conteneur SVG pour les sous-genres
      const svg = d3.select('.pictogram-chart').append('svg')
          .attr('width', this.width + 200)
          .attr('height', this.height);

      // Création d'une échelle pour l'axe y basée sur les sous-genres
      const yScale = d3.scaleBand()
          .domain(subgenres)
          .range([0, this.innerHeight])
          .padding(0.5);

      // Ajout de l'axe y dans le conteneur
      const yAxis = d3.axisLeft(yScale);
      svg.append('g')
          .attr('class', 'y axis')
          .call(yAxis)
          .selectAll('.domain, .tick line')
          .style('stroke', 'transparent');

      const subgenreGroups = svg.selectAll('.subgenre-group')
          .data(subgenres)
          .enter()
          .append('g')
          .attr('class', 'subgenre-group')
          .attr('transform', subgenre => `translate(150, ${yScale(subgenre)})`)
          .on('mouseover', (event, subgenre) => {
            this.updateStatistiques(subgenre, false);
          })
          .on('mouseout', () => {
            this.hideDetailsSubgenre();
          })
          .on('click', (event, subgenre) => {
            this.fetchArtist(subgenre);
          });

      // Ajout des pictogrammes pour chaque sous-genre
      const updatePictograms = subgenreGroups.selectAll('.pictogram')
          .data((subgenre) => {
            const count = this.data.genres[genre].subgenres[subgenre].details.nombre_artists_total;
            return [
              ...Array(Math.floor(count / 1000)).fill(pic1000S),
              ...Array(Math.floor((count % 1000) / 100)).fill(pic100S),
              ...Array(Math.floor((count % 100) / 10)).fill(pic10S),
              ...Array(count % 10).fill(pic1S),
            ].slice(0, 10);
          });

      updatePictograms.enter()
          .append('image')
          .merge(updatePictograms)
          .transition()
          .duration(500)
          .attr('class', 'pictogram')
          .attr('x', (d, i) => i * 90)
          .attr('y', -20)
          .attr('width', 40)
          .attr('height', 40)
          .attr('xlink:href', d => d);

      updatePictograms.exit().remove();

      subgenreGroups.append('text')
          .attr('class', 'label')
          .text(subgenre => subgenre)
          .attr('x', -125)
          .attr('y', 25)
          .style('font-size', '14px')
          .style('fill', 'black')
          .style('text-anchor', 'start');
    },
    async fetchArtist(subgenre) {
      try {
        this.currentSubgenre=subgenre;
        if (!this.originalArtistsData) {
          this.originalArtistsData = await filterArtists(this.currentGenre, subgenre);
        }
        this.artistsData = [...this.originalArtistsData]; // Crée une copie des données d'origine

        if (this.artistsData) {
          this.drawArtistsChart(subgenre, this.artistsData);
        } else {
          console.error('No artist data fetched.');
        }
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    },

    drawArtistsChart(subgenre, artistsData) {
      this.subgenreIsSelected = true;
      this.currentSubgenre = subgenre;
      this.graphTitle = "Nos artistes " + this.currentSubgenre;
      d3.select('.pictogram-chart').selectAll('*').remove();
      this.legend = [...this.legend3];

      // Créer un conteneur SVG pour le graphique des artistes
      const svg = d3.select('.pictogram-chart').append('svg')
          .attr('width', this.width - 125)
          .attr('height', `${artistsData.length * 50}px`);

      // Créer une échelle pour l'axe y
      const yScale = d3.scaleBand()
          .domain(artistsData.map(artist => artist.name))
          .range([0, artistsData.length * 35])
          .padding(0.1);

      // Ajouter l'axe y dans le conteneur
      const yAxis = d3.axisLeft(yScale);
      svg.append('g')
          .attr('class', 'y axis')
          .call(yAxis)
          .selectAll('.domain, .tick line')
          .style('stroke', 'transparent');

      // Sélectionner les groupes existants et les mettre à jour avec les nouvelles données
      const artistGroups = svg.selectAll('.artist-group')
          .data(artistsData, artist => artist.name);

      // Supprimer les groupes qui ne sont plus nécessaires
      artistGroups.exit().remove();

      // Créer de nouveaux groupes pour les nouvelles données
      const enterArtistGroups = artistGroups.enter()
          .append('g')
          .attr('class', 'artist-group')
          .attr('id', artist => `artist-group-${CSS.escape(artist.name.replace(/\s+/g, '-'))}`)
          .attr('transform', artist => `translate(200, ${yScale(artist.name) + yScale.bandwidth() / 2})`)
          .on('click', (event, artist) => {
            this.selectArtist(artist);
          })
          .on('mouseover', (event, artist) => {
            this.showDeezerFansTooltip(event, artist);
          })
          .on('mouseout', () => {
            this.hideDeezerFansTooltip();
          });

      // Ajouter des pictogrammes pour chaque artiste
      const updatePictograms = enterArtistGroups.merge(artistGroups)
          .selectAll('.pictogram-artist')
          .data(artist => {
            const deezerFans = artist.deezerFans;
            return [
              ...Array(Math.floor(deezerFans / 10000000)).fill(pic1000000F),
              ...Array(Math.floor((deezerFans % 10000000) / 1000000)).fill(pic1000000F),
              ...Array(Math.floor((deezerFans % 1000000) / 100000)).fill(pic100000F),
              ...Array(Math.floor((deezerFans % 100000) / 10000)).fill(pic10000F),
              ...Array(Math.floor(deezerFans / 1000)).fill(pic1000F),
              ...Array(Math.floor((deezerFans % 1000) / 100)).fill(pic100F),
              ...Array(Math.floor((deezerFans % 100) / 10)).fill(pic10F),
              ...Array(deezerFans % 10).fill(pic1F),
            ].slice(0,15 );
          });

      updatePictograms.enter()
          .append('image')
          .merge(updatePictograms)
          .transition()
          .duration(500)
          .attr('class', 'pictogram-artist')
          .attr('x', (d, i) => i * 40)
          .attr('y', -20)
          .attr('width', 40)
          .attr('height', 40)
          .attr('xlink:href', d => d);

      updatePictograms.exit().remove();

      // Ajouter les noms des artistes avec des sauts de ligne
      const updateArtistLabels = enterArtistGroups.merge(artistGroups)
          .selectAll('.label')
          .data(artist => [artist]);

      updateArtistLabels.enter()
          .append('text')
          .attr('class', 'label')
          .merge(updateArtistLabels)
          .text(artist => artist.name)
          .attr('x', -150)
          .attr('y', 0)
          .style('font-size', '14px')
          .style('fill', 'black')
          .style('text-anchor', 'start')
          .style('font-family', 'Noto Serif')
          .call(wrap, 150);

      updateArtistLabels.exit().remove();

      // Fonction wrap pour gérer les sauts de ligne
        function wrap(text, width) {
          text.each(function () {
            var text = d3.select(this),
                words = text.text().split(/\s+/),
                word,
                line = [],
                y = text.attr("y"),
                dy = 0, // Adjust as needed
                tspan = text.text(null).append("tspan").attr("x", -150).attr("y", y).attr("dy", dy + "em"); // Adjust the starting position

            while (words.length > 0) {
              word = words.shift();
              line.push(word);
              tspan.text(line.join(" "));
              if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" ") + '...');
                break; // Truncate the text and exit the loop
              }
            }
          });
        }},

    selectArtist(artist) {
      // Mettez à jour la variable selectedArtist
      this.selectedArtist = artist;
    },
    applyFilter() {
      // Déterminez le filterType en fonction de la filterValue
      let filterType = null;
      const filterValue = this.selectedFilter;
      if (['all', 'Group', 'Person', ''].includes(this.selectedFilter)) {
        filterType = 'TYPE';
      } else if (['Female', 'Male'].includes(this.selectedFilter)) {
        filterType = 'GENDER';
      }
      console.log(filterType + "," + filterValue)

      // Appelez la fonction pour appliquer le filtre
      this.filterArt(filterType, filterValue);
    },
    async filterArt(filterType = null, filterValue = null) {
      try {
        let filteredArtists = [...this.originalArtistsData]; // Utilise une copie des données originales pour filtrer

        if (filterType !== null && filterValue !== null && this.originalArtistsData && ! ['all'].includes(filterValue)) {
          filteredArtists = this.originalArtistsData.filter(artist => {
            if (filterType === "TYPE") {
              return artist.type === filterValue;
            } else if (filterType === "GENDER") {
              return artist.gender === filterValue;
            }
          });
        }

        // Mettre à jour les données filtrées et afficher le nouveau graphique
        this.artistsData = filteredArtists;
        // Redessiner le graphique avec les artistes filtrés
        this.drawArtistsChart(this.currentSubgenre, this.artistsData);
      } catch (error) {
        console.error('Error filtering artists:', error);
      }
    },



    backSubgenrePage() {
      this.currentSubgenre="";
      this.genreIsSelected=true;
      this.subgenreIsSelected=false;
      d3.select('.pictogram-chart').selectAll('*').remove();
      this.selectedFilter='all';
      this.originalArtistsData=null;
      this.artistsData=null;

    },

    showDeezerFansTooltip(event, artist) {
      const tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('background-color', 'white')
          .style('border', 'solid')
          .style('border-width', '1px')
          .style('padding', '5px')
          .style('display', 'inline-block')
          .style('opacity', 0.9)
          .html(`Artist: ${artist.name}<br>Deezer Fans: ${artist.deezerFans}`);

      tooltip.style('left', event.pageX + 'px')
          .style('top', event.pageY + 'px');
    },

    hideDeezerFansTooltip() {
      d3.select('.tooltip').remove();
    }
  },



}
</script>

<style>
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.min-h-screen {
  min-height: 100vh;
}

/* Header avec titre */


.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

/* Conteneur principal */
.flex-1 {
  display: flex;
}


.container {
  border-radius: 8px; /* Coins légèrement arrondis */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Ombre douce */
  background-color: #ffffff; /* Couleur de fond blanc */
  padding: 20px; /* Espacement intérieur */
}



.details-container {
  background-color: #f5f5f5; /* Couleur de fond similaire à Apple */
  float:left;
  max-width: 25%; /* Ajustez la largeur maximale selon vos besoins */
  margin-left: 0;

}

.filter-container {
  background-color: white; /* Autre couleur neutre */
  margin: 10px;
  max-width: 200px; /* Ajuster la largeur au contenu des carrés */
flex-direction: column;

}

.square-container {
  flex-direction: column; /* Pour empiler les carrés verticalement */
  max-width: 200px; /* Ajuster la largeur au contenu des carrés */
  font-family: "Noto Serif";
}

/* Espacement entre les éléments */
.pictogram-chart,
.details-container,
.filter-container {
  font-family: 'Noto Serif';
}

.min-h-screen {
  min-height: 100vh;
  background-color: white; /* Couleur bleu-gris pour l'arrière-plan */
}



header {

  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top: 2px solid black; /* Ajout d'une ligne noire au-dessus du header */
  border-bottom: 2px solid black; /* Ajout d'une ligne noire en-dessous du header */
}


footer {
  border-radius: 0;
  height: 2px;
  background-color: whitesmoke;
  text-align: left
;
  font-family: 'Noto Serif';
  border-top: 2px black;
  /* Retirer l'arrondi complet du footer */
}

.details-container {
  position: relative;
  font-family:"Noto Serif" ;
  /* ... autres styles */

  /* Ajout d'un fond blanc avec une image graphique */
  border-radius: 10px; /* Coins arrondis pour le détail container */
  height: 750px;
  overflow-y: auto;
}



.shadow-left {
  box-shadow: 4px 0px 4px -4px rgba(0,0,0,0.75);
  border-radius: 0/* Ombre à gauche */
}
.py-4 {
  padding-top: 2rem; /* Augmenter le padding en haut du header */
  padding-bottom: 2rem; /* Augmenter le padding en bas du header */
  border-top: 1px solid darkgrey; /* Ajouter une bordure en haut du header */
  border-bottom: 1px solid darkgray; /* Ajouter une bordure en bas du header */
}

.text-2xl {
  font-family: 'Noto Serif';
  color: black;
  text-align: center;
  margin-left: 50px;
}


/* Pour la disposition en colonnes */
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

/* Pour que les carrés prennent la même place que le filtre */
.flex-1 {
  flex: 1;
}

.legend-icon {
  width: 40px;
  height: 40px;
  margin-right: 5px;
}

.pictogram{
  width:90px;
  height: 90px;
}


/* Stylisez les paragraphes pour être visibles */
.artist-details {
  padding: 20px;
  margin: 10px 0; /* Espacement entre les paragraphes */
  font-size: 16px; /* Taille de la police */
  color: black; /* Couleur du texte */
  background-color: white;
  max-width: 80%;
}


/* Pour le rectangle blanc superposé */



/* Pour les carrés square avec une image de fond */
.square {
  position: relative;
  width: 120px; /* Augmentez la taille totale du carré */
  height: 120px; /* Augmentez la taille totale du carré */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px; /* Espacement entre les carrés */
  overflow: hidden; /* Pour cacher le dépassement du carré blanc */
  border-radius: 20px; /* Ajoutez des coins arrondis */
  border: 2px solid black;

}

.centered {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
}

.artist-image-small {
  width: 150px; /* Ajustez la taille de l'image */
  height: 150px; /* Ajustez la taille de l'image */
  border-radius: 50%; /* Forme ronde */
  border: 2px solid white; /* Bordure autour de l'image */
  z-index: 1; /* Mettre au-dessus du contenu des détails */
  margin-bottom: 10px; /* Espacement avec le nom */
}

.artist-info h2 {
  margin: 0; /* Retirez les marges par défaut */
  font-size: 1.5em; /* Taille du nom de l'artiste */
  color: black; /* Couleur du texte */
}


/*GRAP*/
.axis path,
.axis line {
  fill: none;
  stroke: black;
  shape-rendering: crispEdges;
}

.axis text {
  font-family: 'Noto Serif';
  font-size: 12px;
}
.legend{
  margin-left : 40px

}

/* Couleurs et styles spécifiques à Apple ou Deezer */
.pictogram-chart {

  margin : 20px;
  font-family: "Noto Serif";
  height: 700px;
  overflow-y: auto;
}



.detail-item{
  text-align: left;
}
.details-column{
  font-family: 'Noto Serif';

  width: 200px;
  text-align: left;
  margin-left: 20px;
  max-width: 45%;

}


.big-number {
  font-size: 48px; /* Taille pour le gros chiffre */
}

.lines {
  font-size: 14px; /* Taille plus petite pour les textes ARTISTES et SOLOS */
  margin: 0; /* Pour supprimer les marges entre les deux paragraphes */
  line-height: 1; /* Espacement minimal entre les lignes */
}

.legend{
  font-family: "Noto Serif";
}

</style>
