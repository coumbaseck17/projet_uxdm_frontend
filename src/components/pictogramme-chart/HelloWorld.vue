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
      <div class="flex flex-1">

        <!-- Filtres à gauche -->
        <div class="container filter-container shadow-left " v-if="currentSubgenre" >
          <!-- Contenu du filtre -->
          <h2 class="v">Filtres</h2>
          <label>
            <input type="radio" name="filterGroup" v-model="selectedFilter" value="all" @change="applyFilter"> All
          </label>
          <p>GENDER</p>
          <label>
            <input type="radio" name="filterGroup" v-model="selectedFilter" value="Female" @change="applyFilter"> Female
          </label>
        </div>

        <div v-if="! genreOrSubgenreIsSelected && !currentSubgenre" class="flex flex-1 container  shadow-left flex-col square-container ">
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

        <div  class="flex flex-1 container  shadow-left flex-col square-container" v-if=" genreOrSubgenreIsSelected">
          <!-- Structure des 4 carrés avec chiffres et lignes -->
          <h2> {{this.currentGenre}} </h2>
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

          <div class="pictogram-chart">
            <svg id="graphique" class="w-full h-full border border-gray-300 "></svg>
          </div>
          <!-- Placer la légende en dessous du graphique -->
          <div class="legend flex items-center justify-center mt-4 ">
            <div v-for="legendItem in legend" :key="legendItem.value" class="legend-item flex items-center mr-4">
              <img :src="legendItem.icon" alt="Pictogram" class="legend-icon" />
              <span>{{ legendItem.label }} {{ labelLegend }}</span>
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
import pic1000000 from '../../../public/data/pic100000.png';
import pic100000 from '../../../public/data/pic100000.png';
import pic10000 from '../../../public/data/pic10000.png';
import pic1000 from '../../../public/data/pic1000.png';
import pic100 from '../../../public/data/pic100.png';
import pic10 from '../../../public/data/pic10.png';
import pic1 from '../../../public/data/pic1.png';
export default {
  data(){
    return {
      displayFilter: true,
      width :900 , // Augmentez la largeur du graphique
      height : 600, // Augmentez la hauteur du graphique
      innerWidth: 0,
      innerHeight: 0,
      margin : { top: 20, right: 40, bottom: 20, left: 20 }, // Ajustez les marges

      graphTitle: "Titre initial du graphique",
      legend:[
        { label: '1000000+', icon: pic1000000, value: '1000000+'},
        { label: '100000', icon: pic100000, value: '100000' },
        { label: '10000', icon: pic10000, value: '10000' },
        { label: '1000', icon: pic1000, value: '1000' },
        { label: '100', icon: pic100, value: '100' },
        { label: '10', icon: pic10, value: '10' },
        { label: '1', icon: pic1, value: '1' },
      ],
       selectedArtist : null,
      currentSubgenre:null,
      currentGenre :null,
      genreOrSubgenreIsSelected: false,

      data:null,
       statistiques : {
        totalArtiste: 0,
        nbGroupes: 0,
        nbSolos: 0,
        actifPourcentage: 0,
        nbArtistesSubgenre: 0,
        nbGroupesSubgenre: 0,
        nbSolosSubgenre: 0,
        nbAutresSubgenre: 0,
        nbActifGroupesSubgenre: 0,
        nbActifSolosSubgenre: 0,
        nbActifAutreSubgenre: 0,
        actifPourcentageSubgenre: 0
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
         this.hideDetailsSubgenreOrGenre();
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
      this.genreOrSubgenreIsSelected=true;
      let dataDetails;
      if(isGenre) {
        dataDetails=this.data.genres[genreOrSubgenre].details;
        this.currentGenre=genreOrSubgenre;
      }

      else
        dataDetails=this.data.genres[this.currentGenre].subgenres[genreOrSubgenre].details;

      this.statistiques.nbArtistesSubgenre =dataDetails.nombre_artists_total;
      this.statistiques.nbGroupesSubgenre = dataDetails.nombre_groupes;
      this.statistiques.nbSolosSubgenre = dataDetails.nombre_solos;
      this.statistiques.nbAutresSubgenre = dataDetails.nombre_autres;
      this.statistiques.nbActifGroupesSubgenre = dataDetails.nombre_actif_groupes;
      this.statistiques.nbActifSolosSubgenre = dataDetails.nombre_actif_solos;
      this.statistiques.nbActifAutreSubgenre = dataDetails.nombre_actif_autres;
      this.statistiques.actifPourcentageSubgenre = dataDetails.pourcentage_actifs;

      },
    hideDetailsSubgenreOrGenre() {
      this.genreOrSubgenreIsSelected=false;
      this.currentGenre="";
    },
    showSubgenres(genre)  {

      this.graphTitle= "SOUS-GENRE du"+ genre

      // Update currentGenre to the selected genre
      this.currentGenre = genre;
      this.labelLegend = "artistes"



      // Remove the existing chart
      d3.select('.pictogramme-chart').selectAll('*').remove();

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
          .attr('transform', (subgenre) => `translate(150, ${yScale(subgenre)})`)
          /*.on('mouseover', (event, subgenre) => {
            this.showSubgenreDetails(subgenre);
          })
          .on('mouseout', () => {
            this.hideSubgenreDetails();
          })
          .on('click', (event, subgenre) => {
            this.subgenre = subgenre;
            this.showArtists(subgenre);
          })*/;

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
  font-family:"Courier New"
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
  width: 140px; /* Augmentez la taille totale du carré */
  height: 140px; /* Augmentez la taille totale du carré */
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

}
</style>
