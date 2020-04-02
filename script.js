$(document).ready(function() {
    //variables
    var userInput;
    var weatherReturned;
    var citiesSearched = $("#cityBtns");

    var cityHist;

    var weatherCard = $("#weatherCard");
    var dayForecast = $("#dayForecast");

    var authKey = "70e75079715aaa88f8897acff6d0352b";
    var forecastQuery = "https://api.openweathermap.org/data/2.5/forecast?appid="+authKey+"&q=";
    var weatherQuery = "https://api.openweathermap.org/data/2.5/weather?appid="+authKey+"&q=";
    var uvQuery = "https://api.openweathermap.org/data/2.5/uvi?appid="+authKey;


    function kelvinToF(temp){
        return ((temp - 273.15)*(9/5) + 32).toFixed(2);
    }

    function kelvinToC(temp){
        return (temp - 273.15).toFixed(2);
    }

    $(document).on("click","#searchButton", function(){
        //console.log("soemthing");
        userInput = $("#weatherInput").val()
        //console.log(userInput);
        
            $.ajax({ 
                 url:weatherQuery+userInput,
                 method:"GET",

             })
             .then(function(response){
                var time = moment();
                weatherEl.empty();
                var tempF = kelvinToF(response.main.temp);
                $("#weatherEl").append("Temperature in Fahrenheit: " + tempF);
                var tempC = kelvinToC(response.main.temp);
                $("#weatherEl").append("Temperature in Celsius: " + tempC);
                
                // var time = moment();
             })
    })
    userInput.on("submit", cityAdded);





});