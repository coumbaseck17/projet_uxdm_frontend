<template>
  <br>
  <h3> {{ titre }} </h3>
  <br>
  <div class="container">
    <div class="return-button">
        <img src="../../../public/data/refresh2.png" alt="retour" @click="hundleReturn" width="30" height="30">
    </div>

  <div class="chart-container">

    <div>
      <div class="bar-chart" ref="detailsContainer" >
        </div>
    </div>

    <div>
      <div class="bar-chart-details" ref="detailsContainer2" >
      </div>
    </div>

    <div>
      <div class="bar-chart-artists" ref="detailsContainer3" >
        <div v-if="showCheckboxes" class="checkbox-container" >
          <h3 style="margin-right:10px" >Filtres: </h3>
          <label>
            <input type="checkbox" v-model="filterTypes.Group" @change="updateChart" :disabled="filterTypes.Person">
            Groupe
          </label>
          <label>
            <input type="checkbox" v-model="filterTypes.Person" @change="updateChart" :disabled="filterTypes.Group" >
            Solo
          </label>
          <label>
            <input type="checkbox" v-model="filterTypes.Male" @change="updateChart" :disabled="filterTypes.Female" >
            Homme
          </label>
          <label>
            <input type="checkbox" v-model="filterTypes.Female" @change="updateChart" :disabled="filterTypes.Male">
            Femme
          </label>
          <label>
            <input type="checkbox" v-model="filterTypes.inActivity" @change="updateChart" :disabled="filterTypes.careerEnded">
            In activity
          </label>
          <label>
            <input type="checkbox" v-model="filterTypes.careerEnded" @change="updateChart" :disabled="filterTypes.inActivity">
            Carred ended
          </label>
        </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="selectedArtist" class="fixed-info-column">
    <div class="artist-details" >
      <div class="centered">
        <img :src="selectedArtist.picture" alt="Artist" class="artist-image-small">
        <h2>{{ selectedArtist.name }}</h2>
      </div>
      <div class="artist-details-columns flex justify-between">
        <div class="details-column">
          <div class="detail-item">
            <p><b> {{ selectedArtist.deezerFans.toLocaleString() }}</b> FANS</p>
          </div>
          <div class="detail-item">
            <p><b>ACTIF : </b> {{ selectedArtist.lifeSpan.ended ? 'NON' : 'YES' }}</p>
          </div>
          <div class="detail-item" v-if=" selectedArtist.recordLabel && selectedArtist.recordLabel.length>0">
            <p><b>Label:</b> {{ Array.from(selectedArtist.recordLabel.values()).join(', ') }}</p>
          </div>
          <div class="detail-item" v-if="selectedArtist.albums.length>0">
            <p><b>Albums:</b></p>
            <ul class="albums-list">
              <li v-for="album in selectedArtist.albums" :key="album">{{ album }}</li>
            </ul>
          </div>
        </div>
        <div class="details-column">
          <div class="detail-item">
            <p> <b>GENRES :</b>{{ selectedArtist.genres.join('- ') }}</p>
          </div>
          <div class="detail-item">
            <p><b>GENDER:</b> {{ selectedArtist.gender }}</p>
          </div>
          <div class="detail-item empty-item">&nbsp;</div>
          <p><b>Lien Deezer:</b> <a :href="selectedArtist.urlDeezer">Deezer</a></p>
          <div class="detail-item"  v-if="selectedArtist.members.length>0">
            <p><b>Membres:</b></p>
            <ul class="members-list">
              <li v-for="member in selectedArtist.members" :key="member">{{ member }}</li>
            </ul>
          </div>
        </div>
      </div>
    <!-- ... Ajoutez d'autres éléments si nécessaire ... -->
  </div>
<!--  </div>-->
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: 'BarChart',
  data() {
    return {
      data: null,
      genres: null,
      subgenres: null,
      genreDetails: null,
      titre: null,
      genreSelected: null,
      artists: null,
      colorSelected: null,
      showCheckboxes: false,
      filterTypes: {
        Group: false,
        Person: false,
        Male : false,
        Female : false,
        inActivity: false,
        careerEnded: false
      },
      barchart :  null,
      subgenreSelected : null,
      selectedArtist : null,
      clickedArtist : false,
      isCheckboxDisabledEnded : false,
      isCheckboxDisabledActivity : false,
      isCheckboxDisabledFemale : false,
      isCheckboxDisabledMale : false,
      isCheckboxDisabledPerson : false,
      isCheckboxDisabledGroup : false,

    };
  },

  async mounted() {
    try {
      const response = await fetch("./data/details_v1/all_data_details.json")
      this.data = await response.json();
      this.drawChart();
    } catch (error) {
      console.error('Erreur lors de la récupération des données de l\'API : ', error);
    }

  },

  methods: {
    async drawChart() {

      this.titre = "Genres";

      if (!this.data || !this.data.genres) {
        return;
      }


      const width = 600;
      const height = 500;
      const margin = {top: 20, right: 20, bottom: 30, left: 60};
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;


      this.genres = Object.keys(this.data.genres).sort((a, b) => {
        return this.data.genres[b].details.nombre_artists_total - this.data.genres[a].details.nombre_artists_total;
      });


      const svg = d3.select('.bar-chart').append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', `translate(${margin.left}, ${margin.top})`)
      ;

      const colorScale = d3.scaleOrdinal(d3.schemeSpectral[this.genres.length]);

      // Create the scales
      const xScale = d3.scaleLinear()
          .domain([0, d3.max(this.genres, (genre) => this.data.genres[genre].details.nombre_artists_total)])
          .range([0, innerWidth]);

      const yScale = d3.scaleBand()
          .domain(this.genres)
          .range([0, innerHeight])
          .padding(0.1);

      // Create the axes
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      // Append the axes to the SVG
      svg.append('g')
          .attr('transform', `translate(0, ${innerHeight})`)
          .call(xAxis);
      svg.append('g')
          .call(yAxis);

      // create a tooltip
      var tooltip = d3.select(".bar-chart")
          .append("div")
          .style("position", "absolute")
          .style("background-color", "white")
          .style("border", "solid")
          .style("border-width", "2px")
          .style("border-radius", "5px")
          .style("padding", "5px")
          .style("visibility", "hidden")


      // Append the bars
      svg.selectAll('rect')
          .data(this.genres)
          .enter()
          .append('rect')
          .attr('x', 0)
          .attr('y', (genre) => yScale(genre))
          .attr('width', (genre) => xScale(this.data.genres[genre].details.nombre_artists_total))
          .attr('height', yScale.bandwidth())
          .attr('fill', (genre) => colorScale(genre))
          .on('mouseover', (event, genre) => {
            const dataDetails = this.data.genres[genre].details;
            const toolDetails = genre + " <br> nombre d'artistes total :  " + dataDetails.nombre_artists_total + ' <br> nombre de groupe :  '
                + dataDetails.nombre_groupes + "  <br> nombre de solo :  " + dataDetails.nombre_solos + " <br> nombre d'artistes actif total " +
                dataDetails.nombre_actif_total;
            tooltip.html(toolDetails).style("visibility", "visible").style("color", "black")
                .style("border-color", colorScale(genre));
          })
          .on("mousemove", function () {
            return tooltip.style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
          })
          .on('mouseout', function () {
            return tooltip.style("visibility", "hidden");
          })
          .on('click', (event, genre) => {
            this.colorSelected = colorScale(genre);
            this.showSubgenres(genre, this.colorSelected);
            return tooltip.style("visibility", "hidden");
          });

      // Append the labels
      svg.selectAll('text')
          .data(this.genres)
          .enter()
          .append('text')
          .text((genre) => `${genre} - ${this.data.genres[genre].details.nombre_artists_total}`)
          .attr('x', (genre) => xScale(this.data.genres[genre].details.nombre_artists_total) + 5)
          .attr('y', (genre) => yScale(genre) + yScale.bandwidth() / 2)
          .attr('dy', '.35em')
          .style('font-size', '30px')
          .style('fill', 'black')
          .style('text-anchor', 'start');

    },


    //afficher les sous genres
    showSubgenres(genre, color) {

      this.titre = "Sous-genres de " + genre;

      // Supprimer le graphique précédent
      d3.select('svg').remove();

      const width = 600;
      const height = 500;
      const margin = {top: 20, right: 20, bottom: 30, left: 90};
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      this.genreDetails = this.data.genres[genre];
      this.subgenres = Object.keys(this.genreDetails.subgenres).sort((a, b) => {
        return this.genreDetails.subgenres[b].nombre_artists_total - this.genreDetails.subgenres[a].nombre_artists_total;
      });


      // Créer le SVG
      const svg = d3.select('.bar-chart-details').append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', `translate(${margin.left}, ${margin.top})`);

      // Create the scales
      const xScale = d3.scaleLinear()
          .domain([0, d3.max(this.subgenres, (subgenre) => this.data.genres[genre].subgenres[subgenre].details.nombre_artists_total)])
          .range([0, innerWidth]);


      const yScale = d3.scaleBand()
          .domain(this.subgenres)
          .range([0, innerHeight])
          .padding(0.1);

      // Create the axes
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      // create a tooltip
      var tooltip = d3.select(".bar-chart-details")
          .append("div")
          .style("position", "absolute")
          .style("background-color", "white")
          .style("border", "solid")
          .style("border-width", "2px")
          .style("border-radius", "5px")
          .style("padding", "5px")
          .style("visibility", "hidden")

      // Append the axes to the SVG
      svg.append('g')
          .attr('transform', `translate(0, ${innerHeight})`)
          .call(xAxis);

      svg.append('g')
          .call(yAxis);

      // Append the bars
      svg.selectAll('rect')
          .data(this.subgenres)
          .enter()
          .append('rect')
          .attr('x', 0)
          .attr('y', (subgenre) => yScale(subgenre))
          .attr('width', (subgenre) => xScale(this.genreDetails.subgenres[subgenre].details.nombre_artists_total))
          .attr('height', yScale.bandwidth())
          .attr('fill', () => color)
          .on('mouseover', (event, subgenre) => {
            const dataDetails = this.genreDetails.subgenres[subgenre].details;
            const toolDetails = subgenre + " <br> nombre d'artistes total :  " + dataDetails.nombre_artists_total + ' <br> nombre de groupe :  '
                + dataDetails.nombre_groupes + "  <br> nombre de solo :  " + dataDetails.nombre_solos + " <br> nombre d'artistes actif total " +
                dataDetails.nombre_actif_total;
            tooltip.html(toolDetails).style("visibility", "visible").style("color", "black")
                .style("border-color", color);
          })
          .on("mousemove", function () {

            return tooltip.style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
          })
          .on('mouseout', function () {
            return tooltip.style("visibility", "hidden");
          })
          .on('click', (event, subgenre) => {
            this.genreSelected = genre;
            this.colorSelected = color;
            this.showArtists(subgenre, this.genreSelected, this.colorSelected);
            tooltip.style("visibility", "hidden");

          });


      // Append the labels
      svg.selectAll('text')
          .data(this.subgenres)
          .enter()
          .append('text')
          .text((subgenre) => `${subgenre} - ${this.data.genres[genre].subgenres[subgenre].details.nombre_artists_total}`)
          .attr('x', (subgenre) => xScale(this.data.genres[genre].subgenres[subgenre].details.nombre_artists_total) + 5)
          .attr('y', (subgenre) => yScale(subgenre) + yScale.bandwidth() / 2)
          .attr('dy', '.35em')
          .style('font-size', '30px')
          .style('fill', 'black')
          .style('text-anchor', 'start');

    },

    //afficher les artistes
    async showArtists(subgenre, genre, color) {

      this.showCheckboxes = true;

      this.genreSelected = genre;
      this.subgenreSelected = subgenre;


      this.titre = "Artistes de " + subgenre + " - " + genre;


      const encodedGenre = encodeURIComponent(genre);
      const encodedSubgenre = encodeURIComponent(subgenre);
      const url = `data/artists_by_genre_sorted_v1/${encodedGenre}/${encodedSubgenre}.json`;
      const response = await fetch(url);
      this.data = await response.json();


      d3.select('svg').remove();

      this.artists = Object.keys(this.data).sort((a, b) => {
        return this.data[b].deezerFans - this.data[a].deezerFans;
      });


      const width = 800;
      const margin = {top: 20, right: 20, bottom: 30, left: 50};
      const innerWidth = width - margin.left - margin.right;


      // Create the scales
      const xScale = d3.scaleLinear()
          .domain([0, d3.max(this.data, (artist) => artist.deezerFans)])
          .range([0, innerWidth]);

      const yScale = d3.scaleBand()
          .domain(this.data.map(artist => artist.name))
          .range([0, this.data.length * 15 ])
          .padding(0.3);

      // Create the SVG
      const svg = d3.select('.bar-chart-artists').append('svg')
          .attr('width', width)
          .attr('height', this.data.length * 15 + margin.top + margin.bottom)
          .append('g')  // Ajout d'un groupe pour appliquer les marges
          .attr('transform', `translate(150, ${margin.top})`);

      // Create the axes
      const yAxis = d3.axisLeft(yScale);

      // create a tooltip
      var tooltip = d3.select(".bar-chart-artists")
          .append("div")
          .style("position", "absolute")
          .style("background-color", "white")
          .style("border", "solid")
          .style("border-width", "2px")
          .style("border-radius", "5px")
          .style("padding", "5px")
          .style("visibility", "hidden");


      svg.append('g')
          .attr('class', 'y-axis')
          .call(yAxis);



      svg.selectAll('rect')
          .data(this.artists)
          .enter()
          .append('rect')
          .attr('x', 0)
          .attr('y', (id) => yScale(this.data[id].name))
          .attr('width', (id) => xScale(this.data[id].deezerFans))
          .attr('height', yScale.bandwidth())
          .attr('fill', () => color)
          .on('mouseover', (event,id) => {
            this.clickedArtist = true;
            const artist = this.data[id];
            this.showArtistSelected(artist);
            const toolDetails = artist.name + "<br>" + artist.deezerFans + " fans sur Deezer"
                + "<br>" + artist.nombre_albums + " albums ";
            tooltip.html(toolDetails).style("visibility", "visible").style("color", "black")
                .style("border-color", color);
          })
          .on("mousemove", function () {

            return tooltip.style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
          })
          .on('mouseout', function () {
            return tooltip.style("visibility", "hidden");
          })
          .on('click', (event,id) => {
            this.clickedArtist = true;
            const artist = this.data[id];
            this.showArtistSelected(artist);
            return tooltip.style("visibility", "hidden");
          });

      svg.selectAll('.y-axis .tick text')
          .on('mouseover',  (event, name)=>{
            const artist = this.data.find(artist => artist.name === name);
            this.clickedArtist = true;
            this.showArtistSelected(artist);
            const toolDetails = artist.name + "<br>" + artist.deezerFans + " fans sur Deezer "
            + "<br>" + artist.nombre_albums + " albums ";
            tooltip.html(toolDetails).style("visibility", "visible").style("color", "black")
                .style("border-color", color);
          })
          .on("mousemove", function () {

            return tooltip.style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
          })
          .on('mouseout', function () {
            return tooltip.style("visibility", "hidden");
          })
          .on('click', (event,name) => {
            this.clickedArtist = true;
            const artist = this.data.find(artist => artist.name === name);
            this.showArtistSelected(artist);
            return tooltip.style("visibility", "hidden");
          });



    },


    // Méthode pour obtenir les filtres cochés
    getCheckedFilters() {
      return Object.keys(this.filterTypes).filter(key => this.filterTypes[key]);
    },

    // Méthode pour filtrer les données en fonction des filtres cochés
    filterDataByCheckedValues(data, filterTypes) {
      let key;
      let filteredData = [...data];
      console.log(filteredData);
      filterTypes.forEach(value => {
        if (value === 'Group') {
          key = 'type';
          filteredData = filteredData.filter(item => item[key]=== 'Group');
        }
        if (value === 'Person') {
          key = 'type';
          filteredData = filteredData.filter(item => item[key] === 'Person');
        }
        if (value === 'Male') {
          key = 'gender';
          filteredData = filteredData.filter(item => item[key] === 'Male');
        }
        if (value === 'Female') {
          key = 'gender';
          filteredData = filteredData.filter(item => item[key] === 'Female' && item[key] !== '');
        }
        if (value === 'inActivity') {
          key = 'lifeSpan';
          filteredData = filteredData.filter(item => !item[key].ended);
        }
        if (value === 'careerEnded') {
          key = 'lifeSpan';
          filteredData = filteredData.filter(item => item[key].ended);
        }
      });

      return filteredData;
    },



    // Méthode pour mettre à jour le graphique en fonction des filtres actuels
    async updateChart() {
      if (this.filterTypes.Group) {
        // Si la case à cocher "Group" est cochée, désactivez les autres cases à cocher
        this.filterTypes.Person = false;
        this.filterTypes.Male = false;
        this.filterTypes.Female = false;
      }

      const encodedGenre = encodeURIComponent(this.genreSelected);
      const encodedSubgenre = encodeURIComponent(this.subgenreSelected);
      const url = `data/artists_by_genre_sorted_v1/${encodedGenre}/${encodedSubgenre}.json`;
      const response2 = await fetch(url);

      const dataF = await response2.json();
      console.log(dataF)

      // Filtrer les données en fonction des filtres actuels
      const dataUpdated = this.filterDataByCheckedValues(dataF, this.getCheckedFilters());

      console.log(dataUpdated)
      // Mettre à jour le graphique avec les données filtrées
      this.updateBars(dataUpdated);
    },


    // Méthode pour mettre à jour les barres du graphique
    updateBars(data) {

      // create a tooltip
      var tooltip = d3.select(".bar-chart-artists")
          .append("div")
          .style("position", "absolute")
          .style("background-color", "white")
          .style("border", "solid")
          .style("border-width", "2px")
          .style("border-radius", "5px")
          .style("padding", "5px")
          .style("visibility", "hidden");

      const bars = d3.select('.bar-chart-artists')
          .selectAll('rect');

      this.titre = this.genreSelected + " - " + this.subgenreSelected + "(" + this.getCheckedFilters()  + ")";

      const xScale = d3.scaleLinear()
          .domain([0, d3.max(data, artist => artist.deezerFans)])
          .range([0, innerWidth]);

      const yScale = d3.scaleBand()
          .domain(data.map(artist => artist.name))
          .range([0, data.length * 15])
          .padding(0.3);


      const existingBars = bars.data(data);


      existingBars.exit().remove();



      existingBars.transition()
          .duration(500)
          .attr('y', artist => yScale(artist.name))
          .attr('width', artist => xScale(artist.deezerFans))
          .attr('height', yScale.bandwidth());


      d3.select('.bar-chart-artists').select('.y-axis')
          .transition()
          .duration(500)
          .call(d3.axisLeft(yScale));


      d3.select('.y-axis').selectAll('text')
          .on('mouseover', (event, index) => {

            const artist = data.find(artist => artist.name === index);
            this.clickedArtist = true;
            this.showArtistSelected(artist);

            const toolDetails = artist.name + "<br>" + artist.deezerFans + " fans sur Deezer"
                + "<br>" + artist.nombre_albums + " albums ";
           return  tooltip.html(toolDetails).style("visibility", "visible").style("color", "black")
                .style("border-color", this.colorSelected);

          })
          .on("mousemove", function () {

            return tooltip.style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
          })
          .on('mouseout', function () {
            return tooltip.style("visibility", "hidden");
          })
          .on('click', (event,index) => {
            this.clickedArtist = true;
            const artist = data.find(artist => artist.name === index);
            this.showArtistSelected(artist);
            return tooltip.style("visibility", "hidden");
          });

      existingBars.on('mouseover', (event, artist) => {

        this.showArtistSelected(artist);
            const toolDetails = artist.name + "<br>" + artist.deezerFans + " fans sur Deezer"
                + "<br>" + artist.nombre_albums + " albums ";
            tooltip.html(toolDetails)
                .style("visibility", "visible")
                .style("color", "black")
                .style("border-color", this.colorSelected);
          })
          .on("mousemove", function () {
            return tooltip.style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
          })
          .on('mouseout', function () {
            return tooltip.style("visibility", "hidden");
          })
          .on('click', (event,artist) => {
            this.showArtistSelected(artist);
            return tooltip.style("visibility", "hidden");
          });



      // Ajoutez de nouvelles barres pour les nouvelles données
      existingBars.enter()
          .append('rect')
          .attr('y', artist => yScale(artist.name))
          .attr('width', artist => xScale(artist.deezerFans))
          .attr('height', yScale.bandwidth())
          .style('fill', 'steelblue');

      // Supprimez les barres qui ne correspondent plus aux données
      existingBars.exit().remove();
    },

    showArtistSelected(artist) {
      console.log('click' + artist);
      this.clickedArtist = true;
      this.selectedArtist = artist;
      return this.selectedArtist;
    },

    hundleReturn() {
      window.location.reload();
    }



  },





};


</script>

<style scoped>

h3 {
  text-align: center;
  font-size: 30px;
  font-weight: bold;
  color: black;
}

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
}


.bar-chart-artists {
  color: black;
  width: 100%;
  height: 100%;
  overflow: auto;
}


svg {
  width: 100%;
  height: 100%;
}

.checkbox-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 600px;
  height: 20px;
  border: 2px solid #cccccc;
  border-radius: 10px;
  padding: 10px;
  overflow: hidden;
  margin-left: auto;
  margin-right: auto;
}

.fixed-info-column {
  position: fixed;
  top: 10%;
  right: 0;
  border-color: black;
  width: 300px;
  padding: 20px;
  height: 600px;
  border: 3px solid ;
  border-radius: 25px;
  overflow-y: auto;

}
.return-button{
  border-color: white;
  background-color: white;
}




</style>
