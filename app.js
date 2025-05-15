// SETUP
// Express
const express = require('express');  // We are using the express library for the web server
const { engine } = require('express-handlebars');
const app = express();               // We need to instantiate an express object to interact with the server in our code
const PORT = 19494;     // Set a port number

// Database 
const db = require('./db-connector');

// Set handlebars as the view engine
app.engine('handlebars', engine({
    helpers:{
        formatDate: function(date){
            return new Date(date).toISOString().split('T')[0];
        }
    }
}));
app.set('view engine', 'handlebars');

// Set the path to views and static files
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

// ROUTES
// Home Page
app.get('/',(req, res) => {
    res.render('home');
});

// Players page
app.get('/players', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT player_id, username, email, password FROM Players;");
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
        const [rows] = await db.query("SELECT gameplayed_id, player_id, game_id, status, rating, date_started, date_completed, hours_played FROM GamesPlayed;");
        res.render('gamesplayed', { gamesplayed: rows }); // Pass data to gamesplayed.handlebars
    } catch (error) {
        console.error("Error fetching gamesplayed:", error);
        res.status(500).send("Database error.");
    }
});

// Friends page
app.get('/friends', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT friend_id, initiated_by, date_added FROM Friends;");
        res.render('friends', { friends: rows }); // Pass data to friends.handlebars
    } catch (error) {
        console.error("Error fetching friends:", error);
        res.status(500).send("Database error.");
    }
});

// Friends page
app.get('/playersfriends', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT player_id, friend_id, status FROM PlayersFriends;");
        res.render('playersfriends', { playersfriends: rows }); // Pass data to playersfriends.handlebars
    } catch (error) {
        console.error("Error fetching playersfriends:", error);
        res.status(500).send("Database error.");
    }
});


// LISTENER

app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl+C to terminate.')
});