<template>
  <div class="artist-details">
    <p>Liste des albums: {{ artist.albums.join(', ') }}</p>
    <p>Genre: {{ artist.gender }}</p>
    <p>Liste des genres: {{ artist.genres.join(', ') }}</p>
    <p>LifeSpan Ended: {{ artist.lifeSpan.ended ? 'Oui' : 'Non' }}</p>
    <p>Membres: {{ artist.members.join(', ') }}</p>
    <p>Image: <img :src="artist.picture" alt="Artist"></p>
    <p>Record Label: {{ artist.recordLabel }}</p>
    <p>Type: {{ artist.type }}</p>
    <p>URL Deezer: <a :href="artist.urlDeezer" target="_blank">{{ artist.urlDeezer }}</a></p>
  </div>
</template>

<script>
export default {
  name: 'ArtistDetailsComponent',
  props: {
    artist: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.artist-details {
  background-color: #f8f8f8;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.artist-details p {
  margin-bottom: 10px;
}

.artist-details img {
  max-width: 100%;
  height: auto;
}
</style>
