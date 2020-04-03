$(document).ready(function () {
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //variables ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var userInput;
    var citiesSearched = $("#cityBtns");

    var dayForecast = $("#dayForecast");

    var searchHistorySection = $("#searchHistory");

    // search history array
    var searchHistoryArr = [];

    var authKey = "70e75079715aaa88f8897acff6d0352b";
    var forecastQuery = "https://api.openweathermap.org/data/2.5/forecast?appid=" + authKey + "&q=";
    var weatherQuery = "https://api.openweathermap.org/data/2.5/weather?appid=" + authKey + "&q=";
    var uvQuery = "https://api.openweathermap.org/data/2.5/uvi?appid=" + authKey;

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //fxns~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //convert to Fahrenheit
    function kelvinToF(temp) {
        return ((temp - 273.15) * (9 / 5) + 32).toFixed(2);
    }
    //convert to Celsius
    function kelvinToC(temp2) {
        return (temp2 - 273.15).toFixed(2);
    }
    // get UV index
    function getUV(response) {
        //ajax call
        $.ajax({
            url: uvQuery + "&lat=" + response.coord.lat + "&lon=" + response.coord.lon,
            method: "GET"
        })
            .then(function (uvresponse) {
                //console.log(uvresponse);
                var uv = uvresponse.value;
                var uvScale;

                //class name is set on uv number
                if (uv < 3) { uvScale = "uvLow" }
                else if (uv < 6) { uvScale = "uvMed" }
                else if (uv < 8) { uvScale = "uvHigh" }
                else if (uv < 11) { uvScale = "uvVeryHigh" }
                else { uvScale = "uvExtreme" }

                //add index and class
                $("#uvDiv").append($("<span/>", {
                    class: "uv " + uvScale, text: uv
                }));
            });
    }


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //event handlers & fxns~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // click event for history buttons
    $(document).on("click", ".cityChip", function () {
        // user input = name of city button clicked
        userInput = $(this).text();
        // call fxn to display data
        getWeatherData();
    })

    // putting history array in local storage
    function storeSearchHistory() {
        localStorage.setItem("searchHistoryArr", JSON.stringify(searchHistoryArr));
    }

    // fxn to render search history buttons
    function renderSearchHistory() {
        // clears search history first
        searchHistorySection.html("");
        // creates unordered list and adds button classes to them
        var searchHistoryUl = $("<ul>").addClass("uk-slider-items uk-grid cityChips");
        for (var i = 0; i < searchHistoryArr.length; i++) {
            // creates list and adds classes
            var newSearchLi = $("<li>").addClass("sliderItem uk-padding");
            var newSearchSpan = $("<span>").addClass("uk-button uk-button-default uk-button-small cityChip");
            var newSearchDelete = $("<span>").addClass("uk-icon-button uk-light closeBtn");
            // set contents
            newSearchSpan.text(searchHistoryArr[i]);
            newSearchDelete.attr("uk-icon", "close");
            // appends to each unordered list
            newSearchSpan.append(newSearchDelete);
            newSearchLi.append(newSearchSpan);
            searchHistoryUl.prepend(newSearchLi);
        }
        // appends unordered list to history section
        searchHistorySection.append(searchHistoryUl);
    }

    init();

    // initializing history fxn
    function init() {
        // gets history array from localstorage...
        var storedSearchHistory = JSON.parse(localStorage.getItem("searchHistoryArr"));
        // if array was found, add it to stored variable
        if (storedSearchHistory !== null) {
            searchHistoryArr = storedSearchHistory;
        }
        // renders array 
        renderSearchHistory();
    }
    // click event to search for city that the user inputs
    $(document).on("click", "#searchButton", function () {
        userInput = $("#weatherInput").val()
        getWeatherData();
    })
    // fxn to get weather data
    function getWeatherData() {
        // first, empty previous results otherwise causes quite a mess...
        $("#weatherResults").empty();
        // if the user input is not empty...
        if (userInput !== "" && searchHistoryArr.indexOf(userInput) == -1) {
            // push it to the history array...
            searchHistoryArr.push(userInput);
            // store it in local storage...
            storeSearchHistory();
            // render it on screen...
            renderSearchHistory();
            // and clear the input field.
            $("#weatherInput").val("");
        }
        //console.log(userInput);

        //ajax call for weather data
        $.ajax({
            url: weatherQuery + userInput,
            method: "GET",

        })
            .then(function (response) {
                // var time = moment();
                // console.log(response);

                /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                VARIABLES AND THE PATH IN THE OBJECT TO DISPLAY THEM:
                ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

                var tempF = kelvinToF(response.main.temp);
                $("#weatherResults").append("Temperature in Fahrenheit: " + tempF + "   ");
                var tempC = kelvinToC(response.main.temp);
                $("#weatherResults").append("Temperature in Celsius: " + tempC + "   ");
                var icon = $("<img>").attr({ src: "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png", alt: "weatherIcon" });
                $("#weatherResults").append(icon);
                var humidity = response.main.humidity;
                $("#weatherResults").append("Humidity: " + humidity + "%   ");
                var windSpeed = response.wind.speed;
                $("#weatherResults").append("Wind Speed: " + windSpeed + "   mph");
                $("#weatherResults").append($('<div/>', {
                    id: "uvDiv", text: "UV Index: " + getUV(response)

                }));

            })
        // displays weather forecast...
        function printWeatherForecast() {
            // ajax call for the forecast
            $.ajax({
                url: forecastQuery + userInput,
                method: "GET",
            })
                .then(function (response) {
                    //console.log(response);

                    //empties the forecast...
                    dayForecast.empty()
                    //loops through returned properties for "noon"...
                    for (piece of response.list) {
                        if (piece.dt_txt.includes("12:00:00")) {
                            //console.log(piece);

                            //appends the forecast for each noon "piece" found in next five days
                            dayForecast.append(
                                $("<div/>", { class: "card bg-primary text-center text-white border border-white p-2 col-xs-12 col-sm-6 col-md-4 col-lg" }).append([
                                    $("<div/>", { class: "font-weight-bold", text: moment.unix(piece.dt).format("MM/DD/YYYY") }),
                                    $('<h3/>', { text: response.name }).append(
                                        piece.weather
                                    ),
                                    $('<div/>', { text: "Temp: " + kelvinToF(piece.main.temp) + "°F" }),
                                    $('<div/>', { text: "Humidity: " + piece.main.humidity + "%" })
                                ])
                            )

                        }
                    }
                });
        }
        // fxn call to print forecast
        printWeatherForecast();

    }

});