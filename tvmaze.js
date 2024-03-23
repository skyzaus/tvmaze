"use strict";

//make var from html id's'
const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const $episodesList = $("#episodesList");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.

  const res = await axios({
    //api url with param params: {q: term,}

    baseURL: "http://api.tvmaze.com/",
    url: "search/shows",
    method: "GET",
    params: {
      q: term,
    },
  });
  console.log(term);
  console.log(res);
  console.log(res.data.map);
  console.log(res.data);
  //return id, premiered, name, summary, and image from api
  //ternary operator for items that could be missing elements

  return res.data.map((info) => {
    const show = info.show;
    console.log(show);
    console.log(show.ended);
    return {
      id: show.id,
      premiered: show.premiered,
      name: show.name,
      ended: show.ended ? show.ended : "Still Airing",
      summary: show.summary,
      language: show.language,
      image: show.image
        ? show.image.medium
        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTafPTG77xlakoXS0NGCaBbGVZkLlDVlwvuQbzntXFNA&s",
    };
  });
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-3 mb-4">
         <div class="media">
           <img
              <img src="${show.image}" alt="${show.name}" class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <h5 class="text-primary">Air date: ${show.premiered}</h5>
             <h5 class="text-primary">End date: ${show.ended}</h5>
             <h5 class="text-primary">language: ${show.language}</h5>
             
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const res = await axios({
    baseURL: "http://api.tvmaze.com/",
    url: `shows/${id}/episodes`,
    method: "GET",
  });

  return res.data.map((episode) => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
  }));
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
  $episodesList.empty();
  //loop through the episodes
  for (let episode of episodes) {
    //make a var for the episodes to
    const $item = $(
      `<li >
         ${episode.name}
         (season ${episode.season}, episode ${episode.number})
       </li>
      `
    );
    console.log($item);
    $episodesList.append($item);
  }

  $episodesArea.show();
}

/** Given list of episodes, create markup for each and to DOM */

/** Handle click on episodes button: get episodes for show and display */

async function getEpisodesAndDisplay(evt) {
  // here's one way to get the ID of the show: search "closest" ancestor
  // with the class of .Show (which is put onto the enclosing div, which
  // has the .data-show-id attribute).
  const showId = $(evt.target).closest(".Show").data("show-id");

  // here's another way to get the ID of the show: search "closest" ancestor
  // that has an attribute of 'data-show-id'. This is called an "attribute
  // selector", and it's part of CSS selectors worth learning.
  // const showId = $(evt.target).closest("[data-show-id]").data("show-id");

  const episodes = await getEpisodesOfShow(showId);
  populateEpisodes(episodes);
}

//make event listener
$showsList.on("click", ".Show-getEpisodes", getEpisodesAndDisplay);
