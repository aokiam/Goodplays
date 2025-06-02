DELIMITER //

CREATE PROCEDURE ResetGoodplays()
BEGIN
    SET FOREIGN_KEY_CHECKS = 0;
-- clear data in the tables
    TRUNCATE TABLE Players;
    TRUNCATE TABLE Friends;
    TRUNCATE TABLE PlayersFriends;
    TRUNCATE TABLE Games;
    TRUNCATE TABLE GamesPlayed;

-- Insert example data into the Players table--------------
INSERT INTO Players (username, email, password)
VALUES ('gamer_kid', 'gamer_kid@email.com', 'g@m3rP@55'),
       ('racergirl12', 'racingislife@email.com', 'r@c3c@r!'),
       ('tetrislover99', 'retrogames1@email.com', 'tetetet3t0ris');

-- Insert example data into the Friends table--------------
INSERT INTO Friends (initiated_by, date_added)
VALUES (1, NULL),
       (1, '2023-04-20'),
       (3, NULL);

-- Insert example data into the PlayerFriends table--------------
INSERT INTO PlayersFriends (player_id, friend_id, status)
VALUES (1, 2, 'declined'),
       (2, 1, 'accepted'),
       (3, 2, 'pending');



-- Insert example data into the Games table--------------
INSERT INTO Games (title, genre, game_platform, release_date)
VALUES ('Minecraft', 'Fantasy', 'PC, Mobile, Linux, Mac, Xbox One, Xbox Series X/S, Playstation 4/5', '2011-11-18'),
       ('The Sims 4', 'Simulation', 'PC, Mac, Playstation 4, Xbox One', '2015-02-17'),
       ('Monster Hunter Wilds', 'Action RPG', 'PC, Playstation 5, Xbox Series X/S', '2025-02-28'),
       ('Metaphor: ReFantazio', 'JRPG', 'PC, Playstation 4/5, Xbox Series X/S', '2024-10-11'),
       ('World of Warcraft', 'Fantasy', 'PC, Mac, Android', '2004-11-23');


-- Insert example data into the GamesPlayed table--------------
INSERT INTO GamesPlayed (player_id, game_id, status, rating, date_started, date_completed, hours_played)
VALUES (1, 3, 'currently playing', 10.0, '2025-02-28', NULL, 326),
       (2, 2, 'want to play', NULL, NULL, NULL, 0),
       (3, 4, 'finished playing', 9.4, '2025-03-23', '2025-05-03', 100),
       (1, 1, 'finished playing', 5.5, '2020-06-27', '2020-08-17', 93);

END //

-- CUD Procedure to demonstrate RESET
CREATE PROCEDURE DeletePlayer(IN pid INT)
BEGIN
    DELETE FROM Players WHERE player_id = pid;
SET FOREIGN_KEY_CHECKS = 1;
END //

DELIMITER ;