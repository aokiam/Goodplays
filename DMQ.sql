-- DMQ.SQL created by Janessa Moreno and Allyson Aoki.------------

-- PLAYERS TABLE -------------------------------
-- Insert into Players table
INSERT INTO Players(username, email, password)
VALUES (@username, @email, @password);
-- View all Players
SELECT * FROM Players
-- Update Player's username
UPDATE Players
SET username = @new_username WHERE player_id = @player_id;
-- Update Player's email
UPDATE Players
SET email = @new_email WHERE player_id = @player_id;
-- Update Player's password
UPDATE Players
SET password = @new_password WHERE player_id = @player_id;
-- Delete a Player
DELETE FROM Players WHERE player_id = @player_id;


-- FRIENDS TABLE -------------------------------
-- View all friend
SELECT * FROM Friends;
-- Delete a friend
DELETE FROM Friends WHERE friend_id = @friend_id;


-- GAMES TABLE -------------------------------
-- Insert into games table
INSERT INTO Games(title, genre, game_platform, release_date)
VALUES (@title, @genre, @game_platform, @release_date);
-- View all games
SELECT * FROM Games
-- Update Games's title
UPDATE Games
SET title = @new_title WHERE game_id = @game_id;
-- Update Games's genre
UPDATE Games
SET genre = @new_genre WHERE game_id = @game_id;
-- Update Games's game platform
UPDATE Games
SET game_platform = @new_game_platform WHERE game_id = @game_id;
-- Update Games's release date
UPDATE Games
SET release_date = @new_release_date WHERE game_id = @game_id;
-- Delete a game
DELETE FROM Games WHERE game_id = @game_id;


-- GAMESPLAYED TABLE -------------------------------
-- View all games played
SELECT * FROM GamesPlayed;
-- Update GamesPlayed's status
UPDATE GamesPlayed 
SET status = @new_status WHERE gameplayed_id = @gameplayed_id;
-- Update GamesPlayed's rating
UPDATE GamesPlayed 
SET rating = @new_rating WHERE gameplayed_id = @gameplayed_id;
-- Update GamesPlayed's date started
UPDATE GamesPlayed 
SET date_started = @new_date_started WHERE gameplayed_id = @gameplayed_id;
-- Update GamesPlayed's date completed
UPDATE GamesPlayed 
SET date_completed = @new_date_completed WHERE gameplayed_id = @gameplayed_id;
-- Update GamesPlayed's hours played
UPDATE GamesPlayed 
SET hours_played = @new_hours_played WHERE gameplayed_id = @gameplayed_id;
-- Delete a gameplayed
DELETE FROM GamesPlayed WHERE gameplayed_id = @gameplayed_id;


-- PLAYERSFRIENDS TABLE -------------------------------
-- Update status
UPDATE PlayersFriends
SET status = @new_status WHERE player_id = @player_id;
-- View all PlayersFriends
SELECT * FROM PlayersFriends;
-- Delete a friend from a player
DELETE FROM PlayersFriends WHERE player_id = @player_id AND friend_id = @friend_id;

-- Friendly view for form drop downs
SELECT player_id, username FROM Players;
SELECT game_id, title FROM Games;

-- GamesPlayed joined view
SELECT 
    gp.gamesplayed_id,
    p.username,
    g.title,
    gp.status,
    gp.rating,
    gp.date_started,
    gp.date_completed,
    gp.hours_played
FROM GamesPlayed on gp
JOIN Players p ON gp.player_id = p.player_id
JOIN Games g ON gp.game_id = g.game_id;

-- Friends joined value
SELECT
    pf.player_id,
    p1.username AS player_username,
    pf.friend_id,
    f.initiated_by,
    p2.username AS initiated_by_username,
    pf.status
FROM PlayersFriends pf
JOIN Players p1 ON pf.player_id = p1.player_id
JOIN Friends f ON pf.friend_id = f.friend_id
JOIN Players p2 ON f.initiated_by = p2.player_id;

