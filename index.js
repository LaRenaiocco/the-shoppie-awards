"use strict"

// handles submit of movie search form
$('#submit-btn').on('click', (evt) => {
    evt.preventDefault();
    const searchWords = $('#search-input').val();
    const searchQuery = prepareQuery(splitInput(searchWords))
    const url = `http://www.omdbapi.com/?&apikey=5a67b678&s=${searchQuery}&type="movie"`
    movieRequest(url)
    $('#movie-search')[0].reset()
})

// returns user input split into a list
function splitInput(words) {
    return words.split(' ')
}

// creates single string with + between words for query
function prepareQuery(words_list) {
    let query = ''
    words_list.forEach(word => {
        query += word + '+'
    })
    return query.slice(0, -1)
}

// sends request to OMDB API
function movieRequest(url) {
    $.get(url, (data) => {
        const movies = data.Search
        console.log(movies)
    })
}
