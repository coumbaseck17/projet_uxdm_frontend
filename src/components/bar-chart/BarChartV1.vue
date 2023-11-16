<template>
  <br>
  <h3> {{ titre }} </h3>
  <br>
  <br>
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
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: 'BarChart',
  data() {
    return {
      data: null,
      genres : null,
      subgenres : null,
      genreDetails : null,
      titre : null
    };
  },

  async mounted() {
    try {
      const response = await fetch("./data/details_v1/all_data_details.json")
      this.data= await response.json();
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
      const margin = { top: 20, right: 20, bottom: 30, left: 60 };
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
            const toolDetails = genre + " <br> nombre d'artistes total :  " + dataDetails.nombre_artists_total +' <br> nombre de groupe :  '
            + dataDetails.nombre_groupes + "  <br> nombre de solo :  " + dataDetails.nombre_solos + " <br> nombre d'artistes actif total "+
                dataDetails.nombre_actif_total ;
            tooltip.html(toolDetails).style("visibility", "visible").style("color","black")
             .style("border-color",colorScale(genre));
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
            this.showSubgenres(genre);
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
    showSubgenres(genre) {

      this.titre = "Sous-genres de " + genre;

      // Supprimer le graphique précédent
      d3.select('svg').remove();

      const width = 700;
      const height = 500;
      const margin = { top: 20, right: 20, bottom: 30, left: 90 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      this.genreDetails = this.data.genres[genre];
      this.subgenres = Object.keys(this.genreDetails.subgenres).sort((a, b) => {
        return this.genreDetails.subgenres[b].nombre_artists_total - this.genreDetails.subgenres[a].nombre_artists_total;
      });

      console.log(this.subgenres.length);

      const colorScale1 = d3.scaleOrdinal(d3.schemeOrRd[9]);


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
          .attr('fill', () => colorScale1())
          .on('mouseover', (event, subgenre) => {
            const dataDetails = this.genreDetails.subgenres[subgenre].details;
            const toolDetails = subgenre + " <br> nombre d'artistes total :  " + dataDetails.nombre_artists_total +' <br> nombre de groupe :  '
                + dataDetails.nombre_groupes + "  <br> nombre de solo :  " + dataDetails.nombre_solos + " <br> nombre d'artistes actif total "+
                dataDetails.nombre_actif_total ;
            tooltip.html(toolDetails).style("visibility", "visible").style("color","black")
                .style("border-color",colorScale1);
          })
          .on("mousemove", function () {

            return tooltip.style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
          })
          .on('mouseout', function () {
            return tooltip.style("visibility", "hidden");
          })
          .on('click', (event, subgenre) => {
            this.su
            this.showArtists(subgenre);
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
    showArtists(subgenre) {

      this.titre = "Artistes de " + subgenre;

      // Supprimer le graphique précédent
      d3.select('svg').remove();

      const width = 700;
      const height = 500;
      const margin = { top: 20, right: 20, bottom: 30, left: 90 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      this.genreDetails = this.data.genres[genre];
      this.subgenres = Object.keys(this.genreDetails.subgenres).sort((a, b) => {
        return this.genreDetails.subgenres[b].nombre_artists_total - this.genreDetails.subgenres[a].nombre_artists_total;
      });

      console.log(this.subgenres.length);

      const colorScale1 = d3.scaleOrdinal(d3.schemeOrRd[9]);


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
          .attr('fill', () => colorScale1())
          .on('mouseover', (event, subgenre) => {
            const dataDetails = this.genreDetails.subgenres[subgenre].details;
            const toolDetails = subgenre + " <br> nombre d'artistes total :  " + dataDetails.nombre_artists_total +' <br> nombre de groupe :  '
                + dataDetails.nombre_groupes + "  <br> nombre de solo :  " + dataDetails.nombre_solos + " <br> nombre d'artistes actif total "+
                dataDetails.nombre_actif_total ;
            tooltip.html(toolDetails).style("visibility", "visible").style("color","black")
                .style("border-color",colorScale1);
          })
          .on("mousemove", function () {

            return tooltip.style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
          })
          .on('mouseout', function () {
            return tooltip.style("visibility", "hidden");
          })
          .on('click', (event, subgenre) => {
            this.showArtists(subgenre);
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
     }

  },
};
</script>

<style scoped>

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
}
.bar-chart {
  color: black;
  width: 100%;
  height: 100%;
  background-color: burlywood;
}
.bar-chart-details {
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
