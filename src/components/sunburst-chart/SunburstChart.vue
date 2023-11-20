<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header avec titre -->
    <h1 class="text-2xl text-left border-bottom">Popular music on Deezer 🎸</h1>

    <header class="py-4">
    </header>



    <main class="flex flex-1 fixed-top">
      <!-- Conteneur pour filter-container et pictogram-chart -->
      <div class="flex" style="width: 200px;">

        <div class="flex flex-1 container filter-container shadow-left flex-col ">
          <div v-show="showGenres" class="container filter-container shadow-left " >
            <!-- Contenu du filtre -->
            <h2 class="v">Filtres</h2>
            <hr>
            <p class="bold-text">GENDER</p>
            <label>
              <input type="radio" name="filterGroup" value="Female" @change="changeSelectedFilter('Female')"> Female <br>
              <input type="radio" name="filterGroup" value="Male" @change="changeSelectedFilter('Male')"> Male
            </label>
            <p class="bold-text">Group/solo</p>
            <label>
              <input type="radio" name="filterGroup" value="Group" @change="changeSelectedFilter('Group')"> Group <br>
              <input type="radio" name="filterGroup" value="Solo" @change="changeSelectedFilter('Person')"> Solo
            </label>
            <p class="bold-text">Activity</p>
            <label>
              <input type="radio" name="filterGroup" value="Active" @change="changeSelectedFilter('false')"> Active <br>
              <input type="radio" name="filterGroup" value="Not active" @change="changeSelectedFilter('true')"> Not active <br> <hr>
            </label>
            <button class="grey-button" @click="clearFilters">Remove filters</button>
          </div>
        </div>

      </div>
      <!-- Graphique au milieu -->
      <div class="flex flex-1 flex-col">
        <div v-show="!showGenres" class="sunburst-chart"><div id="details-container" class="details-container"></div><div id="details-container" class="details-container"></div></div>
        <div v-show="showGenres" class="sunburst-chart-genres"><div id="details-container-genres" class="details-container-genres"></div><div id="details-container-genres" class="details-container-genres"></div></div>
      </div>

      <div v-if="this.selectedArtist" class="container details-container-artist">
        <div v-show="showInfo" class="details-container-artist artist-details" >
          <!-- Photo de profil centrée -->
          <div class="centered">
            <img :src="this.selectedArtist.picture" alt="Artist" class="artist-image-small">
            <h2>{{ this.selectedArtist.name }}</h2>
          </div>
          <div class="artist-details-columns flex justify-between">
            <!-- Colonne de gauche pour les albums, genre, etc. -->
            <div class="details-column">
              <div class="detail-item">
                <p><b> {{ this.selectedArtist.value }} fans</b></p>
              </div>
              <div class="detail-item">
                <p><b>Active:</b> {{ this.selectedArtist.lifeSpan.ended ? 'No' : 'Yes' }}</p>
              </div>
              <p v-if="this.selectedArtist.recordLabel!=null && this.selectedArtist.recordLabel!=''">Label: {{ this.selectedArtist.recordLabel }}</p>
              <p>Albums: {{ this.selectedArtist.albums }}</p>
              <div class="detail-item">
                <p>Music genres: {{ this.selectedArtist.genres }}</p>
              </div>
              <p><b>Deezer link:</b> <a :href="this.selectedArtist.urlDeezer">Deezer</a></p>
              <p v-if="this.selectedArtist.type==='Group' && this.selectedArtist.members!=null && this.selectedArtist.members!=''">Members: {{ this.selectedArtist.members }}</p>
            </div>

          </div>
        </div>
        <button @click="showInfo = false">Exit info</button>
      </div>

  </main>
  </div>
  <footer class=" bg-gray-800 text-black py-4 text-center">
    @MIAGE M2 UXDM
  </footer>
</template>


<script>


import * as d3 from 'd3';
import {filterArtists} from "@/data";

export default {
  data() {
    return {
      data: null,
      dataArtists: null,
      filterValue: '',
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
      showGenres: false,
      showInfo: false,
      genreName1: '',
      genreColor1:''

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

    changeSelectedFilter(filter){
      this.selectedFilter=filter;
      console.log(this.selectedFilter)
      console.log(this.genreName1 + "  et "+ this.genreColor1);
      this.drawChartGenre(this.genreName1,this.genreColor1);
    },
    clearFilters() {
      this.selectedFilter='all';
      const filterGroups = ['filterGroup'];
      console.log(this.selectedFilter)
      filterGroups.forEach(groupName => {
        const radios = document.getElementsByName(groupName);
        radios.forEach(radio => {
          radio.checked = false;
        });
      });
      this.drawChartGenre(this.genreName1,this.genreColor1);
    },

    // Fonction pour appliquer le filtre en fonction du type et de la valeur du filtre
    filterArt(filterType, filterValue, originalArtistsData) {
      console.log(originalArtistsData)
      try {
        let filteredArtists = [...originalArtistsData]; // Utilise une copie des données originales pour filtrer

        if (filterType !== null && filterValue !== null && originalArtistsData && !['all'].includes(filterValue)) {
          filteredArtists = originalArtistsData.filter(artist => {
            switch (filterType) {
              case "TYPE":
                return artist.type === filterValue;
              case "GENDER":
                return artist.gender === filterValue;
              case "ACTIVITY":
                if(filterValue==='true'){
                  return artist.lifeSpan.ended === true;
                }else{
                  return artist.lifeSpan.ended === false;
                }
              default:
                return true; // Si aucun filtre spécifique n'est appliqué, retourne toutes les données
            }
          });
        }

        this.dataArtists = filteredArtists;
      } catch (error) {
        console.log("Erreur lors du filtrage des artistes : ", error);// Retourne un tableau vide en cas d'erreur
      }
    },

// Utilisation de la fonction applyFilter() pour déterminer le type et la valeur du filtre, puis appliquer le filtre
    async applyFilter(){
      let filterType = null;
      this.filterValue = this.selectedFilter;

      if (['all', 'Group', 'Person', ''].includes(this.selectedFilter)) {
        filterType = 'TYPE';
      } else if (['Female', 'Male'].includes(this.selectedFilter)) {
        filterType = 'GENDER';
      } else if (['true', 'false'].includes(this.selectedFilter)) {
        filterType = 'ACTIVITY';
      }

      console.log(filterType + "," + this.filterValue);

      return filterType;
    },




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

              this.showGenres = true;

              if (d && d.data && d.data.name) {
                const genreColor = color(d.data.name);
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
      this.genreName1=genreName;
      this.genreColor1=genreColor;

      d3.selectAll('svg').remove()

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

            const filterType = await this.applyFilter(this.selectedFilter);
            console.log(filterType)
            const originalArtistsData = this.dataArtists
            this.filterArt(filterType, this.selectedFilter, originalArtistsData)

            console.log("datafiltre "+this.dataArtists)
            Object.values(this.dataArtists).forEach((artist, index) => {
              subgenreObj.children.push({
                name: artist.name,
                value: artist.deezerFans,
                artistIndex: index,
                picture: artist.picture,
                type: artist.type,
                gender: artist.gender,
                lifeSpan: artist.lifeSpan,
                recordLabel: artist.recordLabel,
                urlDeezer: artist.urlDeezer,
                genres: artist.genres,
                members: artist.members,
                albums: artist.albums
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
            if (d.depth === 3) { // Limiter l'action du clic à la première couche (profondeur 3)"
              const artist = d.data;
              console.log(artist)
              this.selectedArtist = artist;
              this.showInfo = true;
              console.log(this.selectedArtist.name)
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
          .style('pointer-events', 'none')
          ;
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

.artist-image-small {
  width: 150px; /* Ajustez la taille de l'image */
  height: 150px; /* Ajustez la taille de l'image */
  border-radius: 50%; /* Forme ronde */
  border: 2px solid white; /* Bordure autour de l'image */
  z-index: 1; /* Mettre au-dessus du contenu des détails */
  margin-bottom: 10px; /* Espacement avec le nom */
}

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

.text-white {
  color: white;
}

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

/* Couleurs et styles spécifiques à Apple ou Deezer */
.pictogram-chart {
}

.details-container-artist {
  background-color: #f5f5f5; /* Couleur de fond similaire à Apple */
}

.filter-container {
  background-color: white; /* Autre couleur neutre */
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

.details-container-artist {
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
  font-family: 'Impact', sans-serif;
  color: black;
  text-align: left;

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

/* Stylisez les paragraphes pour être visibles */
.artist-details {
  padding: 20px;
  margin: 10px 0; /* Espacement entre les paragraphes */
  font-size: 16px; /* Taille de la police */
  color: black; /* Couleur du texte */
  background-color: white;
}

.centered {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
}

.artist-info h2 {
  margin: 0; /* Retirez les marges par défaut */
  font-size: 1.5em; /* Taille du nom de l'artiste */
  color: black; /* Couleur du texte */
}

.grey-button {
  background-color: lightgrey;
  padding: 8px 16px; /* Exemple de style pour le padding */
  border: none; /* Exemple de style pour supprimer la bordure */
}

.bold-text {
  font-weight: bold;
}

</style>
