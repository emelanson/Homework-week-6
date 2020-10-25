const apiKey = "f63d81a8c2dedf494e6002b9d1978470";
var cityName = "raleigh"

const query = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;
// const uvQuery;

console.log(searchBtn);

// AJAX call is living on the search button
$("#searchBtn").click(function (e) {
    e.preventDefault();

    console.log("SearchInput:", $("#searchInput"));

    cityName = $("#searchInput").val().toLowerCase().trim();
    console.log("cityName:", cityName);

    $.ajax({
        url: query,
        method: "get"
    }).then(response => {

        console.log("response: ", response);

        //set latitutde and longitude of target city for use in further queries
        let lat = response.coord.lat;
        let lon = response.coord.lon;
        console.log("LAT: ", lat, " LON: ", lon);

        displayCurrentConditions(response);
        uvIndexCall(lat, lon);
        updateUi(response)
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

// function uvIndexCall(lat, lon) {

// }

