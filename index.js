"use strict"

const nomsList = []

nomsList.forEach(movie => {
  createNomination(movie)
})

// handles submit of movie search form
$("#submit-btn").on("click", (evt) => {
  evt.preventDefault();
  const searchWords = $("#search-input").val();
  const searchQuery = prepareQuery(splitInput(searchWords))
  const url = `http://www.omdbapi.com/?&apikey=5a67b678&s=${searchQuery}&type="movie"`
  movieRequest(url)
  $("#movie-search")[0].reset()
})

// returns user input split into a list
function splitInput(words) {
  return words.split(" ")
}

// creates single string with + between words for query
function prepareQuery(words_list) {
  let query = ""
  words_list.forEach(word => {
    query += word + "+"
  })
  return query.slice(0, -1)
}

// sends request to OMDB API
function movieRequest(url) {
  $.get(url, (data) => {
    $("#results").empty()
    if (data.Response === "False") {
      alert(`${data.Error} Please check your spelling!`)
    } else {
      console.log(data)
      const movies = data.Search
      console.log(movies)
      movies.forEach(movie => {
        createMovieCard(movie)
      })
    }
  })
}

// Creates card for each movie returned in search result
function createMovieCard(movie) {
  const movieCard = document.createElement("div")
  movieCard.setAttribute("class", "card")
  movieCard.setAttribute("id", `card${movie.imdbID}`)

  const cardHead = document.createElement("img")
  cardHead.setAttribute("class", "card-img-top")
  if (movie.Poster === "N/A") {
    cardHead.src = "no_image.png"
  } else {
    cardHead.src = movie.Poster
  }
	movieCard.appendChild(cardHead)

	const cardBody = document.createElement("div")
	cardBody.setAttribute("class", "card-body")
	movieCard.appendChild(cardBody)

	const cardTitle = document.createElement("h6")
	cardTitle.setAttribute("class", "card-title")
	cardTitle.textContent = movie.Title
  cardBody.appendChild(cardTitle)
    
  const movieYear = document.createElement("div")
	movieYear.setAttribute("class", "card-text")
	movieYear.textContent = `Released: ${movie.Year}`
  cardBody.appendChild(movieYear)
    
  const nomBtn = document.createElement("button")
  nomBtn.setAttribute("class", "btn btn-info nom-btn")
  nomBtn.setAttribute("id", `nomBtn${movie.imdbID}`)
  nomBtn.textContent = "Nominate Me"
  nomBtn.addEventListener("click", () => {
    alert('trigger nominate')
    nomsList.push(movie)
    console.log(nomsList)
    createNomination(movie)
    nomBtn.disabled = true
  })
  cardBody.appendChild(nomBtn)

  $("#results").append(movieCard)
}

function createNomination(movie) {
  const nom = document.createElement("div")
  nom.setAttribute("class", "nomination")
  nom.setAttribute("id", `nom${movie.imdbID}`)

  const nomTitle = document.createElement("span")
  nomTitle.textContent = movie.Title

  const unNomBtn = document.createElement("button")
  unNomBtn.setAttribute("class", "btn btn-info")
  unNomBtn.textContent = "Un-nominate me"
  unNomBtn.addEventListener('click', () => {
    alert("remove element")
    nom.remove()
    const nomBtn = document.getElementById(`nomBtn${movie.imdbID}`)
    nomBtn.disabled = false
  })

  nom.appendChild(nomTitle)
  nom.appendChild(unNomBtn)

  $("#nominations").append(nom)
}
// modal close buttons
$(".btn-close").on('click', () => {
  $('#finishedModal').modal('toggle')
})



