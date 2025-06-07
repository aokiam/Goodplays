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

// SELECTS -----------------------------------------------------------------------------------------------------------
// Players page
app.get('/players', async (req, res) => {
    try {
        const [rows] = await db.query(`SELECT player_id, username, email, password
                                        FROM Players
                                        ORDER BY player_id ASC;`);
        res.render('players', { players: rows }); // Pass data to players.handlebars
    } catch (error) {
        console.error("Error fetching players:", error);
        res.status(500).send("Database error.");
    }
});

// Games page
app.get('/games', async (req, res) => {
    try {
        const [rows] = await db.query(`SELECT DISTINCT game_id, title, genre, game_platform, DATE_FORMAT(release_date, '%Y-%m-%d') AS format_release_date
                                        FROM Games
                                        ORDER BY game_id ASC;`);
        res.render('games', { games: rows }); // Pass data to games.handlebars
    } catch (error) {
        console.error("Error fetching games:", error);
        res.status(500).send("Database error.");
    }
});


// GamesPlayed page
app.get('/gamesplayed', async (req, res) => {
    try {
        const [rows] = await db.query(`SELECT gameplayed_id, player_id, game_id, status, rating, DATE_FORMAT(date_started, '%Y-%m-%d') AS format_date_started,
                                        DATE_FORMAT(date_completed, '%Y-%m-%d') AS format_date_completed, hours_played
                                        FROM GamesPlayed
                                        ORDER BY gameplayed_id ASC;`);
        const [players] = await db.query(`SELECT player_id, username FROM Players ORDER BY player_id;`);
        const [games] = await db.query(`SELECT game_id, title FROM Games ORDER BY game_id;`);
        const statuses = ['want to play', 'currently playing', 'finished playing'];
        res.render('gamesplayed', { gamesplayed: rows, players, games, statuses}); // Pass data to gamesplayed.handlebars
    } catch (error) {
        console.error("Error fetching gamesplayed:", error);
        res.status(500).send("Database error.");
    }
});

// Friends page
app.get('/friends', async (req, res) => {
    try {
        const [rows] = await db.query(`SELECT f.friendslist_id,
                                            p1.username AS initiated_by, 
                                            p2.username AS friend_added,
                                            DATE_FORMAT(date_added, '%Y-%m-%d') AS format_date_added
                                        FROM Friends f
                                        JOIN Players p1 ON f.initiated_by = p1.player_id
                                        JOIN Players p2 ON f.friend_added = p2.player_id
                                        ORDER BY f.friendslist_id ASC;`);
        const [players] = await db.query(`SELECT player_id, username FROM Players ORDER BY player_id ASC;`);
        res.render('friends', { friends: rows, players }); // Pass data to friends.handlebars
    } catch (error) {
        console.error("Error fetching friends:", error);
        res.status(500).send("Database error.");
    }
});

// PlayersFriends page
app.get('/playersfriends', async (req, res) => {
    try {
        const [rows] = await db.query(`SELECT 
                                            pf.friendslist_id,
                                            pf.player_id, 
                                            pf.friend_id,
                                            p1.username AS player_username,
                                            p2.username AS friend_username, 
                                            pf.status
                                        FROM PlayersFriends pf
                                        JOIN Players p1 ON pf.player_id = p1.player_id
                                        JOIN Players p2 ON pf.friend_id = p2.player_id
                                        ORDER BY pf.friendslist_id ASC;`);
        const statuses = ['pending', 'accepted', 'declined', 'blocked'];
        res.render('playersfriends', { playersfriends: rows, statuses}); // Pass data to playersfriends.handlebars
    } catch (error) {
        console.error("Error fetching playersfriends:", error);
        res.status(500).send("Database error.");
    }
});

// RESET ----------------------------------------------------------------------------------------------------------
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

// DELETES -------------------------------------------------------------------------------------------------------
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
    const friendslistID = req.body.friendslist_id;
    try {
        await db.query(`CALL DeleteFriend(?);`, [friendslistID]);
        res.redirect('/friends');
        console.log('Deleting friendslist_id:', friendslistID);
    } catch (error) {
        console.error('Error running delete:', error);
        res.status(500).send('Delete failed.');
    }
});

// Delete playersfriends
app.post('/deleteplayersfriends', async (req, res) => {
    const friendslistID = req.body.friendslist_id;
    try {
        await db.query(`CALL DeletePlayersFriends(?);`, [friendslistID]);
        res.redirect('/playersfriends');
        console.log('Deleting friendslist_id:', friendslistID);
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

// ADDS -----------------------------------------------------------------------------------------------------
// Add player
app.post('/addplayer', async (req,res) => {
    const { username, email, password } = req.body;
    try{
        await db.query(
            `CALL AddPlayer(?, ?, ?);`,
                [username, email, password]
        );
        res.redirect('/players');
    } catch (error) {
        console.error('Error adding player:', error);
        res.status(500).send('Failed to add player.');
    }
});

// Add game
app.post('/addgame', async (req, res) => {
    const { title, genre, game_platform, release_date } = req.body;
    try{
        await db.query(
            `CALL AddGame(?, ?, ?, ?);`,
                [title, genre, game_platform, release_date]
        );
        res.redirect('/games');
    } catch (error) {
        console.error('Error adding game:', error);
        res.status(500).send('Failed to add game.');
    }
});

// Add friend

app.post('/addfriend', async (req, res) => {
    const { initiated_by, friend_added, date_added } = req.body;
    try{
        const [existingFriendship] = await db.query(
            `SELECT * FROM Friends WHERE
                (initiated_by = ? AND friend_added = ?) OR
                (initiated_by = ? AND friend_added = ?);`,
            [initiated_by, friend_added, friend_added, initiated_by]
        );
        if (existingFriendship.length > 0){
            return res.status(400).send('Friendship already exists.')
        }

        await db.query(
            `CALL AddFriend(?, ?, ?);`,
                [initiated_by, friend_added, date_added]
        );
        res.status(200).send('Friend added!')
        //res.redirect('/friends');
    } catch (error) {
        res.status(500).send('Failed to add friend.');
        }
});


// Add gameplayed
app.post('/addgameplayed', async (req, res) => {
    const { player_id, game_id, status, rating, date_started, date_completed, hours_played } = req.body;
    try{
        await db.query(
            `CALL AddGamePlayed(?, ?, ?, ?, ?, ?, ?);`,
                [player_id, game_id, status, rating, date_started, date_completed, hours_played]
        );
        res.redirect('/gamesplayed');
    } catch (error) {
        console.error('Error adding game played:', error);
        if (error.code === 'ER_DUP_ENTRY'){
            res.status(400).send('Duplicate entry.');
        } else{
        res.status(500).send('Failed to add game played.');
        }
    }
});


// EDITS -------------------------------------------------------------------------------------------------------

// LISTENER

app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl+C to terminate.')
});