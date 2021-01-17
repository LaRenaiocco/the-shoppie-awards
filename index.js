"use strict"

// Tracks how many films have been nominated
let nomsList = [];

// handles submit of movie search form
$("#submit-btn").on("click", (evt) => {
  evt.preventDefault();
  const searchWords = $("#search-input").val();
  const searchQuery = prepareQuery(splitInput(searchWords));
  const url = `https://www.omdbapi.com/?&apikey=5a67b678&s=${searchQuery}&type="movie"`
  movieRequest(url);
  $("#movie-search")[0].reset();
});

// returns user input split into a list
function splitInput(words) {
  return words.split(" ");
};

// creates single string with + between words for query
function prepareQuery(words_list) {
  let query = "";
  words_list.forEach(word => {
    query += word + "+";
  });
  return query.slice(0, -1);
};

// sends request to OMDB API
function movieRequest(url) {
  $.get(url, (data) => {
    $("#results").empty()
    if (data.Response === "False") {
      alert(`${data.Error} Please check your spelling!`)
    } else {
      const movies = data.Search;
      movies.forEach(movie => {
        createMovieCard(movie)
      });
    };
  });
};

// Creates card for each movie returned in search result
function createMovieCard(movie) {
  const movieCard = document.createElement("div");
  movieCard.setAttribute("class", "card");
  movieCard.setAttribute("id", `card${movie.imdbID}`);

  // card head will show movie poster if it exists
  const cardHead = document.createElement("img");
  cardHead.setAttribute("class", "card-img-top");
  if (movie.Poster === "N/A") {
    cardHead.src = "no_image.png";
  } else {
    cardHead.src = movie.Poster;
  }
	movieCard.appendChild(cardHead);

  // card body includes title, release date and a nomination button
	const cardBody = document.createElement("div");
	cardBody.setAttribute("class", "card-body");
	movieCard.appendChild(cardBody);

	const cardTitle = document.createElement("div");
	cardTitle.setAttribute("class", "card-title");
	cardTitle.textContent = movie.Title;
  cardBody.appendChild(cardTitle);
    
  const movieYear = document.createElement("div");
	movieYear.setAttribute("class", "card-text");
	movieYear.textContent = `Released: ${movie.Year}`;
  cardBody.appendChild(movieYear);
    
  const nomBtn = document.createElement("button");
  nomBtn.setAttribute("class", "btn btn-light nom-btn");
  nomBtn.setAttribute("id", `nomBtn${movie.imdbID}`);
  nomBtn.textContent = "Nominate Me";
  cardBody.appendChild(nomBtn);

  // checks if movies is already nominated, disables button if true
  if (nomsList.includes(movie.imdbID)) {
    nomBtn.disabled = true;
  };

  // event handler for nomination button
  nomBtn.addEventListener("click", () => {
    // adds movie to nomination array, prevents adding if 5 movies are
    // already nominated
    nomsList.push(movie.imdbID);
    if (nomsList.length > 5){
      alert("You may only nominate 5 movies!");
      nomsList.pop();
    } else {
      createNomination(movie);
      // disable nomination button
      nomBtn.disabled = true;
      // triggers finished banner if 5 movies are nominated
      const nomsLength = (document.getElementById("nominations")
                          .getElementsByClassName("nomination-li")
                          .length);
      if (nomsLength == 5) {
        $('#finishedModal').modal('toggle');
      };
    };
  });
  // add completed movie card to results div
  $("#results").append(movieCard)
};

// creates nomination information for nominations unordered list
function createNomination(movie) {
  const nom = document.createElement("li")
  nom.setAttribute("class", "nomination-li")
  nom.setAttribute("id", `nom${movie.imdbID}`)

  const nomTitle = document.createElement("span")
  nomTitle.textContent = movie.Title

  // button handles removing nomination if user changes mind
  const unNomBtn = document.createElement("button")
  unNomBtn.setAttribute("class", "btn btn-light un-nom-btn")
  unNomBtn.textContent = "Un-nominate me"
  unNomBtn.addEventListener('click', () => {
    nom.remove()
    const nomBtn = document.getElementById(`nomBtn${movie.imdbID}`)
    nomsList = nomsList.filter(item => item !== movie.imdbID)
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


