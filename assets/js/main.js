let YOUR_APP_ID = "47dc8e43";
let YOUR_APP_KEY = "c4048cae0569b57fd480cfbd2172372f";
// DOM elements
let dataLoader = document.getElementById("loader");
let dataRow = document.getElementById("dataRow");
let cardTemplate = document.getElementById("recipeTemplate").content;
let searchForm = document.getElementById("searchForm");
let searchFormError = document.getElementById("Error");
// API status
let apiErrorStatus = false;
let apiError;
// On Page Load
document.addEventListener("DOMContentLoaded", getDataOnLoad);



async function getDataOnLoad() {
    // Word query list
    let searchQueryArray = ["pizza", "pasta", "beef", "fish", "pancake"];
    // Random query word from the list.
    let searchQuery = searchQueryArray[getRandomInt(searchQueryArray.length - 1)];

    // Try to get data from API
    try {
        let response = await fetch(`https://api.edamam.com/search?q=${searchQuery}&app_id=${YOUR_APP_ID}&app_key=${YOUR_APP_KEY}`);
        let data = await response.json();

        // Remove loader if above true
        dataLoader.classList.add("d-none");

        // Render cards using received data
        renderCardData(data);
    } catch (error) {
        // Request Failed, Remove Loader
        dataLoader.classList.add("d-none");
        // Create element and append it to display error message
        let errorMessage = document.createElement("p");
        errorMessage.setAttribute("class", "mt-auto mb-auto fs-3 text-center text-danger");
        errorMessage.textContent = "Something went wrong... Please reload the page or visit the page later.";
        dataRow.appendChild(errorMessage);
        // API onLoad Error
        apiErrorStatus = true;
        apiError = error;
        // Log error in console
        throw new Error(error);
    }
}


function getRandomInt(max) {
    // Generate random int in range 0 to max
    return Math.floor(Math.random() * max);
}
 
// On Input Search
searchForm.addEventListener("submit", onSubmitHandler);

async function onSubmitHandler(event) {
    // Prevent default form reload
    event.preventDefault();

    // Get input data
    let searchInputValue = document.getElementById("search").value;

    // Validate input data
    if (searchInputValue === "") {
        searchFormError.innerHTML = "";
        let paragraphWarning = document.createElement("p");
        paragraphWarning.setAttribute("class", "mt-2 text-danger fs-6");
        paragraphWarning.textContent = "Search field must not empty.";
        searchFormError.appendChild(paragraphWarning);
        return;
    }

    if (apiErrorStatus === true) {
        searchFormError.innerHTML = "";
        let paragraphWarning = document.createElement("p");
        paragraphWarning.setAttribute("class", "mt-2 text-danger fs-6");
        paragraphWarning.textContent = "Something went wrong. Please try to reload the page.";
        searchFormError.appendChild(paragraphWarning);
        return;
    }

    // Try to query data from API using input value
    try {
        searchFormError.innerHTML = "";
        // Get data from API
        let response = await fetch(`https://api.edamam.com/search?q=${searchInputValue}&app_id=${YOUR_APP_ID}&app_key=${YOUR_APP_KEY}`);
        let data = await response.json();

        // Clear cards from dataRow
        dataRow.innerHTML = "";
        // Render cards using received data
        renderCardData(data);
    } catch (error) {
        searchFormError.innerHTML = "";
        let paragraphWarning = document.createElement("p");
        paragraphWarning.setAttribute("class", "mt-2 text-danger fs-6");
        paragraphWarning.textContent = "Search failed please try again later.";
        searchFormError.appendChild(paragraphWarning);
        throw new Error(error);
    }
}

function renderCardData(data) {
    // Render data using html5 template element content
    for (let i = 0; i < data.hits.length; i++) {
        // Copy template
        let templateCopy = document.importNode(cardTemplate, true);

        templateCopy.querySelector(".card-img-top").setAttribute('src', data.hits[i].recipe.image);
        templateCopy.querySelector(".card-title").textContent = data.hits[i].recipe.label;
        templateCopy.querySelector(".card-text").textContent = data.hits[i].recipe.ingredientLines[0] + data.hits[i].recipe.ingredientLines[1] + data.hits[i].recipe.ingredientLines[3] + "...";
        templateCopy.querySelector(".recipeLink").setAttribute("href", data.hits[i].recipe.shareAs);
        templateCopy.querySelector(".recipeLink").setAttribute("target", "_blank");

        dataRow.appendChild(templateCopy);
    }
}