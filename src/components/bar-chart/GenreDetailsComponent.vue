<!-- GenreDetailsComponent.vue -->

<template>
  <div class="genre-details-container">
    <h2>Genre Details</h2>
    <div v-if="genreDetails">
      <p>Nombre de groupes: {{ genreDetails.nombre_groupes }} / Actifs: {{ genreDetails.nombre_actif_groupes }}</p>
      <p>Nombre de solos: {{ genreDetails.nombre_solos }} / Actifs: {{ genreDetails.nombre_actif_solos }}</p>
      <p>Nombre d'autres: {{ genreDetails.nombre_autres }} / Actifs: {{ genreDetails.nombre_actif_autres }}</p>
    </div>
    <div v-else>
      <p>Aucun détail disponible pour le genre sélectionné.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "GenreDetailsComponent",
  props: {
    genreDetails: Object, // Propriété pour recevoir les détails du genre depuis le composant parent
  },
};
</script>

<style scoped>
/* Styles spécifiques au composant GenreDetailsComponent */
.genre-details-container {
  margin-top: 20px;
}

h2 {
  font-size: 18px;
  margin-bottom: 10px;
}

p {
  font-size: 14px;
  margin: 5px 0;
}
</style>
