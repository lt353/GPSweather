/*
Name: Lindsay Trenton
Original Author: Debasis Bhattacharya
Assignment: GPS Coordinates in the Weather App with OpenWeather API 

Description: This code creates a Node.js server using Express, fetches weather data from the OpenWeather API based on a users latitude and longitude coordinates input, and displays the results on a webpage. What I have changed is  that it now uses my own API key instead of the one provided by the professor and stores it using Secrets. I've also changed it to 2 inputs (latitude and longitude) instead of just 1 (zipcode). There are also more outputs now. It is now: Description, Temp, Icon, Humidity, Wind Speed, Cloudiness.  

Date: 03/07/2025
Packages Used:
  - express: Used to create the server and handle HTTP requests.
  - https: Used to send and receive data from external servers (OpenWeather API).
  - body-parser: Used to parse form data submitted by the user (zipcode input).
Environment Variables:
  - lindsayKey: Stores the OpenWeather API key for authentication.
*/

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();

//app.use is a middleware function that allows us to use the body-parser 
app.use(bodyParser.urlencoded({extended: true}));

// sets up the root route ("/") to show the index.html file
// __dirname gives the path to the current folder
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html") // sends the HTML file to the browser
});

// handles what happens when someone submits the form
app.post("/", function(req, res) {
    // grabs the latitude input from the form and converts it to a string
    var lat = String(req.body.latInput);
    // grabs the longitude input from the form and converts it to a string
    var lon = String(req.body.lonInput);
    // prints the latitude & longitude to the console to check if it works
    console.log(`Latitude: ${lat}, Longitude: ${lon}`);

    // sets the temperature units to Fahrenheit
    const units = "imperial";
    // gets the API key from the environment variable I created using Secrets
    const apiKey = process.env['lindsayKey'];
    /* builds the URL we’ll use to get weather info from OpenWeather
     * https://api.openweathermap.org is the base URL
     * /data/2.5/weather is the path to the API endpoint
     * ?lat=" + lat +  "&lon=" + lon + "&units=" + units + "&APPID=" + apiKey are the multiple query parameters which are key-value pairs. 
     */
    const url = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat +  "&lon=" + lon + "&units=" + units + "&APPID=" + apiKey;
    
    // this gets the data from Open WeatherPI by making a GET request to the URL
    https.get(url, function(response) {
        // I've added something to check if the response is successful and if it isn't it will display a message to the user in the browser. 
        if(response.statusCode !== 200) {
            res.send("Error: Unable to fetch weather data. Check your input and try again.");
        }
    console.log(response.statusCode); // prints the status code on console
        
        // listens for chunks of data coming from the API
        response.on("data", function(data){
            const weatherData = JSON.parse(data); //Deserialization - meaning converting the data into a JavaScript object called weatherData
            const temp = weatherData.main.temp;
            const city = weatherData.name;
            const humidity = weatherData.main.humidity; // new output
            const windSpeed = weatherData.wind.speed; // new output
            const cloudiness = weatherData.clouds.all; // new output
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"; // creates the URL for the weather icon
            
            /* 
             * Displays the weather info on the page. It should look something like: 
             * <h1>The weather is light rain in Koloa. </h1>
             * <h3>The temperature is: 77.1 degrees Fahrenheit.</h3>  
             * <h3>The humidity is: 69%.</h3>
             * <h3>The wind speed is: 19.6 mph.</h3>
             * <h3>The cloudiness is: 100%.</h3>
             * and then a picture of the weather icon.
             */
            res.write("<h1> The weather is " + weatherDescription + " in " + city + ".</h1>");
            res.write("<h2>The Temperature is: " + temp.toFixed(1) + " degrees Fahrenheit.</h2>");
            res.write("<h3>The Humidity is: " + humidity + "%.</h3>");
            res.write("<h3>The Wind Speed is: " + windSpeed.toFixed(1) + " MPH.</h3>");
            res.write("<h3>The Cloudiness is: " + cloudiness + "%.</h3>");
            res.write("<img src=" + imageURL +">");
            res.send();
        });
    });
})

//Code will run on 3000 or any available open port
app.listen(process.env.PORT || 3000, function() {
console.log ("Server is running on port")
});
