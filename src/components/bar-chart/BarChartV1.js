// import * as d3 from 'd3';
// import axios from 'axios';
// import BarChartV1Details from "@/components/bar-chart/BarChartV1Details";
//
//
// export default {
//      name: 'BarChartJs',
//     components: {BarChartV1Details},
//
//     data() {
//         return {
//             data: null,
//             genres : null,
//             showDetails: false,
//             detailData: null,
//         };
//     },
//
//     async mounted() {
//         try {
//             const response = await axios.get('http://127.0.0.1:5000/api/statistiques');
//             this.data = response.data;
//             // console.log(response.data['genres']['Blues'].details);
//             this.drawChart();
//         } catch (error) {
//             console.error('Erreur lors de la récupération des données de l\'API : ', error);
//         }
//
//     },
//
//     methods: {
//         async drawChart() {
//             if (!this.data || !this.data.genres) {
//                 return;
//             }
//
//             const width = 600;
//             const height = 400;
//             const margin = { top: 20, right: 20, bottom: 30, left: 60 };
//             const innerWidth = width - margin.left - margin.right;
//             const innerHeight = height - margin.top - margin.bottom;
//
//             // Triez les genres en fonction du nombre d'artistes total de manière décroissante
//             this.genres = Object.keys(this.data.genres).sort((a, b) => {
//                 return this.data.genres[b].details.nombre_artists_total - this.data.genres[a].details.nombre_artists_total;
//             });
//
//             const svg = d3.select('.bar-chart').append('svg')
//                 .attr('width', width)
//                 .attr('height', height)
//                 .append('g')
//                 .attr('transform', `translate(${margin.left}, ${margin.top})`);
//
//             // const genres = Object.keys(this.data.genres);
//
//             // Créer une échelle de couleurs ordinales en bleu
//             const colorScale = d3.scaleOrdinal(d3.schemeYlOrBr[this.genres.length].reverse());
//
//             // Create the scales
//             const xScale = d3.scaleLinear()
//                 .domain([0, d3.max(this.genres, (genre) => this.data.genres[genre].details.nombre_artists_total)])
//                 .range([0, innerWidth]);
//
//             const yScale = d3.scaleBand()
//                 .domain(this.genres)
//                 .range([0, innerHeight])
//                 .padding(0.1);
//
//             // Create the axes
//             const xAxis = d3.axisBottom(xScale);
//             const yAxis = d3.axisLeft(yScale);
//
//             // Ajout du conteneur et des boutons à côté de chaque barre
//             const buttonContainer = svg.append('g').attr('class', 'bar-buttons');
//
//             buttonContainer
//                 .selectAll('.bar-button')
//                 .data(this.genres)
//                 .enter()
//                 .append('foreignObject')
//                 .attr('class', 'bar-button-container')
//                 .attr('x', (genre) => xScale(this.data.genres[genre].details.nombre_artists_total))
//                 .attr('y', (genre) => yScale(genre))
//                 .attr('width', 60) // Largeur du conteneur du bouton
//                 .attr('height', yScale.bandwidth())
//                 .append('xhtml:button')
//                 .attr('class', 'bar-button')
//                 .style('color', 'dark')
//                 .text('Details')
//                 .attr('data-genre', (genre) => genre)  // Stocker le genre dans un attribut de données
//                 .on('click', (event, genre) => {
//                     const clickedGenre = genre;
//                     // Appeler la méthode handleButtonClick avec le genre
//                     this.handleButtonClick(clickedGenre);
//                 });
//
//
//
//             // Append the axes to the SVG
//             svg.append('g')
//                 .attr('transform', `translate(0, ${innerHeight})`)
//                 .call(xAxis);
//
//             svg.append('g')
//                 .call(yAxis);
//
//
//             // Append the bars
//             svg.selectAll('rect')
//                 .data(this.genres)
//                 .enter()
//                 .append('rect')
//                 .attr('x', 0)
//                 .attr('y', (genre) => yScale(genre))
//                 .attr('width', (genre) => xScale(this.data.genres[genre].details.nombre_artists_total))
//                 .attr('height', yScale.bandwidth())
//                 .attr('fill', (genre) => colorScale(genre))
//                 .on('mouseover', function () {
//                     // Change the color of the bar , empty => black
//                     d3.select(this).attr('fill', '');
//
//                 })
//                 .on('mouseout', function () {
//                     // Reset the color of the bar after hover
//                     d3.select(this).attr('fill', (genre) => colorScale(genre));
//
//                 });
//
//             // Append the labels
//             svg.selectAll('text')
//                 .data(this.genres)
//                 .enter()
//                 .append('text')
//                 .text((genre) => `${genre} - ${this.data.genres[genre].details.nombre_artists_total}`)
//                 .attr('x', (genre) => xScale(this.data.genres[genre].details.nombre_artists_total) + 5)
//                 .attr('y', (genre) => yScale(genre) + yScale.bandwidth() / 2)
//                 .attr('dy', '.35em')
//                 .style('font-size', '20px')
//                 .style('fill', 'black')
//                 .style('text-anchor', 'start');
//
//         },
//
//         handleButtonClick(genre) {
//             this.showDetails = true;
//                 if ( this.data.genres[genre]) {
//                     // Your existing code to update the detail chart
//                     this.detailData = this.data.genres[genre].details.nombre_artists_total;
//                 } else {
//                     console.error(`Le genre ${genre} n'est pas défini dans les données.`);
//                 }
//         },
//     },
// };
