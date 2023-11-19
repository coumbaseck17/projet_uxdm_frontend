<template>
  <br>
  <h3> {{ titre }} </h3>
  <br>
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
          .append('g')
          .attr('transform', `translate(${margin.left}, ${margin.top})`);

      // Créer une échelle de couleurs ordinales en bleu
      const colorScale = d3.scaleOrdinal(d3.schemeYlOrBr[this.genres.length].reverse());

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
            //first fig
            // return tooltip.style("top", (event.pageY-50)+"px").style("left",(event.pageX-50)+"px")
            //seconfd fig
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

      const width = 700;
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


      const width = 700;
      const height = 500 ;
      const margin = {top: 20, right: 20, bottom: 30, left: 90};
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      // Create the scales
      const xScale = d3.scaleLinear()
          .domain([0, d3.max(this.data, (artist) => artist.deezerFans)])
          .range([0, innerWidth]);


      const yScale = d3.scaleBand()
          .domain(this.data.map(artist => artist.name))
          .range([0, this.data.length * 10])  // Inversion du range
          .padding(0.1);

      // Créer le SVG
      const svg = d3.select('.bar-chart-artists').append('svg')
          .attr('width', width)
          .attr('height', height)
          // cette ligne pour longueur de la barre
          // .attr('height', this.artists.length * 10 + margin.top + margin.bottom)
          .append('g')
          .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .append('div')
      .style('overflow-y', 'scroll')

      // Create the axes
      const xAxis = d3.axisBottom(xScale);
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
          .style("visibility", "hidden")


      // Append the axes to the SVG
      svg.append('g')
          .attr('transform', `translate(0, ${innerHeight})`)
          .call(xAxis);

      // svg.append('g')
      //     .attr("class", "y-axis")
      //     .call(yAxis);

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
          // .attr('preserveAspectRatio', 'xMinYMin')
          .on('mouseover', () => {
            return tooltip.style("visibility", "visible").style("color", "black")
                .style("border-color", color);
          })
          .on("mousemove", function () {

            return tooltip.style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
          })
          .on('mouseout', function () {
            return tooltip.style("visibility", "hidden");
          })
          .on('click', () => {
            return tooltip.style("visibility", "hidden");
          });


      // Ajouter une barre de défilement à l'axe y
      const scrollBar = d3
          .select(".bar-chart-artists")
          .append("input")
          .attr("type", "range")
          .attr("orient", "vertical")
          .attr("min", 0)
          .attr("max", yScale.domain().length - 1)
          .attr("value", 0)
          .attr("class", "scroll-bar")
          .style("height", "500px")
          .on("input", () => {
          const scrollValue = +scrollBar.property("value");
          const visibleItems = 30;

            // Créer une nouvelle échelle en fonction de la position de la barre de défilement
            const newYScale = d3.scaleBand()
                .domain(yScale.domain().slice(scrollValue, scrollValue + visibleItems))
                .range([0, height - margin.top - margin.bottom])
                .padding(0.1);

         // Mettez à jour l'axe y et les éléments du graphique en conséquence
            yAxisGroup.call(d3.axisLeft(newYScale));

            // // Mettez à jour l'axe x en fonction de la nouvelle échelle
            // xScale.range([0, innerWidth]);


            //  Mettez à jour les barres du graphique
          svg.selectAll("rect")
              .attr('x', 0)
              .attr("y", id => newYScale(this.data[id].name))
              .attr('width', (id) => xScale(this.data[id].deezerFans))
              .attr("height", newYScale.bandwidth());

            // Mettez à jour l'axe x
            // svg.select('.x-axis')
            //     .call(xAxis.scale(xScale));

      });

//       const zoom = d3.zoom()
//           .scaleExtent([0, 20])
//           .on("zoom", (event) => {
//             // Ajuster la plage de l'échelle y en fonction de la transformation
//             yScale.range([margin.top, innerHeight - margin.bottom].map(d => event.transform.applyY(d)));
//
//             // Mettre à jour les positions et hauteurs des barres
//             svg.selectAll('rect')
//                 .attr('y', id => yScale(this.data[id].name))
//                 .attr('height', yScale.bandwidth());
//
//             // Mettre à jour l'axe y
//             yAxisGroup.call(yAxis.scale(yScale));
//           });
//
// // Appeler la fonction de zoom sur l'élément SVG
//       svg.call(zoom);

    },

  }
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
  background-color: burlywood;
}

svg {
  width: 100%;
  height: 100%;
}


</style>
