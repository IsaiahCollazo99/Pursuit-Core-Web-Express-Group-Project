DROP DATABASE IF EXISTS hotbox_db;
CREATE DATABASE hotbox_db;

\c hotbox_db;

DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS post;
DROP TABLE IF EXISTS followings; 
DROP TABLE IF EXISTS pictures;
DROP TABLE IF EXISTS users;

CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL UNIQUE,
    birth_date VARCHAR,
    city TEXT,
    state TEXT,
    email VARCHAR, 
    password VARCHAR,
    bet_history VARCHAR
);


CREATE TABLE posts
(
    id SERIAL PRIMARY KEY,
    poster_id INT REFERENCES users(id) ON DELETE CASCADE,
    body TEXT
);

CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    liker_id INT REFERENCES users(id) ON DELETE CASCADE,
    post_id INT REFERENCES posts(id) ON DELETE CASCADE 
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    commenter_id INT REFERENCES users(id) ON DELETE CASCADE,
    post_id INT REFERENCES posts(id) ON DELETE CASCADE,
    body TEXT
);

CREATE TABLE pictures (
    id SERIAL PRIMARY KEY,
    owners_id INT REFERENCES users(id) ON DELETE CASCADE,
    picture VARCHAR 
);

CREATE TABLE followings (
    id SERIAL PRIMARY KEY,
    follower_id INT REFERENCES users(id) ON DELETE CASCADE,
    followed_id INT REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE bets (
    id SERIAL PRIMARY KEY,
    game_id VARCHAR,
    team_id VARCHAR, 
    bet_id INT REFERENCES users(id) ON DELETE CASCADE,
    bet_amount INTEGER,
    taker_id INT REFERENCES users(id) ON DELETE CASCADE
);


INSERT INTO users (full_name, birth_date, city, state, email, password, bet_history)
VALUES ('Isaiah Collazo', '10/01/1999', 'Brooklyn', 'NY', 'isaiahcollazo@pursuit.org', 'expo', '4-0'),
('Brandon Floyd-Mayweather Brown', '02/06/1996', 'Brooklyn', 'NY', 'brandonbrown@pursuit.org', 'secret', '50-0'),
('Crystal Cardona', '02/09/1992', 'New York', 'NY', 'crystalcardona@pursuit.org', 'yerrrr', '5-0' ),
('Wil Santos', '04/14/1986', 'Brooklyn', 'NY', 'wilghensantos@gmail.com', 'deLoMio','12-1');

INSERT INTO posts (poster_id, body)
VALUES (1, 'Whats crackin'),
(1, 'Im 4-0 wassup'),
(3, 'Yerrrr');

INSERT INTO comments (commenter_id, post_id, body)
VALUES (2, 2, 'Im 50-0 whats good');

INSERT INTO likes (liker_id, post_id)
VALUES (3, 1),
(4, 1),
(4, 2);