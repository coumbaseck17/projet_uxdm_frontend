<template>
  <div>
    <div v-if="showCheckboxes" >
      <label for="maCheckbox">Groupe</label>
      <input type="checkbox" id="groupe" v-model="checkboxValues.group" @change="filtersTreemap" />
      <label for="maCheckbox">Solo</label>
      <input type="checkbox" id="solo" v-model="checkboxValues.solo" @change="filtersTreemap" />
      <label for="maCheckbox">Femmes</label>
      <input type="checkbox" id="femme" v-model="checkboxValues.female" @change="filtersTreemap" />
      <label for="maCheckbox">Hommes</label>
      <input type="checkbox" id="home" v-model="checkboxValues.male" @change="filtersTreemap" />
      <label for="maCheckbox">En activité</label>
      <input type="checkbox" id="enActivité" v-model="checkboxValues.inActivity" @change="filtersTreemap" />
      <label for="maCheckbox">Pas en activité</label>
      <input type="checkbox" id="pasenActivité" v-model="checkboxValues.careerEnded" @change="filtersTreemap" />
    </div>
    <div>
      <div class="treemap-chart"></div>
      <div  class="artist-details"></div>
    </div>
    <div id="tooltip"></div>
  </div>
</template>

<script>
import * as d3 from 'd3';
//import data from "core-js/internals/array-iteration";

export default {
  name: 'TreeMap',
  // the component's data
  data() {
    return {
      data: null,
      dataDetails: null,
      width: 1000,
      height: 800,
      colorScaleGenre: d3.scaleOrdinal(['#D50000', '#C51162', '#4A148C', '#0D47A1', '#004D40', '#1B5E20', '#F9A825', '#E65100', '#BF360C']), // Échelle de couleurs pour les genres
      colorScaleSubgenre: null,
      colorScaleArtist: d3.scaleOrdinal(d3.schemeCategory10),
      treemap: null,
      currentSvg: null,
      artistList: false,
      rectangles: null,
      currentFill: null,
      currentGenre:null,
      currentSubgenre:null,
      currentArtist:null,
      checkboxValues: {
        Group: false,
        Solo: false,
        Male: false,
        Female: false,
        inActivity: false,
        careerEnded: false
      },
      showGenres: false,
      showCheckboxes: false,
      showArtistdetails: false,
    };
  },

  async mounted() {
    try {
      const response1 = await fetch(
          "./data/details_v1/all_data_details.json"
      );
      this.data = await response1.json();
      this.createTreemap();
    } catch (error) {
      console.error('Erreur lors de la récupération des données de l\'API : ', error);
    }
  },
  methods: {
    createTreemap() {
      if (!this.data || !this.data.genres) {
        return;
      }

      const hierarchy = {
        name: 'root',
        children: Object.keys(this.data.genres).map(genre => ({
          name: genre,
          children: Object.keys(this.data.genres[genre].subgenres).map(subgenre => ({
            name: subgenre,
            value: this.data.genres[genre].subgenres[subgenre].details.nombre_artists_total,
          })),
        })),
      };

      this.treemap = d3.treemap()
          .size([this.width, this.height])
          .padding(1)
          .round(true);

      const root = d3.hierarchy(hierarchy)
          .sum(d => d.value)
          .sort((a, b) => b.value - a.value);

      this.treemap(root);


      this.currentSvg = d3.select('.treemap-chart')
          .append('svg')
          .attr('width', this.width)
          .attr('height', this.height);

      // Add rectangles for genres and subgenres
      this.rectangles = this.currentSvg.selectAll('rect')
          .data(root.children)
          .enter()
          .append('g')
          .attr('transform', d => `translate(${d.x0},${d.y0})`);

      this.rectangles
          .append('rect')
          .attr('width', d => d.x1 - d.x0)
          .attr('height', d => d.y1 - d.y0)
          .style('stroke', '#fff')
          .style('fill', d => this.colorScaleGenre(d.data.name));


      // Add labels for genres and subgenres
      this.rectangles
          .append('text')
          .attr('x', 4)
          .attr('y', 14)
          .attr('fill', '#fff')
          .style('font-size', '12px')
          .text(d => d.data.name);

      //rectangles.on("click", this.treemapGenre);

      this.rectangles.on("click", function(e,d) {
        this.currentGenre = d.data.name;
        console.log(name)
        this.treemapGenre(this.currentGenre);
      }.bind(this));
    },

    updateTreemap(data, color, nameTooltip) {
      // Update existing rectangles
      const update = this.rectangles.data(data, d => d.data.name);
      console.log(data)
      // Enter new rectangles
      const enter = update.enter().append('g')
          .attr('transform', d => `translate(${d.x0},${d.y0})`);

      enter.append('rect')
          .attr('width', 0)  // Initially set width to 0
          .attr('height', 0) // Initially set height to 0
          .style('stroke', '#fff')
          .style('fill', d => {
            // Stockez la couleur dans la variable
            this.currentFill = color(d.data.name);
            return this.currentFill;
          })
          .on('mouseover', (event, d) => this.showTooltip(event, d, nameTooltip));

      enter.append('text')
          .attr('x', 4)
          .attr('y', 14)
          .attr('fill', '#fff')
          .style('font-size', '12px')
          .text(d => d.data.name);

      // Merge updated and new rectangles
      const merged = update.merge(enter);

      // Transition to new dimensions
      merged.transition()
          .duration(500)  // Adjust the duration as needed
          .attr('transform', d => `translate(${d.x0},${d.y0})`)
          .select('rect')
          .attr('width', d => d.x1 - d.x0)
          .attr('height', d => d.y1 - d.y0);

      // Remove rectangles that are no longer needed
      update.exit().remove();

      // Update click behavior
      if(this.showGenres){
        merged.on("click", this.handleTreemapClick.bind(this, this.showArtistList));
      }

      if(this.showArtistdetails){
        console.log(data)
        merged.on("click", (event, d) => this.handleTreemapDetails(event, d));
      }
    },

    handleTreemapClick(showArtistList, event, data) {
      const genre = this.currentGenre; // Assuming this.currentGenre is set elsewhere
      const subgenre = data.data.name;
      this.currentSubgenre = subgenre// Assuming you want to pass the subgenre clicked
      showArtistList(genre, subgenre, this.currentFill);
    },


    handleTreemapDetails(event, data){
       // Assuming this.currentGenre is set elsewhere
      const artist = data.data.name;
      this.currentArtist= artist;// Assuming you want to pass the subgenre clicked
      console.log(this.currentArtist);
      this.artistDetails(data);
    },

    treemapGenre(name) {
      this.showGenres= true;
      this.getColorScale(name);

      const hierarchy = {
        name: 'root',
        children: Object.keys(this.data.genres[name].subgenres).map(subgenre => ({
          name: subgenre,
          value: this.data.genres[name].subgenres[subgenre].details.nombre_artists_total,
        })),
      };

      const root = d3.hierarchy(hierarchy)
          .sum(d => d.value)
          .sort((a, b) => b.value - a.value);
      console.log(root.descendants())

      this.treemap(root);
      // Mise à jour du treemap au lieu de le recréer
      this.updateTreemap(root.descendants(),this.colorScaleSubgenre,"artistes");

      console.log(this.currentGenre)

    },


    showTooltip(event, data, nameValue) {
      const tooltip = d3.select('#tooltip');

      // Positionner la zone de texte
      tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 20) + 'px')
          .style('opacity', 1)
          .html(`<strong>${data.data.name}</strong><br>${data.value} ${nameValue}`);

      // Ajouter un événement pour masquer la zone de texte au survol
      d3.select('body')
          .on('mousemove', () => tooltip.style('left', (event.pageX + 10) + 'px')
              .style('top', (event.pageY - 20) + 'px'))
          .on('mouseout', () => tooltip.style('opacity', 0));
    },


    async showArtistList(genre, subgenre, colorF){
      this.showArtistdetails = true
      this.showCheckboxes = true;

      const response2 = await fetch(
          `./data/artists_by_genre_sorted_v1/${genre}/${subgenre}.json`

      );
      this.dataDetails = await response2.json();

      if (!this.dataDetails ) {
        return;
      }

      this.treemap = d3.treemap()
          .size([this.width, this.height])
          .padding(1)
          .round(true);

      const hierarchy2 = {
        name: 'root',
        children: this.dataDetails,
      };

      const root = d3.hierarchy(hierarchy2)
          .sum(d => d.deezerFans)
          .sort((a, b) => b.deezerFans - a.deezerFans);

      console.log(colorF)

      this.treemap(root);


      this.colorScaleArtist = d3.scaleOrdinal([`${colorF}`])
      this.updateTreemap(root.leaves(),this.colorScaleArtist, "fans")


      /**this.rectangles.on("click", function(e,d) {
        let nameArt = d.dataDetails;
        console.log(nameArt)
      }.bind(this));*/

    },


    getColorScale(genreName){
      if (genreName === "Rock") {
        this.colorScaleSubgenre = d3.scaleOrdinal(['#FFCDD2', '#EF9A9A', '#E57373','#EF5350','#F44336','#E53935','#D32F2F','#C62828','#B71C1C','#FF1744']);
      }
      else if (genreName === "Pop") {
        this.colorScaleSubgenre = d3.scaleOrdinal(['#F8BBD0', '#F48FB1', '#F06292','#EC407A','#E91E63','#D81B60','#C2185B','#AD1457','#880E4F']);
      }
      else if (genreName === "Folk") {
        this.colorScaleSubgenre = d3.scaleOrdinal(['#CE93D8', '#BA68C8', '#AB47BC','#8E24AA','#7B1FA2','#6A1B9A']);
      }
      else if (genreName === "R&B") {
        this.colorScaleSubgenre = d3.scaleOrdinal(['#2962FF', '#448AFF', '#82B1FF']);
      }
      else if (genreName === "Electronic") {
        this.colorScaleSubgenre = d3.scaleOrdinal(['#A7FFEB', '#4DB6AC', '#00897B']);
      }
      else if (genreName === "Blues") {
        this.colorScaleSubgenre = d3.scaleOrdinal(['#A5D6A7', '#43A047']);
      }
      else if (genreName === "Hip Hop") {
        this.colorScaleSubgenre = d3.scaleOrdinal(['#FFEA00', '#FFD600']);
      }
      else if (genreName === "Jazz") {
        this.colorScaleSubgenre = d3.scaleOrdinal(['#FFB74D', '#F57C00']);
      }
      else if (genreName === "Country") {
        this.colorScaleSubgenre = d3.scaleOrdinal(['#FF8A65', '#FF5722', '#D84315']);
      }
    },


    filterDataByCheckedValues(data, checkboxValues) {
      let key;
      let filteredData = [...data];

      checkboxValues.forEach(value => {
        if(value === 'group') {
          key= 'type';
          filteredData = filteredData.filter(item => item[key] === 'Group');
        }
        if(value === 'solo') {
          key= 'type';
          filteredData = filteredData.filter(item => item[key] === 'Person');
        }
        if (value === 'male'){
          key= 'gender';
          filteredData = filteredData.filter(item => item[key] === 'Male');
        }
        if(value === 'female') {
          key= 'gender';
          filteredData = filteredData.filter(item => item[key] === 'Female');
        }
        if (value === 'inActivity'){
          key= 'lifeSpan';
          filteredData = filteredData.filter(item => item[key].ended === false);
        }
        if (value === 'careerEnded'){
          key= 'lifeSpan';
          filteredData = filteredData.filter(item => item[key].ended === true);
        }

      });

      return filteredData;
    },


    async filtersTreemap(){
      this.artistList = true;
      const checkedValues = Object.keys(this.checkboxValues).filter(key => this.checkboxValues[key]);
      console.log(checkedValues)
      console.log(this.currentGenre,this.currentSubgenre )
      const response2 = await fetch(
          `./data/artists_by_genre_sorted_v1/${this.currentGenre}/${this.currentSubgenre}.json`
      );

      this.dataDetails = await response2.json();
      console.log(this.dataDetails)
      const filteredData = this.filterDataByCheckedValues(this.dataDetails, checkedValues);

      console.log(filteredData)

      if (!this.dataDetails ) {
        return;
      }

      const hierarchy2 = {
        name: 'root',
        children: filteredData,
      };

      const root = d3.hierarchy(hierarchy2)
          .sum(d => d.deezerFans)
          .sort((a, b) => b.deezerFans - a.deezerFans);
      console.log(root)

      this.treemap(root);


      this.updateTreemap(root.descendants(), this.colorScaleArtist, 'fans');

    },

    artistDetails(data){
      console.log(data)
      var detailsContainer = d3.select(".artist-details");

      // Effacez le contenu précédent
      detailsContainer.html("");

      detailsContainer
          .append("img")
          .attr("src", data.data.picture) // Assurez-vous d'avoir une propriété imageURL dans vos données d'artiste
          .attr("alt", "Artist Image")
          .style("float", "left")// Utilisez float pour aligner l'image à gauche
          .style("border-radius", "50%")
          .style("margin-right", "10px")
          .style("margin-left", "10px");
      // Ajoutez les détails de l'artiste au conteneur
      detailsContainer
          .append("h2")
          .text(data.data.name);

      detailsContainer
          .append("p")
          .text("Fans: " + data.data.deezerFans)
      detailsContainer
          .append("a")
          .attr("href", data.data.urlDeezer)



      if (data.data.albums && data.data.albums.length > 0) {
        detailsContainer
            .append("div")
            .append("h3")
            .text("Albums");

        detailsContainer
            .select("div")  // Sélectionnez la div ajoutée pour les albums
            .append("ul")
            .selectAll("li")
            .data(data.data.albums)
            .enter()
            .append("li")
            .text(function(d) {
              return d;
            });
      }

      // Ajoutez d'autres détails selon vos besoins
    },
  },


};
</script>

<style scoped>
.treemap-chart {
  text-align: center;
}

.treemap-chart svg {
  overflow: visible;
}

.treemap-chart rect {
  stroke: #fff;
  fill-opacity: 0.8;
  transition: fill-opacity 0.3s ease-in-out;
}

.treemap-chart rect:hover {
  fill-opacity: 1;
}


#tooltip {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 12px;
  opacity: 0;
}
.artist-details {
  border: 2px solid #ccc; /* Bordure de 2 pixels en couleur grise */
  border-radius: 10px; /* Coins arrondis */
  padding: 10px; /* Espace intérieur de 10 pixels */
  overflow: hidden; /* Cache le débordement au cas où l'image est plus grande */
}

.artist-details img {
  border-radius: 100%; /* Coins arrondis pour l'image (effet d'image circulaire) */
  float: left; /* Aligne l'image à gauche */
  margin-right: 10px; /* Marge à droite de l'image pour l'espacement */
}
</style>