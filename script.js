const apiKey = "c3c1a045cccd3ac9bab65c900b3fe759";
var cityName = "raleigh"

const query = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

console.log(searchBtn);

// Here is the AJAX call
$("#searchBtn").click(function (e) {
    e.preventDefault();

    console.log("SearchInput:", $("#searchInput"));

    cityName = $("#searchInput").val().toLowerCase().trim();
    console.log("cityName:", cityName);

    $.ajax({
        url: query,
        method: "get"
    }).then(
        updateUi()
    );
});


