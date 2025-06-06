// 5/5/2025
// adapted from https://canvas.oregonstate.edu/courses/1999601/assignments/10006370?module_item_id=25352883 

// SETUP
// Express
const express = require('express');  // We are using the express library for the web server
const { engine } = require('express-handlebars');
const app = express();               // We need to instantiate an express object to interact with the server in our code
const PORT = 19494;     // Set a port number


// Database 
const db = require('./db-connector');

// Set handlebars as the view engine
app.engine('handlebars', engine());
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// Set the path to views and static files
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static('public'));


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
        const [rows] = await db.query("SELECT game_id, title, genre, game_platform, DATE_FORMAT(release_date, '%Y-%m-%d') AS format_release_date FROM Games;");
        res.render('games', { games: rows }); // Pass data to games.handlebars
    } catch (error) {
        console.error("Error fetching games:", error);
        res.status(500).send("Database error.");
    }
});


// GamesPlayed page
app.get('/gamesplayed', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT gameplayed_id, player_id, game_id, status, rating, DATE_FORMAT(date_started, '%Y-%m-%d') AS format_date_started, DATE_FORMAT(date_completed, '%Y-%m-%d') AS format_date_completed, hours_played FROM GamesPlayed;");
        res.render('gamesplayed', { gamesplayed: rows }); // Pass data to gamesplayed.handlebars
    } catch (error) {
        console.error("Error fetching gamesplayed:", error);
        res.status(500).send("Database error.");
    }
});

// Friends page
app.get('/friends', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT friend_id, initiated_by, DATE_FORMAT(date_added, '%Y-%m-%d') AS format_date_added FROM Friends;");
        res.render('friends', { friends: rows }); // Pass data to friends.handlebars
    } catch (error) {
        console.error("Error fetching friends:", error);
        res.status(500).send("Database error.");
    }
});

// PlayersFriends page
app.get('/playersfriends', async (req, res) => {
    try {
        const [rows] = await db.query(`SELECT pf.player_id, pf.friend_id, pf.status,
                                            p1.username AS player_username,
                                            p2.username AS friend_username
                                        FROM PlayersFriends AS pf
                                        JOIN Players p1 ON pf.player_id = p1.player_id
                                        JOIN Players p2 ON pf.friend_id = p2.player_id;`);
        res.render('playersfriends', { playersfriends: rows }); // Pass data to playersfriends.handlebars
    } catch (error) {
        console.error("Error fetching playersfriends:", error);
        res.status(500).send("Database error.");
    }
});

// reset procedure
app.get('/reset', async (req, res) => {
    try{
        await db.query(`CALL ResetGoodplays();`);
        res.redirect('/');
    } catch (error) {
        console.error('Error resetting database:', error);
        res.status(500).send('Database reset error');
    }
});

// Delete player
app.post('/deleteplayer', async (req, res) => {
    const playerID = req.body.player_id;
    try {
        await db.query(`CALL DeletePlayer(?);`, [playerID]);
        res.redirect('/players');
        console.log('Deleting player_id:', playerID);
    } catch (error) {
        console.error('Error running delete:', error);
        res.status(500).send('Delete failed.');
    }
});

// Delete friend
app.post('/deletefriend', async (req, res) => {
    const friendID = req.body.friend_id;
    try {
        await db.query(`CALL DeleteFriend(?);`, [friendID]);
        res.redirect('/friends');
        console.log('Deleting friend_id:', friendID);
    } catch (error) {
        console.error('Error running delete:', error);
        res.status(500).send('Delete failed.');
    }
});

// Delete player
app.post('/deleteplayersfriends', async (req, res) => {
    const playerID = req.body.player_id;
    try {
        await db.query(`CALL DeletePlayersFriends(?);`, [playerID]);
        res.redirect('/playersfriends');
        console.log('Deleting player_id:', playerID);
    } catch (error) {
        console.error('Error running delete:', error);
        res.status(500).send('Delete failed.');
    }
});


// Delete game
app.post('/deletegame', async (req, res) => {
    const gameID = req.body.game_id;
    try {
        await db.query(`CALL DeleteGame(?);`, [gameID]);
        res.redirect('/games');
        console.log('Deleting game_id:', gameID);
    } catch (error) {
        console.error('Error running delete:', error);
        res.status(500).send('Delete failed.');
    }
});

// Delete gamesplayed
app.post('/deletegamesplayed', async (req, res) => {
    const gameplayedID = req.body.gameplayed_id;
    try {
        await db.query(`CALL DeleteGamesPlayed(?);`, [gameplayedID]);
        res.redirect('/gamesplayed');
        console.log('Deleting gamesplayed_id:', gameplayedID);
    } catch (error) {
        console.error('Error running delete:', error);
        res.status(500).send('Delete failed.');
    }
});



// LISTENER

app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl+C to terminate.')
});