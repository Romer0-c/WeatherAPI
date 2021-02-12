

// This is our API key
var APIKey = "166a433c57516f51dfab1f7edaed8413";

var cityHistory = [];



$(document).ready(function () {
    var cityInput = $("#input");
    


    cityHistory = localStorage.getItem("cityHistory") ? JSON.parse(localStorage.getItem("cityHistory")) : [];
    console.log(cityHistory, "city history from inital render");
    //click handler should call the api and save the searched city to local storage. 

    $("#btn").click(function (event) {
        event.preventDefault();
        console.log(cityInput.val());
        getWeatherData(cityInput.val());
        saveToLocalStorage(cityInput.val());
        getFiveDay(cityInput.val());
        renderCities();
    });
});

function checkDuplicateLS(searchedCity) {
    var citiesFromStorage = JSON.parse(localStorage.getItem("cityHistory")) || [];
    console.log(citiesFromStorage, "cities from Check Duplicates");
    console.log(searchedCity, "cities from searchedCity");

    var matches = citiesFromStorage.filter(cityFromStorage => {
        return cityFromStorage.toLowerCase() === searchedCity.toLowerCase()
    })
    console.log(matches);
    return matches.length !== 0;
}



function saveToLocalStorage(city) {
    if (localStorage.getItem("cityHistory") && !checkDuplicateLS(city)) {
        let cities = JSON.parse(localStorage.getItem("cityHistory"));
        cities.push(city);
        localStorage.setItem("cityHistory", JSON.stringify(cities));
    } else if (!localStorage.getItem("cityHistory")) {
        localStorage.setItem("cityHistory", JSON.stringify([city]));
    } else {
        alert("City is already in history");
    };

}


function renderCities() {
    var htmlContent = "";
    var citiesFromStorage = JSON.parse(localStorage.getItem("cityHistory")) || [];
    citiesFromStorage.forEach(cityFromStorage => {
        htmlContent += `<button class="searched-btn" data-name="${cityFromStorage}">${cityFromStorage}</button>`
    });

    $(".city").html(htmlContent);
};


function getWeatherData(citySearched) {



    // Here we are building the URL we need to query the database
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${citySearched}&appid=${APIKey}&units=imperial`;

    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // We store all of the retrieved data inside of an object called "response"
        .then(function (response) {

            // Log the queryURL
            console.log(queryURL);

            // Log the resulting object
            console.log(response);

            // Transfer content to HTML

            $(".city-name").html(response.name + " Weather Details");
            $(".wind").text("Wind Speed: " + response.wind.speed);
            $(".humidity").text("Humidity: " + response.main.humidity);
            $(".api-icon").attr("src", `http://openweathermap.org/img/w/${response.weather[0].icon}.png`);
            // Convert the temp to fahrenheit
            //var tempF = (response.main.temp - 273.15) * 1.80 + 32;

            // add temp content to html
            $(".temp").text("Temperature" + response.main.temp + "F ");
            //$(".tempF").text("Temperature (F) " + tempF.toFixed(2));

            // Log the data in the console as well
            // console.log("Wind Speed: " + response.wind.speed);
            // console.log("Humidity: " + response.main.humidity);
            // console.log("Temperature (F): ");
            var uvQuery = `https://api.openweathermap.org/data/2.5/onecall?lat=${response.coord.lat}&lon=${response.coord.lon}&appid=${APIKey}`
            $.ajax({
                url: uvQuery,
                method: "GET"
            })
            .then(function(uvResponse){
                console.log(uvResponse);
                $(".UV").text(uvResponse.current.uvi)
            })
        });

};


function getFiveDay(citySearched) {



    var fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?q=${citySearched}&appid=${APIKey}&units=imperial`;

    $.ajax({
        url: fiveDayURL,
        method: "GET"
    })
        .then(function(response){
            console.log(response)

            $("#day1").html(response.list[0].main.temp)
            $("#day2").text("")
        });

};


$(document).on("click", ".searched-btn", function(){
    var cityButton = $(this).attr("data-name");
    getWeatherData(cityButton);
    getFiveDay(cityButton);
    
    
});

renderCities();