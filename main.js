let YOUR_APP_ID = "47dc8e43"; 
let YOUR_APP_KEY = "c4048cae0569b57fd480cfbd2172372f";
let searchForm = document.getElementById("searchForm");

searchForm.addEventListener("submit", onSubmitHandler);



async function onSubmitHandler(event){
    event.preventDefault();
    let searchInputValue = document.getElementById("search").value;
    let response = await fetch(`https://api.edamam.com/search?q=${searchInputValue}&app_id=${YOUR_APP_ID}&app_key=${YOUR_APP_KEY}`)
    let data = await response.json();
    console.log(data);
};

