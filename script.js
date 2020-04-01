$(document).ready(function() {
    //variables
    var userInput;
    var weatherReturned;
    var authKey = "70e75079715aaa88f8897acff6d0352b";
    var curWeatherQry = "https://api.openweathermap.org/data/2.5/weather?appid="+authKey+"&q=";

    function kelvinToF(temp){
        return ((temp - 273.15)*(9/5) + 32).toFixed(2);
    }

    $(document).on("click","#searchButton", function(){
        console.log("soemthing");
        userInput = $("#weatherInput").val()
        console.log(userInput);
        
            $.ajax({ 
                 url:curWeatherQry+userInput,
                 method:"GET",

             })
             .then(function(response){
                var temperature = kelvinToF(response.main.temp);
                $("#weatherResults").append("Temperature: " + temperature);
                
                // var time = moment();
             })
    })
    





});