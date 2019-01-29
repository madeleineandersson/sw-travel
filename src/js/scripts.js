"use strict";

const searchForm = document.getElementById("search-form"),
  input = document.getElementById("input"),
  searchResults = document.getElementsByClassName("search-results")[0],
  searchResultItems = searchResults.getElementsByTagName("li"),
  noSearchResultsText = document.getElementsByClassName("no-results")[0],
  instructionsText = document.getElementsByClassName("instructions")[0],
  heading = document.getElementsByClassName("heading")[0],
  originalHeading = heading.getElementsByTagName("h2")[0];

let totalSearchResults = [],
  timeout = null;

input.addEventListener("keyup", search);
document.addEventListener("click", closeSearchResults);
searchForm.addEventListener("submit", () => event.preventDefault());
searchResults.addEventListener("click", updateText);
searchResults.addEventListener("keyup", () => {
  if (event.key === "Enter") {
    closeSearchResults(event);
    updateText(event);
  }
});

function search(event) {
  const query = event.target.value.toLowerCase(),
    url = `https://swapi.co/api/planets/?search=${query}`;
  if (event.key === "Escape") {
    closeSearchResults(event);
  } else if (query.length < 3) {
    removeChildNodes(searchResults);
    toggleNoSearchResultsText(false);
  } else {
    totalSearchResults = [];
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fetch(url)
        .then(resp => resp.json())
        .then(data => {
          data.results.map(planet => {
            totalSearchResults.push(planet.name);
          });
          if (data.next) {
            getData(data.next, query);
          } else if (query === input.value.toLowerCase()) {
            displaySearchResults(query);
            filterSearchResults(query);
            toggleNoSearchResultsText(searchResultItems);
          }
        })
        .catch(error => console.error(`Error: ${error}`));
    }, 800);
  }
  toggleInstructionsText(query);
}

function displaySearchResults(query) {
  totalSearchResults.map(planet => {
    const existingPlanet = searchResults.querySelectorAll(
      `[data-planet-name='${planet}']`
    );
    if (existingPlanet.length === 0 && planet.toLowerCase().startsWith(query)) {
      const li = document.createElement("li"),
        text = document.createTextNode(planet);
      li.appendChild(text);
      li.setAttribute("data-planet-name", planet);
      li.setAttribute("tabindex", 0);
      searchResults.appendChild(li);
    }
  });
}

function filterSearchResults(query) {
  Array.from(searchResultItems).map(li => {
    if (!li.innerHTML.toLowerCase().startsWith(query))
      searchResults.removeChild(li);
  });
}

function closeSearchResults(event) {
  if (
    (searchResultItems.length !== 0 && event.target !== input) ||
    event.key === "Escape"
  ) {
    input.value = "";
    removeChildNodes(searchResults);
  }
}

function removeChildNodes(element) {
  while (element.hasChildNodes()) {
    element.removeChild(element.firstChild);
  }
}

function toggleNoSearchResultsText(searchResultItems) {
  searchResultItems.length === 0
    ? noSearchResultsText.classList.remove("hidden")
    : noSearchResultsText.classList.add("hidden");
}

function toggleInstructionsText(query) {
  if (query.length > 0 && query.length < 3) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (query === input.value.toLowerCase()) {
        instructionsText.classList.remove("hidden");
      }
    }, 800);
  } else {
    instructionsText.classList.add("hidden");
  }
}

function updateText(event) {
  const planet = event.target.dataset.planetName,
    planetInformation = document.createTextNode(`You're on ${planet}.`),
    h2 = document.createElement("h2"),
    updatedHeading = "Travel to another Star Wars planet.";
  h2.appendChild(planetInformation);
  heading.insertBefore(h2, originalHeading);
  originalHeading.textContent == updatedHeading
    ? heading.removeChild(heading.firstChild)
    : (originalHeading.textContent = updatedHeading);
}
