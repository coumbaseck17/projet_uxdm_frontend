// artistUtils.js

export async  function filterArtists(genre, subgenreOrAll = null, filterType = null, filterValue = null) {
    try {
        let filePath;
        if (subgenreOrAll === "all" || subgenreOrAll === null) {
            filePath = `./data/artists_by_genre_sorted_v1/${genre}/${genre}_all_artists_sorted.json`;
        } else {
            filePath = `./data/artists_by_genre_sorted_v1/${genre}/${subgenreOrAll}.json`;
        }

        const response = await fetch(filePath);
        const artists = await response.json();
        console.log(artists); // Log fetched artists
        let filteredArtists = artists;

        if (filterType !== null && filterValue !== null) {
            filteredArtists = artists.filter(artist => {
                if (filterType === "TYPE") {
                    return artist.type === filterValue;
                } else if (filterType === "GENDER") {
                    return artist.gender === filterValue;
                }
            });
        }

        return filteredArtists; // Return filtered artists
    } catch (error) {
        console.error('Error fetching artists:', error);
        return null; // Return null in case of error
    }
}


