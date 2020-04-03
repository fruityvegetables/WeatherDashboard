$(document).ready(function() {
    //variables
    //var forecastCity = $(this).data('city');
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
    
    //fxns
    function kelvinToF(temp){
        return ((temp - 273.15)*(9/5) + 32).toFixed(2);
    }

    function kelvinToC(temp2){
        return (temp2 - 273.15).toFixed(2);
    }

    function getUV(response){
        //get the UV index via ajax call
        $.ajax({
            url:uvQuery+"&lat="+response.coord.lat+"&lon="+response.coord.lon, 
            method:"GET"
        })
        .then(function(uvresponse){
            //console.log(uvresponse);
            var uv = uvresponse.value;
            var uvScale;
    
            //set class name based on severity of UV
            if(uv < 3 ){uvScale = "uvLow"}
            else if(uv < 6 ){uvScale = "uvMed"}
            else if(uv < 8 ){uvScale = "uvHigh"}
            else if(uv < 11 ){uvScale = "uvVeryHigh"}
            else{uvScale = "uvExtreme"}
            
            //add index and appropriate class
            $("#uvDiv").append( $("<span/>",{
                class:"uv "+uvScale, text:uv
        }));
        });
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
                // var time = moment();
                //weatherCard.empty();

                var tempF = kelvinToF(response.main.temp);
                $("#weatherResults").append("Temperature in Fahrenheit: " + tempF + "   ");
                var tempC = kelvinToC(response.main.temp);
                $("#weatherResults").append("Temperature in Celsius: " + tempC + "   ");
                var humidity = response.main.humidity;
                $("#weatherResults").append("Humidity: " + humidity + "%   ");
                var windSpeed = response.wind.speed;
                $("#weatherResults").append("Wind Speed: " + windSpeed + "   mph");
                $("#weatherResults").append($('<div/>',{
                    id:"uvDiv",text:"UV Index: " + getUV(response)
                
                }));
                
             })
             function printWeatherForecast(){
                $.ajax({
                    url:forecastQuery+userInput,
                    method:"GET",
                })
                .then(function(response){
                    console.log(response);
                    dayForecast.empty()
                    //loop through all 3 hour increments returned, looking for the ones at noon
                    for (chunk of response.list){
                        if(chunk.dt_txt.includes("12:00:00")){
                            //console.log(chunk);
                            //create card
                            dayForecast.append( 
                                $("<div/>",{class:"card bg-primary text-center text-white border border-white p-2 col-xs-12 col-sm-6 col-md-4 col-lg"}).append([
                                    $("<div/>",{class:"font-weight-bold", text:moment.unix(chunk.dt).format("MM/DD/YYYY")}),
                                    $('<h3/>',{text:response.name}).append(
                                        chunk.weather
                                    ),
                                    $('<div/>',{text:"Temp: "+kelvinToF(chunk.main.temp)+"°F"}),
                                    $('<div/>',{text:"Humidity: "+chunk.main.humidity+"%"})
                                ])
                            )
            
                        }
                    }
                });
            }
            printWeatherForecast();
    })

});