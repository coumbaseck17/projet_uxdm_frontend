<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header avec titre -->
    <h1 class="text-2xl text-left">les genres les populaires 🎸</h1>

    <header class="py-4 border-bottom">
      <nav>        <button @click="toggleDisplay">Changer l'affichage</button>
      </nav>
    </header>



    <main class="flex flex-1">
      <!-- Conteneur pour filter-container et pictogram-chart -->
      <div class="flex flex-1">

        <!-- Filtres à gauche -->
        <div class="container filter-container shadow-left " v-if="displayFilter" >
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

        <div v-else class="flex flex-1 container filter-container shadow-left flex-col ">
          <!-- Structure des 4 carrés avec chiffres et lignes -->
          <div class="square"> <!-- Ajoutez des classes CSS pour les styles -->
            <div class="big-number">1</div>
            <div class="lines">
              <p>Ligne 1</p>
              <p>Ligne 2</p>
            </div>
          </div>
          <div class="square"> <!-- Ajoutez des classes CSS pour les styles -->
            <div class="big-number">1</div>
            <div class="lines">
              <p>Ligne 1</p>
              <p>Ligne 2</p>
            </div>
          </div>
          <div class="square"> <!-- Ajoutez des classes CSS pour les styles -->
            <div class="big-number">1</div>
            <div class="lines">
              <p>Ligne 1</p>
              <p>Ligne 2</p>
            </div>
          </div>
          <div class="square"> <!-- Ajoutez des classes CSS pour les styles -->
            <div class="big-number">1</div>
            <div class="lines">
              <p>Ligne 1</p>
              <p>Ligne 2</p>
            </div>
          </div>
        </div>
        <!-- Graphique au milieu -->
        <div class="flex flex-1 flex-col">
          <div class="pictogram-chart">
            <h2 class="text-2xl text-center mb-4">{{ graphTitle }}</h2>
            <svg id="graphique" class="w-full h-full border border-gray-300"></svg>
          </div>
          <!-- Placer la légende en dessous du graphique -->
          <div class="legend flex items-center justify-center mt-4">
            <div v-for="legendItem in legend" :key="legendItem.value" class="legend-item flex items-center mr-4">
              <img :src="legendItem.icon" alt="Pictogram" class="legend-icon" />
              <span>{{ legendItem.label }} {{ labelLegend }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="container details-container">
        <div class="details-container artist-details">
          <!-- Photo de profil centrée -->
          <div class="centered">
            <img :src="selectedArtist.picture" alt="Artist" class="artist-image-small">
            <h2>{{ selectedArtist.name }}</h2>
          </div>
          <div class="artist-details-columns flex justify-between">
            <!-- Colonne de gauche pour les albums, genre, etc. -->
            <div class="details-column">
              <div class="detail-item">
                <p><b>DeezerFans:</b> {{ selectedArtist.deezerFans }}</p>
              </div>
              <div class="detail-item">
                <p><b>LifeSpan Ended:</b> {{ selectedArtist.lifeSpan.ended ? 'Oui' : 'Non' }}</p>
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
import pic1000000 from '@/../public/data/pic100000.png';
import pic100000 from '@/../public/data/pic100000.png';
import pic10000 from '@/../public/data/pic10000.png';
import pic1000 from '@/../public/data/pic1000.png';
import pic100 from '@/../public/data/pic100.png';
import pic10 from '@/../public/data/pic10.png';
import pic1 from '@/../public/data/pic1.png';
export default {
  data(){
    return {
      displayFilter: true,
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
       selectedArtist : {
         albums: ['Album 1', 'Album 2', 'Album 3'],
         name : "Tori Kelly",
         gender: 'Féminin',
         genres: ['Pop', 'R&B', 'Soul'],
         lifeSpan: { ended: false },
         members: ['Membre 1', 'Membre 2'],
         picture: '/data/photo.jpg',
         recordLabel: 'Label de disque',
         type: 'Artiste Solo',
         urlDeezer: 'https://www.deezer.com/artist/1234567',
         deezerFans : 124545
       }
  }},
  mounted() {

    // Exemple de données aléatoires pour un graphique à barres avec D3.js
    const data = [
      { category: 'Catégorie 1', value: Math.floor(Math.random() * 100) },
      { category: 'Catégorie 2', value: Math.floor(Math.random() * 100) },
      { category: 'Catégorie 3', value: Math.floor(Math.random() * 100) },
      { category: 'Catégorie 4', value: Math.floor(Math.random() * 100) },
      { category: 'Catégorie 5', value: Math.floor(Math.random() * 100) },
    ];

    // Utilisation de D3.js pour créer un graphique à barres simples

    const width = 800; // Augmentez la largeur du graphique
    const height = 400; // Augmentez la hauteur du graphique

    const margin = { top: 40, right: 40, bottom: 50, left: 60 }; // Ajustez les marges

    // Calculez les dimensions internes en fonction des marges
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3.scaleBand()
        .domain(data.map(d => d.category))
        .range([0, innerWidth])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .nice()
        .range([innerHeight, 0]);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    const pictogramChartDiv = document.querySelector('.pictogram-chart');

    // Utilisation de D3.js pour attacher le graphique à la division pictogram-chart
    const svg = d3.select(pictogramChartDiv)
        .append('svg')
        .attr('class', 'w-full h-full border border-gray-300')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.category))
        .attr('y', d => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', d => innerHeight - y(d.value));

    svg.append('g')
        .attr('transform', `translate(${margin.left},${innerHeight + margin.top})`)
        .call(xAxis);

    svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .call(yAxis);
  }
  ,methods:{
    toggleDisplay() {
      this.displayFilter = !this.displayFilter; // Inverse l'état d'affichage
    },
    updateGraphTitle(newTitle) {
      this.graphTitle = newTitle; // Modifiez le titre en fonction de vos besoins
    },
    updateLegend(newLegend) {
      this.legend = newLegend; // Mettez à jour la légende en fonction de vos besoins
    },

  }
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

.details-container {
  background-color: #f5f5f5; /* Couleur de fond similaire à Apple */
}

.filter-container {
  background-color: white; /* Autre couleur neutre */
}

/* Espacement entre les éléments */
.pictogram-chart,
.details-container,
.filter-container {
  margin: 10px;
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

</style>
