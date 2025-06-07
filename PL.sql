DELIMITER //

-- RESET DATABASE --------------------------------------------------------------------------------------------
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
INSERT INTO Friends (initiated_by, friend_added, date_added)
VALUES (1, 2, NULL),
       (1, 3, '2023-04-20'),
       (3, 2, NULL);


-- Insert example data into the PlayerFriends table--------------
INSERT INTO PlayersFriends (friendslist_id, player_id, friend_id, status)
VALUES (1, 1, 2, 'declined'),
       (2, 1, 3, 'accepted'),
       (3, 3, 2, 'pending');



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

-- DELETE CRUD PROCEDURES ------------------------------------------------------------------------------------
-- delete all instances of players with the given pid -------------------------
CREATE PROCEDURE DeletePlayer(IN pid INT)
BEGIN
    DECLARE uname VARCHAR(25);

    -- Get username associated with pid
    SELECT username INTO uname
    FROM `Players`
    WHERE player_id = pid;

    -- delete all records of attributes with given pid
    DELETE FROM Players WHERE player_id = pid;
    DELETE FROM PlayersFriends WHERE player_id = pid;
    DELETE FROM Friends WHERE initiated_by = uname;
    DELETE FROM GamesPlayed WHERE player_id = pid;
SET FOREIGN_KEY_CHECKS = 1;
END //

-- delete all instances of friends with the given fid ----------------------------
CREATE PROCEDURE DeleteFriend(IN fid INT)
BEGIN
    DECLARE player INT;
    DECLARE friend INT;

    -- get player and friend involved from the Friends table
    SELECT p1.player_id, p2.player_id
    INTO player, friend
    FROM Friends f
    JOIN Players p1 ON f.initiated_by = p1.username
    JOIN Players p2 ON f.friend_added = p2.username
    WHERE f.friendslist_id = fid;

    DELETE FROM Friends WHERE friendslist_id = fid;
    DELETE FROM PlayersFriends
    WHERE (player_id = player AND friend_id = friend) OR (player_id = friend AND friend_id = player);

SET FOREIGN_KEY_CHECKS = 1;
END //

-- delete all instances of games with the given gid -----------------------
CREATE PROCEDURE DeleteGame(IN gid INT)
BEGIN
    DELETE FROM Games WHERE game_id = gid;
    DELETE FROM GamesPlayed WHERE game_id = gid;
SET FOREIGN_KEY_CHECKS = 1;
END //

-- delete all instances of playersfriends with the given pfid ---------------------------
CREATE PROCEDURE DeletePlayersFriends(IN pfid INT)
BEGIN
    -- delete all records associated with pfid
    DELETE FROM PlayersFriends WHERE friendslist_id = pfid;
    DELETE FROM Friends WHERE friendslist_id = pfid;
SET FOREIGN_KEY_CHECKS = 1;
END //

-- delete all gamesplayed with the given gpid ---------------------------
CREATE PROCEDURE DeleteGamesPlayed(IN gpid INT)
BEGIN
    DELETE FROM GamesPlayed WHERE gameplayed_id = gpid;
SET FOREIGN_KEY_CHECKS = 1;
END //


-- ADD CRUD PROCEDURES ---------------------------------------------------------------------------------------
-- add new player -------------------------------------
CREATE PROCEDURE AddPlayer(
    IN in_username VARCHAR(25),
    IN in_email VARCHAR(75),
    IN in_password VARCHAR(50)
)
BEGIN  
    INSERT INTO Players (username, email, password) 
    VALUES (in_username, in_email, in_password);

SET FOREIGN_KEY_CHECKS = 1;
END // 

-- add new game ---------------------------------------
CREATE PROCEDURE AddGame(
    IN in_title VARCHAR(200),
    IN in_genre VARCHAR(50),
    IN in_game_platform VARCHAR(255),
    IN in_release_date DATE
)
BEGIN   
    INSERT INTO Games (title, genre, game_platform, release_date)
    VALUES (in_title, in_genre, in_game_platform, in_release_date);
SET FOREIGN_KEY_CHECKS = 1;
END //

-- add new friend ---------------------------------------
CREATE PROCEDURE AddFriend(
    IN in_initiated_by INT,
    IN in_friend_added INT,
    IN in_date_added DATE
)
BEGIN
    DECLARE next_friendslist_id INT;
    -- insert into friends table -------------------
    IF in_date_added = '0000-00-00' THEN
        INSERT INTO Friends (initiated_by, friend_added, date_added)
        VALUES (in_initiated_by, in_friend_added, NULL);   
    ELSE
        INSERT INTO Friends (initiated_by, friend_added, date_added)
        VALUES (in_initiated_by, in_friend_added, in_date_added);
    END IF;

    SET next_friendslist_id = LAST_INSERT_ID();
    -- insert into playersfriends table ---------------------
    IF in_date_added = '0000-00-00' THEN
        INSERT INTO PlayersFriends (friendslist_id, player_id, friend_id, status)
        VALUES (next_friendslist_id, in_initiated_by, in_friend_added, 'pending');
    ELSE
        INSERT INTO PlayersFriends (friendslist_id, player_id, friend_id, status)
        VALUES (next_friendslist_id, in_initiated_by, in_friend_added, 'accepted');
    END IF;
SET FOREIGN_KEY_CHECKS = 1;
END //

-- add a new game played ------------------------------
CREATE PROCEDURE AddGamePlayed(
    IN in_pid INT,
    IN in_gid INT,
    IN in_status VARCHAR(50),
    IN in_rating DECIMAL(3,1),
    IN in_date_started DATE,
    IN in_date_completed DATE,
    IN in_hours_played INT
)
BEGIN
    IF in_status = 'want to play' THEN
        INSERT INTO GamesPlayed (player_id, game_id, status, rating, date_started, date_completed, hours_played)
        VALUES (in_pid, in_gid, in_status, NULL, NULL, NULL, 0);
    ELSEIF in_status = 'currently playing' THEN
        INSERT INTO GamesPlayed (player_id, game_id, status, rating, date_started, date_completed, hours_played)
        VALUES (in_pid, in_gid, in_status, in_rating, in_date_started, NULL, in_hours_played);
    ELSEIF in_status = 'finished playing' THEN
        INSERT INTO GamesPlayed (player_id, game_id, status, rating, date_started, date_completed, hours_played)
        VALUES (in_pid, in_gid, in_status, in_rating, in_date_started, in_date_completed, in_hours_played);
    END IF;
SET FOREIGN_KEY_CHECKS = 1;
END //

-- EDIT CRUD PROCEDURES --------------------------------------------------------------------------------------
DELIMITER ;