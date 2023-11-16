<template>
  <div class="main-container">
    <div class="chart-details">
      <div class="pictogram-chart">
        <!-- Chart goes here -->
      </div>
      <div class="details-container">
        <!-- Genre and artist details go here -->
        <div class="genre-details">
          <!-- Content of genre details -->
        </div>
        <div class="artist-details">
          <!-- Content of artist details -->
        </div>
      </div>
    </div>
    <div class="legend-container">
      <!-- Legend content -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
