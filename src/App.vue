<template>
  <div id="app">
      <header class="py-4 border-bottom" v-if="isHomeVisible">
        <h1 class="text-2xl text-center" > WASABI data set dashboard </h1>

      </header>
    <main class="flex flex-1">
        <div  class="flex flex-1 container  shadow-left flex-col square-container " v-show="isHomeVisible">
          <!-- Structure des 4 carrés avec chiffres et lignes -->
          <h2 text-white> Statistiques </h2>
          <div class="square"> <!-- Ajoutez des classes CSS pour les styles -->
            <div class="big-number"><b>156</b></div>
            <div class="lines">
              <p>ARTISTES</p>
            </div>
          </div>
          <div class="square"> <!-- Ajoutez des classes CSS pour les styles -->
            <div class="big-number"><b>4545</b></div>
            <div class="lines">
              <p>ARTISTES</p>
              <p>SOLOS</p>
            </div>
          </div>
          <div class="square"> <!-- Ajoutez des classes CSS pour les styles -->
            <div class="big-number"><b>454844</b></div>
            <div class="lines">
              <p>GROUPES</p>
              <p></p>
            </div>
          </div>
          <div class="square"> <!-- Ajoutez des classes CSS pour les styles -->
            <div class="big-number"><b>154545 %</b></div>
            <div class="lines">
              <p>ARTISTES</p>
              <p>ACTIFS</p>
            </div>
          </div>
        </div>
      <router-view @route-change="handleRouteChange"></router-view>
      <div v-show="showChartsButtons" class="componentsContainer">
        <div class="component" id="treemap">
          <router-link to="/treemap" v-on="hideStatistics">
            <img src="../public/data/treemap.png" alt="treemap" class="chartImage"/>
          </router-link>
        </div>
        <div class="component" id="component2">
          <router-link to="/pictogram">
            <img src="../public/data/pictogramChart.png" alt="pictogramchart" class="chartImage"/>
          </router-link>
        </div>
        <div class="component" id="component3">
          <router-link to="/sunburst">
            <img src="../public/data/treemap.png" alt="sunburst" class="chartImage"/>
          </router-link>
        </div>
        <div class="component" id="component4">
          <router-link to="/barchart">
            <img src="../public/data/treemap.png" alt="barchart" class="chartImage"/>
          </router-link>
        </div>
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
      // Masquer les statistiques lorsque la route change vers un autre composant que Home.vue
      this.isHomeVisible = false;
    },
  },
  data() {
    return {
      showChartsButtons: true,
      isHomeVisible:true,
    };
  },
  watch: {
    '$route'() {
      this.showChartsButtons = this.$route.path === '/';
      this.isHomeVisible = this.$route.path === '/';

    },
  },
}
</script>

<style>

header {
  font-family: 'Poppins', sans-serif;
  color: black;
  padding: 10px;
  text-decoration: underline;
  text-align: center;
}

.componentsContainer {
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

</style>
