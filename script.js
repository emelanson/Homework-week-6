const apiKey = "f63d81a8c2dedf494e6002b9d1978470";
var cityName = "raleigh"

//More concise ternary expression form of code I've written for previous projects.
//Checks if there is an existing local storage item, if not, creates an empty array.
//Prevents startup array from overwriting previous data on page load.
//From taniaarascia.com
let prevSearches = localStorage.getItem('searches')
    ? JSON.parse(localStorage.getItem('searches'))
    : []
localStorage.setItem('searches', JSON.stringify(prevSearches));
var searches = JSON.parse(localStorage.getItem('searches'));

//generates list of previous searches in the UI
searches.forEach(city => saveSearch(city));

//populates the page on load using an example query.
weatherSearch();

//listener for the Search button
$("#searchBtn").click(function (e) {
    e.preventDefault();

    cityName = $("#searchInput").val().toLowerCase().trim();


    prevSearches.push(cityName);
    localStorage.setItem('searches', JSON.stringify(prevSearches));

    saveSearch(cityName);

    weatherSearch();
});

//Listener for clear button.  Clears local storage and variables.
$("#clearBtn").click(function (e) {
    e.preventDefault();
    localStorage.setItem('searches', []);
    $("#prevSearches").html("");
    prevSearches = [];
    searches = [];
})

//Listener for clicking on an item from the previous searches list.  Gets event target text and feeds it into 
$("#prevSearches").click(function (e) {
    e.preventDefault();
    let target = $(e.target);

    cityName = target.text();

    weatherSearch();
})


function displayCurrentConditions(city) {

    var temp = city.main.temp;
    var humidity = city.main.humidity;
    var windSpeed = city.wind.speed;
    var icon = city.weather[0].icon;
    var date = returnDateString(city.dt);

    var weatherIcon = $("<img>").attr("src", `https://openweathermap.org/img/wn/${icon}@2x.png`).height("50").width("50");

    $("#cityDisplay").html();
    $("#cityDisplay").html(city.name).append(weatherIcon);
    $("#dateDisplay").text(date);
    $("#tempDisplay").text(`Temperature: ${temp} `);
    $("#humidityDisplay").text(`Humidity: ${humidity}%`);
    $("#windDisplay").text(`Wind Speed: ${windSpeed} MPH`);

}

function fiveDayCall(lat, lon) {
    var fiveDayQuery = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&units=imperial&appid=${apiKey}`;

    $.ajax({
        url: fiveDayQuery,
        method: "get"
    }).then(response => {
        $("#forecastGrid").html("");
        console.log("5day: ", response);
        response.daily.forEach(element => {
            var forecastCard = $("<div>").addClass("card bg-primary rounded-lg text-white p-1 mx-auto");

            var date = returnDateString(element.dt);

            var dateEl = $("<h5>").addClass("card-title").text(date);

            var icon = element.weather[0].icon;
            var weatherIconEl = $("<img>").attr("src", `http://openweathermap.org/img/wn/${icon}@2x.png`).height("50").width("50");
            var tempEl = $("<p>").text(`Temperature: ${element.temp.day} °F`);
            var humidEl = $("<p>").text(`Humidity: ${element.humidity}%`);

            forecastCard.append(dateEl, weatherIconEl, tempEl, humidEl);
            $("#forecastGrid").append(forecastCard);
        });;
    });

}

//Open weather returns unix time stamps which need to be formatted into a short date
function returnDateString(timestamp) {
    let rawDate = moment.unix(timestamp).utc();

    date = rawDate.format("L")
    return date;
}

function saveSearch(city) {
    var previousSearch = $("<div>").addClass("card-body").text(city);
    $("#prevSearches").prepend(previousSearch);
}

function uvIndexCall(lat, lon) {
    var uvQuery = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&cnt=1&appid=${apiKey}`;

    $.ajax({
        url: uvQuery,
        method: "get"
    }).then(response => {
        $("#uvDisplay").html();

        let color;
        response.value < 2 ? color = "light"
            : response.value < 5 ? color = "success"
                : response.value < 7 ? color = "warning"
                    : response.value < 10 ? color = "danger"
                        : color = "dark";


        var uvDiv = $("<div>").text(response.value).addClass(`alert alert-${color}`).attr("role", "alert");
        $("#uvDisplay").html(`UV Index: `).append(uvDiv);
    });
}

function weatherSearch() {

    var query = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;

    $.ajax({
        url: query,
        method: "get"
    }).then(response => {

        console.log("response: ", response);

        //set latitude and longitude of target city for use in further queries
        var lat = response.coord.lat;
        var lon = response.coord.lon;

        displayCurrentConditions(response);
        uvIndexCall(lat, lon);
        fiveDayCall(lat, lon);
    });
}