<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header avec titre -->
    <header class="bg-header-image py-4 border-bottom">
      <h1 class="text-2xl text-center">les genres les populaires 🎸</h1>
      <nav></nav>
    </header>


    <!-- Conteneur principal -->
    <main class="flex flex-1">
      <!-- Conteneur pour filter-container et pictogram-chart -->
      <div class="flex flex-1">
        <!-- Filtres à gauche -->
        <div class="container filter-container shadow-left">
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

        <!-- Graphique au milieu -->
        <div class=" pictogram-chart">
          <!-- Graphique SVG avec D3.js -->
          <svg id="graphique" class="w-full h-full border border-gray-300"></svg>
        </div>
      </div>

      <!-- Bloc à droite avec les détails -->
      <div class="container details-container">
        <p>NOM </p>
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

export default {
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

    const width = 500
    const height = 600;

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
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
  font-family: 'Impact', sans-serif; /* Changer la police du titre */
  color: black; /* Couleur du texte en noir */
  border-bottom-left-radius: 0; /* Retirer l'arrondi dans le coin inférieur gauche */
  border-bottom-right-radius: 0;
  text-align: left;


  /* Retirer l'arrondi dans le coin inférieur droit */
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
  background-color: white; /* Couleur de fond pour details-container */
  flex: 2;
  border-radius: 0;


  /* Augmenter la taille du details-container */
}

.shadow-left {
  box-shadow: 4px 0px 4px -4px rgba(0,0,0,0.75);

  border-radius: 0/* Ombre à gauche */
}


.bg-header-image {
  background-image: url("/public/data/radio.jpg");
  background-size: cover;
  background-position: center;
  color: black; /*blac Couleur du texte pour contraster avec l'image */
  height: 200px;
}

</style>
