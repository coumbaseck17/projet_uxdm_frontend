// artistUtils.js
 export async  function filterArtists(genre, subgenreOrAll) {
        try {
            let filePath;
            if (subgenreOrAll === "all" || subgenreOrAll === null) {
                filePath = `./data/artists_by_genre_sorted_v1/${genre}/${genre}_all_artists_sorted.json`;
            } else {
                filePath = `./data/artists_by_genre_sorted_v1/${genre}/${subgenreOrAll}.json`;
            }

            const response = await fetch(filePath);
            const artists = await response.json();
            let filteredArtists = artists;


            return filteredArtists; // Return filtered artists
        } catch (error) {
            console.error('Error fetching artists:', error);
            return null; // Return null in case of error
        }
    }
