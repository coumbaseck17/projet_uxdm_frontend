<template>
  <br>
  <h3> {{ titre }} </h3>
  <br>
  <div class="container">
    <div class="return-button">
<!--      <img v-if="showCheckboxes" @click="handleReturnClick" alt="Description de l'image" width="30" height="30">-->
    </div>
    <div v-if="showCheckboxes" class="checkbox-container" >
      <h3 style="margin-right:10px" >Filtres: </h3>
      <label>
        <input type="checkbox" v-model="filterTypes.Group" @change="updateChart">
       Groupe
      </label>
      <label>
        <input type="checkbox" v-model="filterTypes.Person" @change="updateChart">
        Solo
      </label>
      <label>
      <input type="checkbox" v-model="filterTypes.Male" @change="updateChart">
      Homme
      </label>
      <label>
        <input type="checkbox" v-model="filterTypes.Female" @change="updateChart">
        Femme
      </label>
      <label>
        <input type="checkbox" v-model="filterTypes.inActivity" @change="updateChart">
        In activity
      </label>
      <label>
        <input type="checkbox" v-model="filterTypes.careerEnded" @change="updateChart">
        Carred ended
      </label>
    </div>

  <div class="chart-container">
<!--    barchart genres-->
    <div>
      <div class="bar-chart" ref="detailsContainer" >
        </div>
    </div>
<!--    barchart sousgenres-->
    <div>
      <div class="bar-chart-details" ref="detailsContainer2" >
      </div>
    </div>
<!--    barchart artistes-->
    <div>
      <div class="bar-chart-artists" ref="detailsContainer3" >
        </div>
      </div>
    </div>
  </div>
  <div id="tooltip"> </div>
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
        // Ajoutez d'autres filtres avec leurs valeurs initiales
      },

      subgenreSelected : null// Nouvelle propriété pour stocker les données filtrées
    };
  },

  async mounted() {
    try {
      const response = await fetch("./data/details_v1/all_data_details.json")
      this.data = await response.json();
      console.log(this.data);
      this.drawChart();
    } catch (error) {
      console.error('Erreur lors de la récupération des données de l\'API : ', error);
    }

  },

  methods: {
    async drawChart() {
      if (!this.data || !this.data.genres) {
        return;
      }

      this.titre = "Genres";

      const width = 600;
      const height = 500;
      const margin = {top: 20, right: 20, bottom: 30, left: 60};
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      // Triez les genres en fonction du nombre d'artistes total de manière décroissante
      this.genres = Object.keys(this.data.genres).sort((a, b) => {
        return this.data.genres[b].details.nombre_artists_total - this.data.genres[a].details.nombre_artists_total;
      });

      // Créer le SVG
      const svg = d3.select('.bar-chart').append('svg')
          .attr('width', width)
          .attr('height', height)
          .style('background-color', 'burlywood')
          .append('g')
          .attr('transform', `translate(${margin.left}, ${margin.top})`)
      ;

      // Créer une échelle de couleurs ordinales en bleu
      const colorScale = d3.scaleOrdinal(d3.schemeYlOrBr[this.genres.length]);

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

      console.log(this.subgenres.length);

      // Créer le SVG
      const svg = d3.select('.bar-chart-details').append('svg')
          .attr('width', width)
          .attr('height', height)
          .style('background-color', 'burlywood')
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
            return tooltip.style("visibility", "hidden");
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

      this.genreSelected = genre;
      this.subgenreSelected = subgenre;

      this.showCheckboxes = true;

      this.titre = "Artistes de " + subgenre + " - " + genre;

      const encodedGenre = encodeURIComponent(genre);
      const encodedSubgenre = encodeURIComponent(subgenre);
      const url = `data/artists_by_genre_sorted_v1/${encodedGenre}/${encodedSubgenre}.json`;
      const response = await fetch(url);
      this.data = await response.json();

      // Supprimer le graphique précédent
      d3.select('svg').remove();

      this.artists = Object.keys(this.data).sort((a, b) => {
        return this.data[b].deezerFans - this.data[a].deezerFans;
      });


      const width = 800;
      // const height = 500;
      const margin = {top: 20, right: 20, bottom: 30, left: 50};
      const innerWidth = width - margin.left - margin.right;
      // const innerHeight = height - margin.top - margin.bottom;

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
          .style('background-color', 'burlywood')
          .append('g')  // Ajout d'un groupe pour appliquer les marges
          .attr('transform', `translate(150, ${margin.top})`);

      // Create the axes
      // const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      // create a tooltip
      // var tooltip = d3.select(".bar-chart-artists")
      //     .append("div")
      //     .style("position", "absolute")
      //     .style("background-color", "white")
      //     .style("border", "solid")
      //     .style("border-width", "2px")
      //     .style("border-radius", "5px")
      //     .style("padding", "5px")
      //     .style("visibility", "hidden");

      // Append the axes to the SVG
      // svg.append('g')
      //     .attr('transform', `translate(0, ${innerHeight})`)
      //     .call(xAxis);

      // Ajoutez l'axe y à votre SVG
      svg.append('g')
          .attr('class', 'y-axis') // Ajoutez une classe pour sélectionner l'axe y plus tard
          .call(yAxis);

      d3.select('.y-axis').selectAll('text')
          .on('mouseover', (event, name) => {
            // Récupérez l'artiste correspondant à l'index dans les données filtrées
            const artist = this.data[name];

            console.log('mouseover', artist, name);


            // Vous pouvez accéder directement aux propriétés de l'artiste ici
            const toolDetails = `
      Nom: ${artist.name} <br>
      Nombre de fans: ${artist.deezerFans} <br>
      Nombre d'albums: ${artist.nombre_albums} <br>
      Type: ${artist.type} <br>
    `;
            console.log(toolDetails);

            // Utilisez votre fonction showTooltip avec les détails
            this.showTooltip(event, toolDetails);
          });

      // Append the bars
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
            //afficher infos artistes
            const artist = this.data[id];
            console.log(artist)
            const toolDetails = artist.name + " <br> nombre de fans :  " + artist.deezerFans
                + ' <br> nombre album :  ' + artist.nombre_albums + " " +
                " <br> type :  " + artist.type +
                " <br> genres :  " + artist.genres ;

            //afficher tooltip
            this.showTooltip(event,toolDetails)
          })


    },


    async filtersBar(){
      this.artistList = true;
      const checkedValues = Object.keys(this.checkboxValues).filter(key => this.checkboxValues[key]);
      console.log(checkedValues)
      console.log(this.genreSelected,this.subgenreSelected )
      const response2 = await fetch(
          `./data/artists_by_genre_sorted_v1/${this.genreSelected}/${this.subgenreSelected}.json`
      );

      this.dataDetails = await response2.json();
      const filteredData = this.filterDataByCheckedValues(this.dataDetails, checkedValues);
      console.log(filteredData)
    },

    // Méthode pour obtenir les filtres cochés
    getCheckedFilters() {
      return Object.keys(this.filterTypes).filter(key => this.filterTypes[key]);
    },

    // Méthode pour filtrer les données en fonction des filtres cochés
    filterDataByCheckedValues(dataG, filterTypes) {
      let key;
      let filteredData = [...dataG];


      filterTypes.forEach(value => {
        console.log(value)
        if (value === 'Group') {
          key = 'type';
          filteredData = filteredData.filter(item => item[key] === 'Group');
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
          filteredData = filteredData.filter(item => item[key] === 'Female');
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

      const encodedGenre = encodeURIComponent(this.genreSelected);
      const encodedSubgenre = encodeURIComponent(this.subgenreSelected);
      const url = `data/artists_by_genre_sorted_v1/${encodedGenre}/${encodedSubgenre}.json`;
      const response2 = await fetch(url);

      this.dataF = await response2.json();

      console.log(this.dataF)

      // Filtrer les données en fonction des filtres actuels
      this.filteredData = this.filterDataByCheckedValues(this.dataF, this.getCheckedFilters());

      // Mettre à jour le graphique avec les données filtrées
      this.updateBars();
    },


    // Méthode pour mettre à jour les barres du graphique
    updateBars() {
      const bars = d3.select('.bar-chart-artists')
          .selectAll('rect');


      const xScale = d3.scaleLinear()
          .domain([0, d3.max(this.filteredData, artist => artist.deezerFans)])
          .range([0, innerWidth]);

      const yScale = d3.scaleBand()
          .domain(this.filteredData.map(artist => artist.name))
          .range([0, this.filteredData.length * 15])
          .padding(0.3);

      // Sélectionnez toutes les barres existantes
      const existingBars = bars.data(this.filteredData);


      // Mettez à jour les propriétés des barres existantes
      existingBars.transition()
          .duration(500)
          .attr('y', artist => yScale(artist.name))
          .attr('width', artist => xScale(artist.deezerFans))
          .attr('height', yScale.bandwidth());

      // Mettez à jour l'axe y avec la nouvelle échelle
      d3.select('.bar-chart-artists').select('.y-axis')
          .transition()
          .duration(500)
          .call(d3.axisLeft(yScale));


      d3.select('.y-axis').selectAll('text')
          .on('mouseover', (event, index) => {
            // Récupérez l'artiste correspondant à l'index dans les données filtrées
            const artist = this.filteredData[index];

            console.log('mouseover', artist);

            // Vous pouvez accéder directement aux propriétés de l'artiste ici
            const toolDetails = `
      Nom: ${artist.name} <br>
      Nombre de fans: ${artist.deezerFans} <br>
      Nombre d'albums: ${artist.nombre_albums} <br>
      Type: ${artist.type} <br>
    `;
            console.log(toolDetails);

            // Utilisez votre fonction showTooltip avec les détails
            this.showTooltip(event, toolDetails);
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

    showTooltip(event, toolDetails) {
      const tooltip = d3.select('#tooltip');


      //afficher tooltip
      tooltip.html(toolDetails).style("visibility", "visible").style("color", "black")
          .style("border-color", );

      // Positionner la zone de texte
      tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 20) + 'px')
          .style('opacity', 1);

      // Ajouter un événement pour masquer la zone de texte au survol
      d3.select('body')
          .on('mousemove', () => tooltip.style('left', (event.pageX + 10) + 'px')
              .style('top', (event.pageY - 20) + 'px'))
          .on('mouseout', () => tooltip.style('opacity', 0));
    },




  },





};


</script>

<style scoped>

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.bar-chart-artists {
  color: black;
  width: 100%;
  height: 100%;
  /*background-color: burlywood;*/
  overflow: auto; /* Ajoutez cette propriété pour activer le défilement */
}


svg {
  width: 100%;
  height: 100%;
}

.checkbox-container {
  align-content: center;
  display: flex;
  align-items: center;
  margin-left: 100px;
  margin-right: 250px;
  width: 600px;
  height: 20px;
  border: 2px solid #cccccc; /* Bordure de 2 pixels en couleur grise */
  border-radius: 10px; /* Coins arrondis */
  padding: 10px; /* Espace intérieur de 10 pixels */
  overflow: hidden;
  flex-grow: 1;
}


</style>
