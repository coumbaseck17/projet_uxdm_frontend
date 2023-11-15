// artistUtils.js

export async  function filterArtists(genre, subgenreOrAll = null, filterType = null, filterValue = null) {
    let file_path;
    if (subgenreOrAll === "all" || subgenreOrAll === null) {
        file_path = `data/artists_by_genre_sorted_v1/${genre}/${genre}_all_artists_sorted.json`;
    } else {
        file_path = `data/artists_by_genre_sorted_v1/${genre}/${subgenreOrAll}.json`;
    }

    try {
        const response = await fetch(file_path);
        const artists = await response.json();
        console.log(response +"ooooooo");

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

        return JSON.stringify(filteredArtists);
    } catch (error) {
        console.error('Error fetching artists:', error);
        return JSON.stringify([]);
    }
}


// dataService.js
export async function fetchDataFromJSON(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}
