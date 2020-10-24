//myapikey: 3ccb6a1b00ceec9877b2479048318e8c

//just incase doc.rdy
$(document).ready(function () {

    var citySearch = $("#citysearch");
    var apiKey = "3ccb6a1b00ceec9877b2479048318e8c";

    ////----On button click----////
    //---------------------------//

    ///NEED TO ADD ICONS TO WEATHER CARDS///
    $("#search-button").on("click", function () {
        var cityName = citySearch.val();
        getCurrentWeather(); //run current weather
        getWeather(); ///run 5 day function

        function timeConverter(timeStamp) {
            var a = new Date(timeStamp * 1000);
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            var time = date + ' ' + month + ' ' + year;
            //console.log(time);
            return time;
        };
      
        function getCurrentWeather() {
            var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName + "&appid="+ apiKey;
            $("#current-weather").empty();
            //Ajax call 
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response){
                console.log(response);
                var currentTempF = Math.floor((response.main.temp - 273.15) * 1.8 + 32) + " °F";
                var currentHumidity = response.main.humidity + "%";
                var currentWind = Math.floor((response.wind.speed) * 2,237) + "MPH";
                var currentCity = response.name;
                let timeStamp = response.dt;
                timeConverter(timeStamp);
                currentDate = timeConverter(timeStamp);
                var lat = response.coord.lat;
                var lon = response.coord.lon;
               let weatherIcon = response.weather[0].icon;
                

                var card = $("<div>").addClass("card w-100");
                var cardBody = $("<div id=\"current-weather-card-body\">").addClass("card-body");

                var currentTempCard = $("<p>").addClass("").text("Temperature: " + currentTempF);
                var currentCityCard = $("<h4>").addClass("").text(currentCity + " (" + currentDate + ")");
                var currentWindCard = $("<p>").addClass("").text("Wind: " + currentWind);
                var currentHumidityCard = $("<p>").addClass("").text("Humidity: " + currentHumidity);
                var currentWeatherIconCard = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");


                cardBody.append( currentCityCard, currentWeatherIconCard, currentTempCard, currentHumidityCard, currentWindCard);
                card.append(cardBody);

                $("#current-weather").append(card);

                uvIndex(); //run uv index
                function uvIndex(){
                    var uvIndexURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
                    //Ajax Call
                    $.ajax({
                        url: uvIndexURL,
                        method: "GET"
                    }).then(function(response){
                        //console.log(response);
                        var uvIndexResponse = response.value;
                        console.log(uvIndexResponse);
                        var uvCard = $("<p>").addClass("").text("UV Index " + uvIndexResponse);
                        $("#current-weather-card-body").append(uvCard);
                    })
                    
                };
            })
        }

//need to edit the css classes for the weather cards
        function getWeather() {
            
            var queryURL5 = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;
            $("#5-day-weather").empty();
            //Ajax call
            $.ajax({
                url: queryURL5,
                method: "GET"
            }).then(function (response) {
                console.log(response);
                var result = response.list; ///pull list into variable to manipulate
                console.log(result);
                //////work here

                for (var i = 0; i < result.length; i++) {
                  

                    
                    
                    //var day = Number(result[i].dt_txt.split("-")[2].split(' ')[0]); //split out the day from dt_txt to get day for each 3 hour piece
                    //console.log(day); // logs each day 7-8 times since every 3 hours each day

                    if (result[i].dt_txt.indexOf('12:00:00') !== -1) { //using .indexof to search result[i] for 12pm. if not foung nothing happens
                        //if 12pm is found then:
                        var mainTempF = Math.floor((result[i].main.temp - 273.15) * 1.8 + 32) + " °F"; // get main temp from result[i] and convert from kelvin to fahrenheit
                        var weatherMain = (result[i].weather[0].main); // get main weather from results rain/cloudy/sunny etc
                        var windSpeed = Math.floor((result[i].wind.speed) * 2.237) + " MPH"; //convert wind speed from meters per sec to mph
                        let weatherIcon = result[i].weather[0].icon;
                        var humidity = (result[i].main.humidity) + "%"
                        var timeStamp = result[i].dt;
                        timeConverter(timeStamp);
                        var timeConverterVal = timeConverter(timeStamp);
                        //console.log(mainTempF);
                        //console.log(weatherMain);
                        //console.log(windSpeed);
                        //console.log(humidity);


                        var card = $("<div>").addClass("card col-md-2 text-white bg-primary mb-3");
                        var cardBody = $("<div>").addClass(".day");

                        var dayCard = $("<h3>").addClass("card-text").text(timeConverterVal);
                        var mainTempCard = $("<h4>").addClass("card-text").text("Temp: " + mainTempF);
                        var weatherMainCard = $("<p>").addClass("card-text").text(weatherMain);
                        var windSpeedCard = $("<p>").addClass("card-text").text("Wind: " + windSpeed);
                        var humidityCard = $("<p>").addClass("card-text").text("Humidity: " + humidity);
                        var weatherIconCard = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + weatherIcon + ".png").addClass("center");


                        cardBody.append(dayCard, weatherIconCard, weatherMainCard, windSpeedCard, humidityCard, mainTempCard);
                        card.append(cardBody);

                        $("#5-day-weather").append(card);



                    }
                }

            })

        }
    })
})