<template>
  <div class="filter-container">
    <label>
      <input type="radio" name="filterGroup" v-model="selectedFilter" value="all" @change="applyFilter"> All
    </label>
    <p>GENDER</p>
    <label>
      <input type="radio" name="filterGroup" v-model="selectedFilter" value="Female" @change="applyFilter"> Female
    </label>
    <label>
      <input type="radio" name="filterGroup" v-model="selectedFilter" value="Male" @change="applyFilter"> Male
    </label>
    <p>TYPE</p>
    <label>
      <input type="radio" name="filterGroup" v-model="selectedFilter" value="" @change="applyFilter"> Others
    </label>
    <label>
      <input type="radio" name="filterGroup" v-model="selectedFilter" value="Group" @change="applyFilter"> Group
    </label>
    <label>
      <input type="radio" name="filterGroup" v-model="selectedFilter" value="Person" @change="applyFilter"> Person
    </label>
  </div>
</template>

<script>

export default {
  name: 'FilterComponent',
  data() {
    return {
      selectedFilter: 'all', // Valeur par défaut
    };
  },
  methods: {
    applyFilter() {
      // Déterminez le filterType en fonction de la filterValue
      let filterType = null;
      const filterValue = this.selectedFilter;
      if (['all', 'Group', 'Person', ''].includes(this.selectedFilter)) {
        filterType = 'TYPE';
      } else if (['Female', 'Male'].includes(this.selectedFilter)) {
        filterType = 'GENDER';
      }

      // Émettez un événement pour informer le composant parent du changement de filtre
      this.$emit('apply-filter', { filterType, filterValue });
    },
  },
};
</script>

<style scoped>
.filter-container {
  display: flex;
  flex-direction: column;
  margin-right: 20px;
}

.filter-container label {
  margin-bottom: 5px;
}
</style>
