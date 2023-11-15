<template>
    <!-- Pictogram chart -->
    <div>
      <div class="pictogram-chart"></div>
    </div>

  </template>


<script>
import * as d3 from 'd3';
import axios from 'axios';

import pic1000000 from '@/../public/data/pic100000.png';
import pic100000 from '@/../public/data/pic100000.png';
import pic10000 from '@/../public/data/pic10000.png';
import pic1000 from '@/../public/data/pic1000.png';
import pic100 from '@/../public/data/pic100.png';
import pic10 from '@/../public/data/pic10.png';
import pic1 from '@/../public/data/pic1.png';

export default {


  data() {
    return {
      data: null,
      marges: {haut: 40, droit: 20, bas: 30, gauche: 60},
      largeurTotale: 900,
      hauteurTotale: 600,
      innerWidth: 0,
      innerHeight: 0,
      currentGenre: null,
      subgenre :'',
      selectedFilter:'all',
      labelLegend: 'artistes',
      selectedArtist: null
//
      // Track the currently selected genre
    };
  },

  async mounted() {


    try {
      const response = await axios.get('http://127.0.0.1:5000/api/statistiques');
      this.data = response.data;
      this.innerWidth = this.largeurTotale - this.marges.gauche - this.marges.droit;
      this.innerHeight = this.hauteurTotale - this.marges.haut - this.marges.bas;
      this.drawChart();


    } catch (error) {
      console.error('Erreur lors de la récupération des données de l\'API : ', error);
    }
  },

  methods: {
    drawChart() {
      this.labelLegend = 'artistes';

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

      const width = 600;
      const height = 600;
      const radius = Math.min(width, height) / 2;

      const color = d3.scaleOrdinal(d3.schemeCategory10);

      const partition = d3.partition().size([2 * Math.PI, radius]);

      const root = d3.hierarchy(hierarchy)
          .sum(d => d.value)
          .sort((a, b) => b.value - a.value);

      partition(root);

      const svg = d3.select('.pictogram-chart')
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', `translate(${width / 2},${height / 2})`);

      const arc = d3.arc()
          .startAngle(d => d.x0)
          .endAngle(d => d.x1)
          .innerRadius(d => d.y0)
          .outerRadius(d => d.y1);

      svg.selectAll('path')
          .data(root.descendants())
          .enter()
          .append('path')
          .attr('display', d => (d.depth ? null : 'none'))
          .attr('d', arc)
          .style('stroke', '#fff')
          .style('fill', d => color((d.children ? d : d.parent).data.name));

      // Additional event handling or modifications can be added as needed
    },
    showSubgenres(genre) {
      // Update currentGenre to the selected genre
      this.currentGenre = genre;
      this.labelLegend = "artistes"


      // Remove the existing chart
      d3.select('.pictogram-chart').selectAll('*').remove();

      // Draw the new chart for subgenres
      const subgenres = Object.keys(this.data.genres[genre].subgenres).sort((a, b) => {
        return this.data.genres[genre].subgenres[b].details.nombre_artists_total - this.data.genres[genre].subgenres[a].details.nombre_artists_total;
      });

      // Create a new SVG container for subgenres
      const svg = d3.select('.pictogram-chart').append('svg')
          .attr('width', this.largeurTotale)
          .attr('height', this.hauteurTotale);

      // Create a scale for the y-axis based on subgenres
      const yScale = d3.scaleBand()
          .domain(subgenres)
          .range([0, this.innerHeight])
          .padding(0.5);

      // Add the y-axis inside the container
      const yAxis = d3.axisLeft(yScale);
      svg.append('g')
          .attr('class', 'y axis')
          .call(yAxis).selectAll('.domain, .tick line')
          .style('stroke', 'transparent');

      // Create groups for each subgenre
      const subgenreGroups = svg.selectAll('.subgenre-group')
          .data(subgenres)
          .enter()
          .append('g')
          .attr('class', 'subgenre-group')
          .attr('transform', (subgenre) => `translate(150, ${yScale(subgenre)})`)
          .on('mouseover', (event, subgenre) => {
            this.showSubgenreDetails(subgenre);
          })
          .on('mouseout', () => {
            this.hideSubgenreDetails();
          })
          .on('click', (event, subgenre) => {
            this.subgenre = subgenre;
            this.showArtists(subgenre);
          });

      // Add pictograms for each subgenre
      subgenreGroups.selectAll('.pictogram')
          .data((subgenre) => {
            const count = this.data.genres[genre].subgenres[subgenre].details.nombre_artists_total;
            return [
              ...Array(Math.floor(count / 1000)).fill(pic1000),
              ...Array(Math.floor((count % 1000) / 100)).fill(pic100),
              ...Array(Math.floor((count % 100) / 10)).fill(pic10),
              ...Array(count % 10).fill(pic1),
            ];
          })
          .enter()
          .append('image')
          .attr('class', 'pictogram')
          .attr('x', (d, i) => i * 40)
          .attr('y', -20) // Adjust the vertical position of pictograms
          .attr('width', 40)
          .attr('height', 40)
          .attr('xlink:href', d => d);

      // Add subgenre names as text labels
      subgenreGroups.append('text')
          .attr('class', 'label')
          .text(subgenre => subgenre)
          .attr('x', -125) // Adjust the horizontal position of subgenre names
          .attr('y', 0)
          .style('font-size', '14px')
          .style('fill', 'black')
          .style('text-anchor', 'start');
    },

    showSubgenreDetails(subgenre) {
      // Logique pour afficher les détails du subgenre
      // Vous pouvez utiliser la classe 'genre-details' ou toute autre méthode pour afficher les détails
      // Mise à jour des détails du genre actuel
      const subgenreDetails = this.data.genres[this.currentGenre].subgenres[subgenre].details;


      // Logique pour afficher les détails du genre
      const detailsContainer = d3.select('.genre-details');
      detailsContainer.html(`<p>Nombre de groupe: ${subgenreDetails.nombre_groupes} / Actifs : ${subgenreDetails.nombre_actif_groupes}</p>
        <p>Nombre de solos: ${subgenreDetails.nombre_solos} / Actifs : ${subgenreDetails.nombre_actif_solos} </p>
        <p>Nombre autres: ${subgenreDetails.nombre_autres} / Actifs : ${subgenreDetails.nombre_actif_autres} </p>`);
    },


    hideSubgenreDetails() {
      // Logique pour masquer les détails du subgenre
      // Vous pouvez effacer les détails du subgenre de la classe 'genre-details' ou utiliser une autre méthode
      d3.select('.genre-details').html('');
    },

    showGenreDetails(genre) {
      // Logique pour afficher les détails du genre
      const detailsContainer = d3.select('.genre-details');
      detailsContainer.html(`<p>Nombre de groupe: ${this.data.genres[genre].details.nombre_groupes} / Actifs : ${this.data.genres[genre].details.nombre_actif_groupes}</p>
        <p>Nombre de solos: ${this.data.genres[genre].details.nombre_solos} / Actifs : ${this.data.genres[genre].details.nombre_actif_solos} </p>
        <p>Nombre autres: ${this.data.genres[genre].details.nombre_autres} / Actifs : ${this.data.genres[genre].details.nombre_actif_autres} </p>`);
    },


    hideGenreDetails() {
      // Logique pour masquer les détails du genre
      // Vous pouvez effacer les détails du genre de la classe 'genre-details' ou utiliser une autre méthode
      d3.select('.genre-details').html('');
    },

    showArtists(subgenre) {
      // Appelez votre API pour obtenir la liste des artistes du sous-genre
      const apiUrl = `http://127.0.0.1:5000/api/filter_artists?genre=${this.currentGenre}&subgenre=${subgenre}`;

      axios.get(apiUrl)
          .then(response => {
            const artistsData = response.data;
            this.drawArtistsChart(subgenre, artistsData);
          })
          .catch(error => {
            console.error('Erreur lors de la récupération des artistes du sous-genre : ', error);
          });
    },


    drawArtistsChart(subgenre, artistsData) {


      // Supprimez l'ancien graphique
      d3.select('.pictogram-chart').selectAll('*').remove();

      // Determine the total width needed for pictograms


      // Set the width of the container dynamically
      // Créez une boîte de défilement pour la liste des artistes
      const container = d3.select('.pictogram-chart').append('div')
          .attr('class', 'artists-container')
          .style('height', `${artistsData.length * 50}px`) // Ajustez la hauteur en fonction du nombre d'artistes
          .style('position', 'absolute')
          .style('top', '0')
          .style('left', '0');


      // Dessinez la liste des artistes à l'intérieur de la boîte de défilement
      this.drawArtistsList(container, artistsData);
    },

    drawArtistsList(container, artistsData) {
      d3.select('.genre-details').html('');
      this.labelLegend = "fans"

      // Create an SVG container for the artist chart
      const svg = container.append('svg')
          .attr('width', 1000)
          .attr('height', artistsData.length * 70)

      ;

      // Create a scale for the y-axis
      const yScale = d3.scaleBand()
          .domain(artistsData.map(artist => artist.name))
          .range([0, artistsData.length * 50])
          .padding(0.1);

      // Add the y-axis inside the container
      const yAxis = d3.axisLeft(yScale);
      svg.append('g')
          .attr('class', 'y axis')
          .call(yAxis).selectAll('.domain, .tick line')
          .style('stroke', 'transparent');

      // Create a group for each artist
      const artistGroups = svg.selectAll('.artist-group')
          .data(artistsData)
          .enter()
          .append('g')
          .attr('class', 'artist-group')
          .attr('id', artist => `artist-group-${CSS.escape(artist.name.replace(/\s+/g, '-'))}`) // Use CSS.escape()
          .attr('transform', artist => `translate(200, ${yScale(artist.name) + yScale.bandwidth() / 2})`)
          .on('mouseout', () => {
        this.unhighlightArtist();
      }).on('mouseover', (event, artist) => {
        this.highlightArtist(artist);
      })
          .on('click', (event, artist) => {
            console.log(artist.name)

             this.selectArtist(artist);
              this.highlightArtist(artist);
              this.showArtistDetails(artist);
          });

      // Add pictograms for each artist
      artistGroups.selectAll('.pictogram')
          .data(artist => {
            const deezerFans = artist.deezerFans;
            return [
              ...Array(Math.floor(deezerFans / 10000000)).fill(pic1000000),
              ...Array(Math.floor((deezerFans % 10000000) / 1000000)).fill(pic1000000),
              ...Array(Math.floor((deezerFans % 1000000) / 100000)).fill(pic100000),
              ...Array(Math.floor((deezerFans % 100000) / 10000)).fill(pic10000),
              ...Array(Math.floor(deezerFans / 1000)).fill(pic1000),
              ...Array(Math.floor((deezerFans % 1000) / 100)).fill(pic100),
              ...Array(Math.floor((deezerFans % 100) / 10)).fill(pic10),
              ...Array(deezerFans % 10).fill(pic1),
            ];
          })
          .enter()
          .append('image')
          .attr('class', 'pictogram')
          .attr('x', (d, i) => i * 40)
          .attr('y', -20) // Adjust the vertical position of pictograms
          .attr('width', 40)
          .attr('height', 40)
          .attr('xlink:href', d => d);

      // Add artist names with line breaks
      artistGroups.append('text')
          .attr('class', 'label')
          .text(artist => artist.name)
          .attr('x', -150) // Adjust the horizontal position of artist names
          .attr('y', 0)
          .style('font-size', '14px')
          .style('fill', 'black')
          .style('text-anchor', 'start')
          .call(wrap, 150); // Adjust the width for wrapping as needed

// Wrap function to handle line breaks
      // Wrap function to handle line breaks
      function wrap(text, width) {
        text.each(function () {
          var text = d3.select(this),
              words = text.text().split(/\s+/),
              word,
              line = [],
              lineNumber = 0,
              lineHeight = 1.1, // ems
              y = text.attr("y"),
              dy = 0, // Adjust as needed
              tspan = text.text(null).append("tspan").attr("x", -150).attr("y", y).attr("dy", dy + "em"); // Adjust the starting position

          while (words.length > 0) {
            word = words.shift();
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan").attr("x", -150).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word); // Adjust the starting position
            }
          }
        });
      }
    }
    ,
    applyFilter() {
      // Déterminez le filterType en fonction de la filterValue
      let filterType = null;
      const filterValue = this.selectedFilter;
      if (['all', 'Group', 'Person', ''].includes(this.selectedFilter)) {
        filterType = 'TYPE';
      } else if (['Female', 'Male'].includes(this.selectedFilter)) {
        filterType = 'GENDER';
      }
      console.log(filterType + "," + filterValue)

      // Appelez la fonction pour appliquer le filtre
      this.filterArtists(filterType, filterValue);
    },

    filterArtists(filterType, filterValue) {

      if (filterValue == "all") {
        this.showArtists(this.subgenre)
      } else {
        // Appelez votre API pour obtenir la liste des artistes filtrés
        const apiUrl = `http://127.0.0.1:5000/api/filter_artists?genre=${this.currentGenre}&subgenre=${this.subgenre}&filter_type=${filterType}&filter_value=${filterValue}`;

        axios.get(apiUrl)
            .then(response => {
              const filteredArtistsData = response.data;

              this.drawArtistsChart(this.subgenre, filteredArtistsData);
            })
            .catch(error => {
              console.error('Erreur lors de la récupération des artistes filtrés : ', error);
            });

      }
    },
    // ... autres méthodes existantes ...

    highlightArtist(artist) {
      // Highlight the artist by modifying the style (add a blue border)
      d3.select(`.artist-group#${CSS.escape(artist.name.replace(/\s+/g, '-'))}`)
          .style('border', '2px solid blue');
    },

    unhighlightArtist() {
      // Unhighlight the artist by resetting the style (remove the border)
      if (this.selectedArtist) {
        d3.select(`.artist-group#${CSS.escape(this.selectedArtist.name.replace(/\s+/g, '-'))}`)
            .style('border', 'none');
      }
    },
    selectArtist(artist) {
      // Mettez à jour la variable selectedArtist
      this.selectedArtist = artist;
    },

    showArtistDetails(artist) {
      // Logique pour afficher les détails de l'artiste
      // Vous pouvez utiliser la classe 'genre-details' ou toute autre méthode pour afficher les détails
      // Mise à jour des détails de l'artiste actuel
      const detailsContainer = d3.select('.artist-details');
      detailsContainer.html(`<p>Liste des albums: ${artist.albums.join(', ')}</p>
    <p>Genre: ${artist.gender}</p>
    <p>Liste des genres: ${artist.genres.join(', ')}</p>
    <p>LifeSpan Ended: ${artist.lifeSpan.ended ? 'Oui' : 'Non'}</p>
    <p>Membres: ${artist.members.join(', ')}</p>
    <p>Image: <img src="${artist.picture}" alt="Artist"></p>
    <p>Record Label: ${artist.recordLabel}</p>
    <p>Type: ${artist.type}</p>
    <p>URL Deezer: <a href="${artist.urlDeezer}" target="_blank">${artist.urlDeezer}</a></p>`);
    }

    // ...

  },
};
</script>

<style scoped>
/* ... (unchanged styles) */

.artists-container {
  position: relative;
  margin-right: 20px;
}

.artist-container {
  cursor: pointer;
}

.artist-name {
  flex: 1; /* Allow artist name to take remaining space */
}

.pictogram {
  /* Add styles as needed for pictograms */
}


.artist-names-container {
  position: relative;
  margin-right: 20px;
}

.artist-name-container {
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.chart-container {
  display: flex;

}

.pictogram-chart {
  margin-right: 20px;

}

.genre-details {
  font-size: 16px;
}

.artist-details {
  margin-left: 100px;
}

.axis path,
.axis line {
  fill: none;
  stroke: black;
  shape-rendering: crispEdges;
}

.axis text {
  font-family: 'Arial', sans-serif;
  font-size: 12px;
}

.label {
  font-size: 14px;
  fill: black;
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.pictogram {
  cursor: pointer;
}

.pictogram:hover {
  filter: brightness(70%);
}
.filter-container {
  display: flex;
  flex-direction: column;
  margin-right: 20px;
}

.filter-container label {
  margin-bottom: 5px;
}
.filter-container {
  flex-direction: column;
  margin-right: -1000px;  /* Ajustez la valeur en conséquence */
}



.artists-container {
  position: relative;
  margin-right: 20px;
  width: 800px; /* Assurez-vous que le conteneur parent a une largeur fixe */
}

.artists-container svg {
  width: 2500px; /* Définissez la largeur du contenu que vous souhaitez pouvoir faire défiler */
  overflow-x: auto; /* Activez le défilement horizontal si nécessaire */
}

.legend-container {
  margin-right: -10000px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.legend-icon {
  width: 20px;
  height: 20px;
  margin-right: 5px;


}

.artist-group:hover {
  border: 2px solid blue;
}
</style>
