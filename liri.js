require("dotenv").config();

var keys = require("./keys.js");

//Request for OMDB API Module
var request = require("request");

//Spotify-API NPM Module
var Spotify = require("node-spotify-api");

//Twitter npm Module
var Twitter = require("twitter");

var fs = require("fs");

var action = process.argv[2];
var value = process.argv[3];

doSomething(action, value);

function doSomething(action, value) {

  // Conditions
  switch (action) {
    case "my-tweets":
      myTweets();
      break;

    case "spotify-this-song":
      spotifyThisSong();
      break;

    case "movie-this":
      movieThis();
      break;

    case "do-what-it-says":
      doWhatItSays();
      break;

    default:
      console.log("Unexpected command line argument");
  }

}

//Functions

function movieThis() {
  if (value === undefined) {
    value = "Mr. Nobody";
  }

  //set up query to OMDB API
  var queryUrl = "http://www.omdbapi.com/?t=" + value + "&apikey=trilogy";

  request(queryUrl, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log("======================== MOVIE INFO FOR *" + value.toUpperCase() + "*: ========================");
      console.log("Title:  " + JSON.parse(body).Title);
      console.log("Year of Release:  " + JSON.parse(body).Year);
      console.log("IMDB Rating:  " + JSON.parse(body).Ratings[0].Value);
      console.log("Rotten Tomatoes Rating:  " + JSON.parse(body).Ratings[1].Value);
      console.log("Country of Production:  " + JSON.parse(body).Country);
      console.log("Language:  " + JSON.parse(body).Language);
      console.log("Plot:  " + JSON.parse(body).Plot);
      console.log("Actors:  " + JSON.parse(body).Actors);
    }
  });
}

function spotifyThisSong() {

  if (value === undefined) {
    value = "The Sign (Ace of Base)";
  }

  var spotify = new Spotify(keys.spotify);

  spotify.search({ type: "track", query: value, limit: 1 }, function (err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }

    var songInfo = data.tracks.items[0];

    console.log("======================== SONG INFO FOR *" + value.toUpperCase() + "*: ========================");
    console.log("Artist(s):  " + songInfo.artists[0].name);
    console.log("Song Name:  " + songInfo.name);
    console.log("Album:  " + songInfo.album.name);
    if (songInfo.preview_url === null) {
      console.log("No song preview link available");
    } else {
      console.log("Album Preview URL:  " + songInfo.preview_url);
    }
  });

}

function myTweets() {
  var client = new Twitter(keys.twitter);

  var params = { screen_name: "celia70093923", count: 20 };
  client.get("statuses/user_timeline", params, function (error, tweets, response) {
    if (!error) {
      console.log("======================== CELIA'S MOST RECENT 20 TWEETS: ========================");
      for (var i = 0; i < tweets.length; i++) {
        console.log("Tweet No." + (i + 1) + ": " + tweets[i].text);
        console.log("Created at: " + tweets[i].created_at);
      }
    }
  });
}

function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      return console.log("Do What It Says Error: " + error);
    }

    else {
      //console.log(data);
      var dataArr = data.split(",");
      //console.log(dataArr);

      action = dataArr[0];
      value = dataArr[1];

      doSomething(action, value);
    }

  });

}