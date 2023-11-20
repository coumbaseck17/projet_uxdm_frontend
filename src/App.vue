<template>
  <div id="app">
    <header>
      <h1>Data visualisation on WASABI data set</h1>
    </header>
    <main>
      <router-view></router-view>
      <div v-show="showChartsButtons" class="componentsContainer">
        <div class="component" id="treemap">
          <router-link to="/treemap">
            <img src="../public/data/treemap.png" alt="treemap" class="chartImage" />
          </router-link>
        </div>
        <div class="component" id="component2">
          <router-link to="/pictogram">
            <img src="../public/data/treemap.png" alt="pictogramchart" class="chartImage" />
          </router-link>
        </div>
        <div class="component" id="component3">
          <router-link to="/sunburst">
            <img src="../public/data/treemap.png" alt="sunburst" class="chartImage" />
          </router-link>
        </div>
        <div class="component" id="component4">
          <router-link to="/barchart">
            <img src="../public/data/treemap.png" alt="barchart" class="chartImage" />
          </router-link>
        </div>
      </div>

    </main>
  </div>
</template>

<script>

import router from '@/router';
export default {
  name: 'App',
  router,
  data() {
    return {
      showChartsButtons: true,
    };
  },
  watch: {
    '$route'() {
      this.showChartsButtons = this.$route.path === '/';
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

.componentsContainer{
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
}

.chartImage {
  width: 100%;
  height: auto;
  max-width: 400px;
  max-height: 280px;
}
</style>
