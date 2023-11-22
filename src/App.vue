<template>
  <div id="app">
      <header class="py-4 " v-if="isHomeVisible">
        <h1 class="text-2xl text-center" > WASABI data set dashboard </h1>
      </header>
    <main>
      <div :style="{ display: showFlexContainer ? 'flex' : 'initial' }" class="containerWrapper">
        <div  class="statContainer" v-show="isHomeVisible">
          <!-- Structure des 4 carrés avec chiffres et lignes -->
          <h2  class="center-text"> Statistics </h2>
          <div class="square"> <!-- Ajoutez des classes CSS pour les styles -->
            <div class="big-number"><b>12263</b></div>
            <div class="lines">
              <p>ARTISTS</p>
            </div>
          </div>
          <div class="square"> <!-- Ajoutez des classes CSS pour les styles -->
            <div class="big-number"><b>5934</b></div>
            <div class="lines">
              <p>SOLO ARTISTS</p>

            </div>
          </div>
          <div class="square"> <!-- Ajoutez des classes CSS pour les styles -->
            <div class="big-number"><b>5503</b></div>
            <div class="lines">
              <p>GROUPS</p>
              <p></p>
            </div>
          </div>
          <div class="square"> <!-- Ajoutez des classes CSS pour les styles -->
            <div class="big-number"><b>79 %</b></div>
            <div class="lines">
              <p>ACTIVE ARTISTS</p>

            </div>
          </div>
        </div>
      <router-view @route-change="handleRouteChange"></router-view>
      <div v-show="showChartsButtons" class="componentsContainer">
        <div class="component" id="treemap">
          <router-link to="/treemap" v-on="hideStatistics">
            <img src="../public/data/treemap2.png" alt="treemap" class="chartImage"/>
          </router-link>
        </div>
        <div class="component" id="component2">
          <router-link to="/pictogram">
            <img src="../public/data/pictogramChart.png" alt="pictogramchart" class="chartImage"/>
          </router-link>
        </div>
        <div class="component" id="component3">
          <router-link to="/sunburst">
            <img src="../public/data/sunburstChart2.png" alt="sunburst" class="chartImage"/>
          </router-link>
        </div>
        <div class="component" id="component4">
          <router-link to="/barchart">
            <img src="../public/data/barchart.png" alt="barchart" class="chartImage"/>
          </router-link>
        </div>
      </div>
        <router-link v-if="!isHomeVisible" :to="{ path: '/' }" class="home-button">
          <img src="../public/data/home.png" alt="Home" width="30" height="30">
        </router-link>
      </div>
    </main>
    <footer class=" bg-gray-800 text-black py-4 text-center">
      @MIAGE M2 UXDM
    </footer>
  </div>
</template>

<script>

import router from '@/router';

export default {
  name: 'App',
  router,
  methods :{
    hideStatistics() {
      // Masquer les statistiques lorsque la route change vers un autre composant
      this.isHomeVisible = false;
    },
  },
  data() {
    return {
      showChartsButtons: true,
      isHomeVisible:true,
      showFlexContainer: true,
    };
  },
  watch: {
    '$route'() {
      this.showChartsButtons = this.$route.path === '/';
      this.isHomeVisible = this.$route.path === '/';
      this.showFlexContainer = this.$route.path === '/';

    },
  },
}
</script>

<style>

body {
  font-family: 'Poppins', sans-serif;
}

h1, h2, h3, p{
  font-family: 'Poppins', sans-serif;
}

header {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  text-align: center;
  margin-bottom: 20px;
}
.containerWrapper {
  display: flex;
}

.statContainer {
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: auto;
  margin-bottom: 20px;

}

.componentsContainer {
  flex: 1 auto;
  align-items: center;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  padding: 20px;
  justify-content: center;
}


.component {
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin-right: 300px;

}
.chartImage {
  width: 100%;
  height: auto;
  max-width: 400px;
  max-height: 280px;
}
.center-text {
  text-align: center;
}
.home-button {
  position: fixed;
  top: 10px;
  left: 10px;
  margin: 10px;
  padding: 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
}
</style>
