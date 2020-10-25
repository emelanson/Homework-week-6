const apiKey = "f63d81a8c2dedf494e6002b9d1978470";
var cityName = "raleigh"

const query = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;


console.log(searchBtn);

// AJAX call is living on the search button
$("#searchBtn").click(function (e) {
    e.preventDefault();

    console.log("SearchInput:", $("#searchInput"));

    cityName = $("#searchInput").val().toLowerCase().trim();
    console.log("cityName:", cityName);

    saveSearch(cityName);

    $.ajax({
        url: query,
        method: "get"
    }).then(response => {

        console.log("response: ", response);

        //set latitutde and longitude of target city for use in further queries
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        console.log("LAT: ", lat, " LON: ", lon);

        displayCurrentConditions(response);
        uvIndexCall(lat, lon);
    });
});


function displayCurrentConditions(city) {

    var temp = city.main.temp;
    var humidity = city.main.humidity;
    var windSpeed = city.wind.speed;

    $("#dateDisplay").text(Date(city.dt));
    $("#tempDisplay").text(`Temperature: ${temp} °F`);
    $("#humidityDisplay").text(`Humidity: ${humidity}%`);
    $("#windDisplay").text(`Wind Speed: ${windSpeed} MPH`);

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

