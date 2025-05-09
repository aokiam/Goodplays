// SETUP
// Express
const express = require('express');  // We are using the express library for the web server
const handlebars = require('express-handlebars');
const app = express();               // We need to instantiate an express object to interact with the server in our code
const PORT = 9400;     // Set a port number

// Database 
const db = require('./db-connector');

// Set handlebars as the view engine
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');

// Set the path to views and static files
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

// ROUTES
// Home Page
app.get('/home',(req, res) => {
    res.render('home');
});

// Players page
app.get('/players', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT player_id, username, email FROM Players;");
        res.render('players', { players: rows }); // Pass data to players.handlebars
    } catch (error) {
        console.error("Error fetching players:", error);
        res.status(500).send("Database error.");
    }
});

// Games page
app.get('/games', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT game_id, title, genre, game_platform, release_date FROM Games;");
        res.render('games', { games: rows }); // Pass data to games.handlebars
    } catch (error) {
        console.error("Error fetching games:", error);
        res.status(500).send("Database error.");
    }
});


// GamesPlayed page
app.get('/gamesplayed', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT gameplayed_id, player_id, game_id, status, rating, date_completed, hours_played FROM GamesPlayed;");
        res.render('games', { games: rows }); // Pass data to games.handlebars
    } catch (error) {
        console.error("Error fetching games:", error);
        res.status(500).send("Database error.");
    }
});


// LISTENER

app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});