-- DDL.SQL created by Janessa Moreno and Allyson Aoki.------------

-- Drop tables to avoid errors----------------
DROP TABLE IF EXISTS GamesPlayed;
DROP TABLE IF EXISTS PlayersFriends;
DROP TABLE IF EXISTS Friends;
DROP TABLE IF EXISTS Games;
DROP TABLE IF EXISTS Players;


-- Table for players-------------
CREATE TABLE Players(
    player_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(25) NOT NULL UNIQUE,
    email VARCHAR(75) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL
);

-- Table for games-----------------
CREATE TABLE Games(
    game_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    genre VARCHAR(50) NOT NULL,
    game_platform VARCHAR(100) NOT NULL,
    release_date DATE NOT NULL
);

-- Table for friends--------------
CREATE TABLE Friends(
    friend_id INT NOT NULL UNIQUE,
    PRIMARY KEY (friend_id)
);

-- Intersection table for PlayersFriends--------------
CREATE TABLE PlayersFriends(
    friend_id INT NOT NULL,
    player_id INT NOT NULL, 
    status ENUM ('pending', 'accepted', 'blocked', 'declined') NOT NULL,
    PRIMARY KEY (player_id, friend_id),
    FOREIGN KEY (player_id) REFERENCES Players(player_id) ON UPDATE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES Friends(friend_id) ON UPDATE CASCADE
);

-- Table for GamesPlayed--------------
CREATE TABLE GamesPlayed(
    gameplayed_id INT PRIMARY KEY AUTO_INCREMENT,
    player_id INT NOT NULL,
    game_id INT NOT NULL,
    status ENUM('finished playing', 'currently playing', 'want to play') ,
    rating DECIMAL(3,1) CHECK (rating >= 0 AND rating <= 10),
    date_started DATE,
    date_completed DATE,
    hours_played INT DEFAULT 0,
    UNIQUE (player_id, game_id),
    FOREIGN KEY (player_id) REFERENCES Players(player_id) ON UPDATE CASCADE,
    FOREIGN KEY (game_id) REFERENCES Games(game_id) ON UPDATE CASCADE
);

-- Insert example data into the Players table--------------
INSERT INTO Players (username, email, password)
VALUES ('gamer_kid', 'gamer_kid@email.com', 'g@m3rP@55'),
       ('racergirl12', 'racingislife@email.com', 'r@c3c@r!'),
       ('tetrislover99', 'retrogames1@email.com', 'tetetet3t0ris');

-- Insert example data into the Friends table--------------
INSERT INTO Friends (friend_id)
VALUES (1), (2), (3);

-- Insert example data into the PlayerFriends table--------------
INSERT INTO PlayersFriends (player_id, friend_id, status)
VALUES (1, 2, 'declined'),
       (2, 1, 'accepted'),
       (3, 2, 'pending');



-- Insert example data into the Games table--------------
INSERT INTO Games (title, genre, game_platform, release_date)
VALUES ('Minecraft', 'Fantasy', 'PC', '2011-11-18'),
       ('The Sims 4', 'Simulation', 'PC', '2015-02-17'),
       ('World of Warcraft', 'Fantasy', 'PC', '2004-11-23');

-- Insert example data into the GamesPlayed table--------------
INSERT INTO GamesPlayed (player_id, game_id, status, rating, date_started, date_completed, hours_played)
VALUES (1, 1, 'finished playing', 5, '2025-02-04', '2025-05-01', 120),
       (2, 2, 'want to play', 4, '2024-12-17', NULL, 0),
       (3, 3, 'finished playing', 4, '2024-04-23', '2025-04-30', 230);