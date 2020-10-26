const apiKey = "f63d81a8c2dedf494e6002b9d1978470";
var cityName = "raleigh"

console.log(searchBtn);

//listener for the Search button
$("#searchBtn").click(function (e) {
    e.preventDefault();

    console.log("SearchInput:", $("#searchInput"));

    cityName = $("#searchInput").val().toLowerCase().trim();
    console.log("cityName:", cityName);

    saveSearch(cityName);

    weatherSearch();
});


function displayCurrentConditions(city) {

    var temp = city.main.temp;
    var humidity = city.main.humidity;
    var windSpeed = city.wind.speed;

    var icon = city.weather[0].icon;
    var weatherIconEl = $("img").attr("src", `http://openweathermap.org/img/wn/${icon}@2x.png`).height("50").width("50")
    var date = returnDateString(city.dt);

    $("#cityDisplay").text(city.name).append(weatherIconEl);
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
        console.log("5day: ", response);
        response.daily.forEach(element => {
            var forecastCard = $("<div>").addClass("card bg-primary");

            var date = returnDateString(element.dt);
            console.log("ELEMENT.DT: ", element.dt);

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
    console.log("DATE:", date);
    console.log("rawDATE:", rawDate);
    return date;
}

function saveSearch(city) {
    var previousSearch = $("<div>").addClass("card-body").text(city);
    $("#prevSearches").prepend(previousSearch);
}


function uvIndexCall(lat, lon) {
    var uvQuery = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&cnt=1&appid=${apiKey}`;

    $.ajax({
        url: uvQuery,
        method: "get"
    }).then(response => {
        $("#uvDisplay").text(`UV Index: ${response.value}`);
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
        console.log("LAT: ", lat, " LON: ", lon);

        displayCurrentConditions(response);
        uvIndexCall(lat, lon);
        fiveDayCall(lat, lon);
    });
}