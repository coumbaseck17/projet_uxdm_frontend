<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header avec titre -->
    <h1 class="text-2xl text-left">les genres les populaires 🎸</h1>

    <header class="py-4 border-bottom">
      <nav>
      </nav>
    </header>



    <main class="flex flex-1">
      <!-- Conteneur pour filter-container et pictogram-chart -->
      <button @click="drawChart" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" v-if="genreIsSelected & !subgenreIsSelected">
        Retour
      </button>
      <button @click="showSubgenres(currentGenre)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" v-if="subgenreIsSelected">
        Retour
      </button>
      <div class="flex flex-1">

        <!-- Filtres à gauche -->
        <div class="container filter-container shadow-left " v-if="currentSubgenre && subgenreIsSelected" >
          <!-- Contenu du filtre -->
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
          <!-- Structure des 4 carrés avec chiffres et lignes -->
          <h2 text-white> Statistiques </h2>

          <div class="square"> <!-- Ajoutez des classes CSS pour les styles -->
            <div class="big-number"><b>{{ statistiques.totalArtiste }}</b></div>
            <div class="lines">
              <p>ARTISTES</p>
            </div>
          </div>
          <div class="square"> <!-- Ajoutez des classes CSS pour les styles -->
            <div class="big-number"><b>{{ statistiques.nbSolos }}</b></div>
            <div class="lines">
              <p>ARTISTES</p>
              <p>SOLOS</p>
            </div>
          </div>
          <div class="square"> <!-- Ajoutez des classes CSS pour les styles -->
            <div class="big-number"><b>{{ statistiques.nbGroupes }}</b></div>
            <div class="lines">
              <p>GROUPES</p>
              <p></p>
            </div>
          </div>
          <div class="square"> <!-- Ajoutez des classes CSS pour les styles -->
            <div class="big-number"><b>{{ statistiques.actifPourcentage }} %</b></div>
            <div class="lines">
              <p>ARTISTES</p>
              <p>ACTIFS</p>
            </div>
          </div>
        </div>
        <div  class="flex flex-1 container  shadow-left flex-col square-container" v-if="currentGenre && !currentSubgenre">
          <!-- Structure des 4 carrés avec chiffres et lignes -->
          <h2> {{this.currentGenre}}</h2>
          <div class="square"> <!-- Ajoutez des classes CSS pour les styles -->
            <div class="big-number"><b>{{ statistiques.nbArtistesGenre }}</b></div>
            <div class="lines">
              <p>ARTISTES</p>
            </div>
          </div>
          <div class="square"> <!-- Ajoutez des classes CSS pour les styles -->
            <div class="big-number"><b>{{ statistiques.nbActifSolosGenre }}</b></div>
            <div class="lines">
              <p>ARTISTES</p>
              <p>SOLOS</p>
            </div>
          </div>
          <div class="square"> <!-- Ajoutez des classes CSS pour les styles -->
            <div class="big-number"><b>{{ statistiques.nbActifGroupesGenre }}</b></div>
            <div class="lines">
              <p>GROUPES</p>
              <p></p>
            </div>
          </div>
          <div class="square"> <!-- Ajoutez des classes CSS pour les styles -->
            <div class="big-number"><b>{{ statistiques.actifPourcentageGenre }} %</b></div>
            <div class="lines">
              <p>ARTISTES</p>
              <p>ACTIFS</p>
            </div>
          </div>
        </div>
        <div  class="flex flex-1 container  shadow-left flex-col square-container" v-if="genreIsSelected && currentSubgenre">
          <!-- Structure des 4 carrés avec chiffres et lignes -->
          <h2> {{this.currentGenre}}: {{this.currentSubgenre}}</h2>
          <div class="square"> <!-- Ajoutez des classes CSS pour les styles -->
            <div class="big-number"><b>{{ statistiques.nbArtistesSubgenre }}</b></div>
            <div class="lines">
              <p>ARTISTES</p>
            </div>
          </div>
          <div class="square"> <!-- Ajoutez des classes CSS pour les styles -->
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

          <div class="pictogram-chart" >
            <svg id="graphique" class="w-full h-full border border-gray-300 "></svg>
          </div>



          <!-- Placer la légende en dessous du graphique -->
          <div class="legend flex items-center justify-center mt-4 ">
            <div v-if="! subgenreIsSelected " class="legend flex items-center justify-center mt-4 ">
            <div v-for="legendItem in legend1" :key="legendItem.value" class="legend-item flex items-center mr-4">
              <img :src="legendItem.icon" alt="Pictogram" class="legend-icon" />
              <span>{{ legendItem.label }} {{ labelLegend }}</span>
            </div>
            </div>
            <div v-else class="legend flex items-center justify-center mt-4 ">
              <div v-for="legendItem in legend2" :key="legendItem.value" class="legend-item flex items-center mr-4">
                <img :src="legendItem.icon" alt="Pictogram" class="legend-icon" />
                <span>{{ legendItem.label }} {{ labelLegend }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container details-container" v-if="selectedArtist">
        <div class="details-container artist-details" >
          <!-- Photo de profil centrée -->
          <div class="centered">
            <img :src="selectedArtist.picture" alt="Artist" class="artist-image-small">
            <h2>{{ selectedArtist.name }}</h2>
          </div>
          <div class="artist-details-columns flex justify-between">
            <!-- Colonne de gauche pour les albums, genre, etc. -->
            <div class="details-column">
              <div class="detail-item">
                <p><b> {{ selectedArtist.deezerFans }} FANS</b></p>
              </div>
              <div class="detail-item">
                <p><b>ACTIF</b> {{ selectedArtist.lifeSpan.ended ? 'Oui' : 'Non' }}</p>
              </div>
              <!-- Assurez-vous que chaque élément a la même hauteur -->
              <div class="detail-item empty-item">&nbsp;</div>
              <p><b>Label:</b> {{ selectedArtist.recordLabel }}</p>
              <div class="detail-item empty-item">&nbsp;</div>
              <p><b>Albums:</b> {{ selectedArtist.albums.join(', ') }}</p>
            </div>

            <!-- Colonne de droite pour d'autres détails -->
            <div class="details-column">
              <div class="detail-item">
                <p><b>Genres de musique:</b> {{ selectedArtist.genres.join(', ') }}</p>
              </div>
              <div class="detail-item">
                <p><b>Genre:</b> {{ selectedArtist.gender }}</p>
              </div>
              <!-- Assurez-vous que chaque élément a la même hauteur -->
              <div class="detail-item empty-item">&nbsp;</div>
              <p><b>Lien Deezer:</b> <a :href="selectedArtist.urlDeezer">Deezer</a></p>
              <div class="detail-item empty-item">&nbsp;</div>
              <p><b>Membres:</b> {{ selectedArtist.members.join(', ') }}</p>
            </div>
          </div>
        </div>
      </div>

</main>
</div>
<footer class=" bg-gray-800 text-black py-4 text-center">
@MIAGE M2 UXDM
</footer>
</template>

<!-- Votre script reste inchangé -->

<!-- Votre style reste inchangé -->

<script>
import * as d3 from 'd3';
import pic1000000 from '../../../public/data/pic1000000.png';
import pic100000 from '../../../public/data/pic100000.png';
import pic10000 from '../../../public/data/pic10000.png';
import pic1000 from '../../../public/data/pic1000.png';
import pic100 from '../../../public/data/pic100.png';
import pic10 from '../../../public/data/pic10.png';
import pic1 from '../../../public/data/pic1.png';
import {filterArtists} from "@/data";
export default {
  data(){
    return {
      displayFilter: true,
      width :700 , // Augmentez la largeur du graphique
      height : 500, // Augmentez la hauteur du graphique
      innerWidth: 0,
      innerHeight: 0,
      margin : { top: 20, right: 40, bottom: 20, left: 20 }, // Ajustez les marges

      graphTitle: "Titre initial du graphique",
      legend1:[

        { label: '1000', icon: pic1000, value: '1000' },
        { label: '100', icon: pic100, value: '100' },
        { label: '10', icon: pic10, value: '10' },
        { label: '1', icon: pic1, value: '1' },
      ],
      legend2: [
        { label: '1000000+', icon: pic1000000, value: '1000000'},
        { label: '100000', icon: pic100000, value: '100000' },
        { label: '10000', icon: pic10000, value: '10000' },
        { label: '1000', icon: pic1000, value: '1000' },
        { label: '100', icon: pic100, value: '100' },
        { label: '10', icon: pic10, value: '10' },
        { label: '1', icon: pic1, value: '1' },
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
    drawChart() {

      this.backMainPage();
      this.graphTitle= "Les genres de musiques les plus jouées par nos artistes."
      this.labelLegend = "artistes"
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
          .call(yAxis).selectAll('.domain, .tick line')
          .style('stroke', 'transparent');

      const pictogramGroups = svg.selectAll('.pictogram')
          .data(genres)
          .enter()
          .append('g')
          .attr('class', 'pictogram')
          .attr('transform', (genre) => `translate(100, ${yScale(genre)})`)
         .on('mouseover', (event, genre) => {
            this.updateStatistiques(genre,true);
          })
        .on('click', (event, genre) => {
            this.showSubgenres(genre);
          })
       .on('mouseout', () => {
         this.hideDetailsGenre();
       })
          .on('click', (event, genre) => {
            this.showSubgenres(genre);
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

    showSubgenres(genre)  {

      this.backSubgenrePage();
      this.graphTitle= "Les sous-genres du "+ genre

      // Update currentGenre to the selected genre
      this.currentGenre = genre;
      this.genreIsSelected=true;
      this.labelLegend = "artistes";
      this.selectedArtist="";



      // Remove the existing chart
      d3.select('.pictogram-chart').selectAll('*').remove();

      // Draw the new chart for subgenres
      const subgenres = Object.keys(this.data.genres[genre].subgenres).sort((a, b) => {
        return this.data.genres[genre].subgenres[b].details.nombre_artists_total - this.data.genres[genre].subgenres[a].details.nombre_artists_total;
      });

      // Create a new SVG container for subgenres
      const svg = d3.select('.pictogram-chart').append('svg')
          .attr('width', this.width)
          .attr('height', this.height);

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



      const subgenreGroups = svg.selectAll('.subgenre-group')
          .data(subgenres)
          .enter()
          .append('g')
          .attr('class', 'subgenre-group')
          .attr('transform', (subgenre) => `translate(150, ${yScale(subgenre)})`).
          on('mouseover', (event, subgenre) => {
            this.updateStatistiques(subgenre,false);
          })
          .on('mouseout', () => {
            this.hideDetailsSubgenre();
          }).on('click', (event, subgenre) => {
            this.fetchArtist(subgenre);
          });

      // Add pictograms for each subgenre
      subgenreGroups.selectAll('.pictogram')
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
          .attr('y', -20) // Adjust the vertical position of pictograms
          .attr('width', 40)
          .attr('height', 40)
          .attr('xlink:href', d => d);

      subgenreGroups.append('text')
          .attr('class', 'label')
          .text(subgenre => subgenre)
          .attr('x', -125) // Adjust the horizontal position of subgenre names
          .attr('y', 0)
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

      this.subgenreIsSelected=true;
      this.currentSubgenre=subgenre;
      this.graphTitle="Nos artistes " + this.currentSubgenre
    d3.select('.pictogram-chart').selectAll('*').remove();

      this.labelLegend = "fans";


    // Create an SVG container for the artist chart
    const svg = d3.select('.pictogram-chart').append('svg')
        .attr('width', `${artistsData.length *  100}px`  )
        .attr('height',`${artistsData.length * 50}px`)
    ;


    // Create a scale for the y-axis
    const yScale = d3.scaleBand()
        .domain(artistsData.map(artist => artist.name))
        .range([0, artistsData.length * 35])
        .padding(0.1);

    // Add the y-axis inside the container
    const yAxis = d3.axisLeft(yScale);
    svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis).selectAll('.domain, .tick line')
        .style('stroke', 'transparent');

    // Create a group for each artist
    const artistGroups = svg.selectAll('.artist-group')
        .data(artistsData)
        .enter()
        .append('g')
        .attr('class', 'artist-group')
        .attr('id', artist => `artist-group-${CSS.escape(artist.name.replace(/\s+/g, '-'))}`) // Use CSS.escape()
        .attr('transform', artist => `translate(200, ${yScale(artist.name) + yScale.bandwidth() / 2})`)
        /*.on('mouseout', () => {
          this.unhighlightArtist();
        }).on('mouseover', (event, artist) => {
          this.highlightArtist(artist);
        })*/
        .on('click', (event, artist) => {
          this.selectArtist(artist);
        });

    // Add pictograms for each artist
    artistGroups.selectAll('.pictogram')
        .data(artist => {
          const deezerFans = artist.deezerFans;
          return [
            ...Array(Math.floor(deezerFans / 10000000)).fill(pic1000000),
            ...Array(Math.floor((deezerFans % 10000000) / 1000000)).fill(pic1000000),
            ...Array(Math.floor((deezerFans % 1000000) / 100000)).fill(pic100000),
            ...Array(Math.floor((deezerFans % 100000) / 10000)).fill(pic10000),
            ...Array(Math.floor(deezerFans / 1000)).fill(pic1000),
            ...Array(Math.floor((deezerFans % 1000) / 100)).fill(pic100),
            ...Array(Math.floor((deezerFans % 100) / 10)).fill(pic10),
            ...Array(deezerFans % 10).fill(pic1),
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

    // Add artist names with line breaks
    artistGroups.append('text')
        .attr('class', 'label')
        .text(artist => artist.name)
        .attr('x', -150) // Adjust the horizontal position of artist names
        .attr('y', 0)
        .style('font-size', '14px')
        .style('fill', 'black')
        .style('text-anchor', 'start')
        .call(wrap, 150); // Adjust the width for wrapping as needed

// Wrap function to handle line breaks
    // Wrap function to handle line breaks
    function wrap(text, width) {
      text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = 0, // Adjust as needed
            tspan = text.text(null).append("tspan").attr("x", -150).attr("y", y).attr("dy", dy + "em"); // Adjust the starting position

        while (words.length > 0) {
          word = words.shift();
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", -150).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word); // Adjust the starting position
          }
        }
      });
    }
  },

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

backMainPage() {
      this.currentSubgenre="";
      this.currentGenre="";
  this.currentGenre="";

  this.genreIsSelected=false;
      this.subgenreIsSelected="";
      d3.select('.pictogram-chart').selectAll('*').remove();

},

    backSubgenrePage() {
      this.currentSubgenre="";
      this.genreIsSelected=true;
      this.subgenreIsSelected=false;
      d3.select('.pictogram-chart').selectAll('*').remove();
      this.selectedFilter='all';
      this.originalArtistsData=null;
      this.artistsData=null;

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
  margin: 10px;
  float:left;

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
  font-family:"Courier New",serif
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
  font-family: "Courier New";
  border-top: 2px black;
  /* Retirer l'arrondi complet du footer */
}

.details-container {
  position: relative;
  font-family:"Noto Serif" ;
  /* ... autres styles */

  /* Ajout d'un fond blanc avec une image graphique */
  border-radius: 10px; /* Coins arrondis pour le détail container */

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
  text-align: left;
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
  width: 20px;
  height: 20px;
  margin-right: 5px;
}



/* Stylisez les paragraphes pour être visibles */
.artist-details {
  padding: 20px;
  margin: 10px 0; /* Espacement entre les paragraphes */
  font-size: 16px; /* Taille de la police */
  color: black; /* Couleur du texte */
  background-color: white;
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
  font-family: 'Arial', sans-serif;
  font-size: 12px;
}
.legend{
  margin-left : 40px

}

/* Couleurs et styles spécifiques à Apple ou Deezer */
.pictogram-chart {
  margin : 2px;
  font-family: "Noto Serif";
  width: 700px;
  height: 550px;
  overflow-y: auto;
  overflow-x: auto;
}

svg {
  min-width: 700px;
}


</style>
