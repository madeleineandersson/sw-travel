"use strict";var searchForm=document.getElementById("search-form"),input=document.getElementById("input"),searchResults=document.getElementsByClassName("search-results")[0],searchResultItems=searchResults.getElementsByTagName("li"),noSearchResultsText=document.getElementsByClassName("no-results")[0],instructionsText=document.getElementsByClassName("instructions")[0],heading=document.getElementsByClassName("heading")[0],originalHeading=heading.getElementsByTagName("h2")[0],totalSearchResults=[],timeout=null;function search(e){var t=e.target.value.toLowerCase(),s="https://swapi.co/api/planets/?search="+t;"Escape"===e.key?closeSearchResults(e):t.length<3?(removeChildNodes(searchResults),toggleNoSearchResultsText(!1)):(totalSearchResults=[],clearTimeout(timeout),timeout=setTimeout(function(){fetch(s).then(function(e){return e.json()}).then(function(e){e.results.map(function(e){totalSearchResults.push(e.name)}),e.next?getData(e.next,t):t===input.value.toLowerCase()&&(displaySearchResults(t),filterSearchResults(t),toggleNoSearchResultsText(searchResultItems))}).catch(function(e){return console.error("Error: "+e)})},800)),toggleInstructionsText(t)}function displaySearchResults(n){totalSearchResults.map(function(e){if(0===searchResults.querySelectorAll("[data-planet-name='"+e+"']").length&&e.toLowerCase().startsWith(n)){var t=document.createElement("li"),s=document.createTextNode(e);t.appendChild(s),t.setAttribute("data-planet-name",e),t.setAttribute("tabindex",0),searchResults.appendChild(t)}})}function filterSearchResults(t){Array.from(searchResultItems).map(function(e){e.innerHTML.toLowerCase().startsWith(t)||searchResults.removeChild(e)})}function closeSearchResults(e){(0!==searchResultItems.length&&e.target!==input||"Escape"===e.key)&&(input.value="",removeChildNodes(searchResults))}function removeChildNodes(e){for(;e.hasChildNodes();)e.removeChild(e.firstChild)}function toggleNoSearchResultsText(e){0===e.length?noSearchResultsText.classList.remove("hidden"):noSearchResultsText.classList.add("hidden")}function toggleInstructionsText(e){0<e.length&&e.length<3?(clearTimeout(timeout),timeout=setTimeout(function(){e===input.value.toLowerCase()&&instructionsText.classList.remove("hidden")},800)):instructionsText.classList.add("hidden")}function updateText(e){var t=e.target.dataset.planetName,s=document.createTextNode("You're on "+t+"."),n=document.createElement("h2"),a="Travel to another Star Wars planet.";n.appendChild(s),heading.insertBefore(n,originalHeading),originalHeading.textContent==a?heading.removeChild(heading.firstChild):originalHeading.textContent=a}input.addEventListener("keyup",search),document.addEventListener("click",closeSearchResults),searchForm.addEventListener("submit",function(){return event.preventDefault()}),searchResults.addEventListener("click",updateText),searchResults.addEventListener("keyup",function(){"Enter"===event.key&&(closeSearchResults(event),updateText(event))});