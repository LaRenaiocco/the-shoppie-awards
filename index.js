"use strict"

let nomsList = [];

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
  if (nomsList.includes(movie.imdbID)) {
    nomBtn.disabled = true
  }
  // const alreadyNomed = document.getElementById(`#nom${movie.imdbID}`)
  // console.log(alreadyNomed)
//   if((`#nom${movie.imdbID}`).length > 0){
//     alert('Element exists!');
// } else{
//     alert('Element does not exist!');
// }
  // if ($(`#nom${movie.imdbID}`) in $("#nominations")) {
  //   nomBtn.disabled = true
  // }
  // checkNominations(movie)
  nomBtn.addEventListener("click", () => {
    nomsList.push(movie.imdbID)
    if (nomsList.length > 5){
      console.log(nomsList.length)
      alert("You may only nominate 5 movies!")
      nomsList.pop()
      console.log(nomsList.length)

    } else {
      createNomination(movie)
      nomBtn.disabled = true
      const nomsLength = (document.getElementById("nominations")
                          .getElementsByClassName("nomination-li")
                          .length)
      console.log(nomsLength)
      if (nomsLength == 5) {
        $('#finishedModal').modal('toggle');
      }
    }
  })
  cardBody.appendChild(nomBtn)

  $("#results").append(movieCard)
}

function createNomination(movie) {
  const nom = document.createElement("li")
  nom.setAttribute("class", "nomination-li")
  nom.setAttribute("id", `nom${movie.imdbID}`)

  const nomTitle = document.createElement("span")
  nomTitle.textContent = movie.Title

  const unNomBtn = document.createElement("button")
  unNomBtn.setAttribute("class", "btn btn-info")
  unNomBtn.textContent = "Un-nominate me"
  unNomBtn.addEventListener('click', () => {
    nom.remove()
    console.log(nomsList)
    const nomBtn = document.getElementById(`nomBtn${movie.imdbID}`)
    nomsList = nomsList.filter(item => item !== movie.imdbID)
    console.log(nomsList)
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


