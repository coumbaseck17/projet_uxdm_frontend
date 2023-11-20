<template>
  <div>
    <div>
      <h1>{{ treemapTitle }}</h1>
    </div>
      <div>
        <div class="container">
          <div class="return-button">
            <img v-if="showReturnButton" src="../../../public/data/returnButton.png"
                 @click="handleReturnClick" alt="Description de l'image" width="30" height="30">
          </div>
          <div v-if="showCheckboxes" class="checkbox-container" >
            <h3 style="margin-right:10px" >Filtres: </h3>
            <div class="checkbox-item">
              <label class="styled-label" for="maCheckbox">Groups</label>
              <input type="checkbox" id="groupe" v-model="checkboxValues.group" class="styled-checkbox" @change="filtersTreemap" />
            </div>
            <div class="checkbox-item">
              <label class="styled-label" for="maCheckbox">Solo artists</label>
              <input type="checkbox" id="solo" v-model="checkboxValues.solo" class="styled-checkbox" @change="filtersTreemap" />
            </div>
            <div class="checkbox-item">
              <label class="styled-label" for="maCheckbox">Female</label>
              <input type="checkbox" id="femme" v-model="checkboxValues.female" class="styled-checkbox" @change="filtersTreemap" />
            </div>
            <div class="checkbox-item">
              <label class="styled-label" for="maCheckbox">Male</label>
              <input type="checkbox" id="home" v-model="checkboxValues.male" class="styled-checkbox" @change="filtersTreemap" />
            </div>
            <div class="checkbox-item">
              <label class="styled-label" for="maCheckbox">In activity</label>
              <input type="checkbox" id="enActivité" v-model="checkboxValues.inActivity" class="styled-checkbox" @change="filtersTreemap" />
            </div>
            <div class="checkbox-item">
              <label class="styled-label" for="maCheckbox">Not in activity</label>
              <input type="checkbox" id="pasenActivité" v-model="checkboxValues.careerEnded" class="styled-checkbox" @change="filtersTreemap" />
            </div>
          </div>
        </div>
      </div>
    <div class="chart-container">
      <div>
        <div class="treemap-chart"></div>
      </div>
      <div v-if="showArtistdetails" class="artist-details"></div>
    </div>

    <div id="tooltip"></div>
  </div>
</template>

<script>
import * as d3 from 'd3';
//import returnButton from '../../../public/data/returnButton.png';

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
      showArtist:false,
      showArtistdetails: false,
      showReturnButton: false,
      treemapTitle:null,
    };
  },

  async mounted() {
    try {
      const response1 = await fetch(
          "./data/details_v1/all_data_details.json"
      );
      this.data = await response1.json();
      this.createTreemap();
      this.returnButton();
    } catch (error) {
      console.error('Erreur lors de la récupération des données de l\'API : ', error);
    }
  },
  methods: {
    createTreemap() {
      this.treemapTitle= "Music genres 🎶"
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
          .style('fill', d => this.colorScaleGenre(d.data.name))
          .on('mouseover', (event, d) => this.showTooltip(event, d, "artistes"));


      // Add labels for genres and subgenres
      this.rectangles
          .append('text')
          .attr('x', 4)
          .attr('y', 30)
          .attr('fill', '#fff')

          .style('font-size', '30px')
          .text(d => d.data.name);

      //rectangles.on("click", this.treemapSubGenres);

      this.rectangles.on("click", function(e,d) {
        this.currentGenre = d.data.name;
        console.log(name)
        this.treemapSubGenres(this.currentGenre);
      }.bind(this));
    },

    updateTreemap(data, color, nameTooltip,textSize) {
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
          .attr('y', 20)
          .attr('fill', '#fff')
          .style('font-size', textSize)
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

      if(this.showArtist){
        console.log(data)
        this.showArtistdetails = true;
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

    treemapSubGenres(name) {
      this.treemapTitle=`${this.currentGenre} sub-genre `
      this.showGenres= true;
      this.showReturnButton= true;
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
      this.updateTreemap(root.descendants(),this.colorScaleSubgenre,"artistes","20px");

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
      this.treemapTitle = `${this.currentSubgenre} artists 🎤 `
      this.showArtist = true
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
      this.updateTreemap(root.leaves(),this.colorScaleArtist, "fans","14px")

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

    artistDetails(data) {
      console.log(data);
      var detailsContainer = d3.select(".artist-details");

      detailsContainer.html("");

      detailsContainer
          .append("img")
          .attr("src", "./data/marque-de-croix.png")
          .attr("alt", "Fermer")
          .style("cursor", "pointer")
          .style("float", "right")
          .style("margin", "10px")
          .attr("width", 30)
          .attr("height", 30)
          .on("click", function () {
            detailsContainer.html("");
          });

      var mainDiv = detailsContainer.append("div");

      mainDiv
          .append("h2")
          .text(data.data.name)
          .style("align-content", "center");

      var imageDiv = mainDiv
          .append("div")
          .style("text-align", "center")
          .style("margin-bottom", "10px");

      imageDiv
          .append("img")
          .attr("src", data.data.picture)
          .attr("alt", "Artist Image")
          .style("border-radius", "50%")
          .style("margin", "0 auto")
          .style("display", "block")
          .attr("width", 100)
          .attr("height", 100);

      mainDiv
          .append("div")
          .append("p")
          .text(data.data.deezerFans + " fans")
          .style("text-align", "center");

      if(data.data.lifeSpan.ended === true){
        mainDiv
            .append("div")
            .append("p")
            .text("Not in activity")
            .style("font-weight", "bold")
      }
      else{
        mainDiv
            .append("div")
            .append("p")
            .text("In activity")
            .style("font-weight", "bold")
      }

      mainDiv
          .append("div")
          .append("p")
          .text("Music genres: ")
          .append("p")
          .text(data.data.genres)
          .style("text-align", "center");

      mainDiv
          .append("div")
          .append("p")
          .text("Link to  ")
          .append("a")
          .attr("href", data.data.urlDeezer)
          .attr("target", "_blank")
          .text("Deezer");


      var albumsDiv = mainDiv.append("div");

      if (data.data.albums && data.data.albums.length > 0) {
        albumsDiv
            .append("h3")
            .text("Albums");

        albumsDiv
            .append("ul")
            .selectAll("li")
            .data(data.data.albums)
            .enter()
            .append("li")
            .text(function (d) {
              return d;
            })
            .style("text-align", "left");
      }

      var membersDiv = mainDiv.append("div");

      if (data.data.members && data.data.members.length > 0) {
        if(data.data.type==="Person"){
          membersDiv
              .append("h3")
              .text("Also member of: ");
        }
        else{
          membersDiv
              .append("h3")
              .text("Membres: ");
        }

        membersDiv
            .append("ul")
            .selectAll("li")
            .data(data.data.members)
            .enter()
            .append("li")
            .text(function (d) {
              return d;
            })
            .style("text-align", "left");
      }

    },

    handleReturnClick(){
      console.log(this.currentSubgenre)
      console.log(this.currentGenre)
      //si on est dans l'affichage des artistes
      if(this.currentSubgenre !== null && this.currentGenre !== null){
        this.currentSubgenre=null;
        this.showArtistdetails = false;
        this.showCheckboxes = false;
        this.showArtist = false;
        //const rectangles = d3.select('.treemap-chart').selectAll('rect');
        const svgElement = d3.select('.treemap-chart').select('svg');
        svgElement.remove();
        //rectangles.remove();
        this.createTreemap();
        this.treemapSubGenres(this.currentGenre);
      }
      //si on est dans l'affichage du sous genre
      else if(this.currentGenre !== null && this.currentSubgenre === null){
        this.showCheckboxes = false;
        this.currentGenre=null;
        this.currentSubgenre=null;
        this.showGenres= false;
        this.showReturnButton= false;
        this.showArtistdetails = false;
        const svgElement = d3.select('.treemap-chart').select('svg');
        svgElement.remove();
        this.createTreemap();
      }
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
  margin-left: 10px;
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

.chart-container {
  display: flex;
  justify-content: space-between;
}
.container{
  display: flex;
  margin-bottom: 20px;
}
.return-button{
  display: flex;
}
.checkbox-container {
  align-content: center;
  display: flex;
  align-items: center;
  margin-left: 100px;
  margin-right: 250px;
  width: 300px;
  height: 20px;
  border: 2px solid #cccccc; /* Bordure de 2 pixels en couleur grise */
  border-radius: 10px; /* Coins arrondis */
  padding: 10px; /* Espace intérieur de 10 pixels */
  overflow: hidden;
  flex-grow: 1;
}
.chart-container {
  align-content: baseline;
}
.chart-container {
  align-content: start;
}
.styled-checkbox {
  margin-right: 10px;
}
.styled-label {
  font-weight: bold;
}
</style>