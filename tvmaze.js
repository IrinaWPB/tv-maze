

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");
const $episodesList = $("#episodes-list");
const $episodeBtn = $(".getEpisodes");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const res = await axios.get(`https://api.tvmaze.com/search/shows?q=${term}`);
  const showArr = res.data;
  const searchedTermShows = [];
    for(let showObj of showArr) {
      const { id, name, summary, image } = showObj.show;
      searchedTermShows.push({ id, name, summary, image }); 
    }
  console.log(searchedTermShows);
  return searchedTermShows;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    let imgSrc = "https://tinyurl.com/tv-missing";
    if (show.image) {
      imgSrc = show.image.original;
    }
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${imgSrc}"; 
              alt="${show.name}"; 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-secondary getEpisodes">
               Episodes
             </button>            
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show); 
    }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const termVal = $("#search-query").val();
  console.log(termVal);
  const shows = await getShowsByTerm(termVal);

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
  const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  const foundEpisodes =  res.data;
  return foundEpisodes;
}

function populateEpisodes(episodes) { 
  $episodesList.empty();

  for (let episode of episodes) {
    const newLi = document.createElement('li');
    newLi.innerHTML = `${episode.name} (season ${episode.season}, number ${episode.number})`;
    $episodesList.append(newLi);
    console.log(newLi);
    console.log($episodesList);
  }
  $episodesArea.show();

}
$showsList.on('click', '.getEpisodes', async function(e) {
  const clickedShowID = e.target.parentElement.parentElement.parentElement.dataset.showId;
  const getEpisodes = await getEpisodesOfShow(clickedShowID);
  console.log(getEpisodes);
  populateEpisodes(getEpisodes);
});
