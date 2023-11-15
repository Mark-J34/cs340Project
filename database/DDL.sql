-- DDL for GameHub Central Database

-- Setting up the environment for safe import
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- Dropping tables if they exist (to avoid conflicts during import)
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS gameHasUsers;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS developers;

-- Table for Developers
CREATE TABLE developers (
    idDeveloper INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    foundedDate DATE NOT NULL,
    country VARCHAR(100) NOT NULL
);

-- Table for Games
CREATE TABLE games (
    idGame INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    releaseDate DATE NOT NULL,
    genre VARCHAR(50) NOT NULL,
    idDeveloper INT,
    FOREIGN KEY (idDeveloper) REFERENCES developers(idDeveloper) ON DELETE SET NULL
);

-- Table for Users
CREATE TABLE users (
    idUser INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    registrationDate DATE NOT NULL
);

-- Table for Reviews
CREATE TABLE reviews (
    idReview INT AUTO_INCREMENT PRIMARY KEY,
    idGame INT,
    idUser INT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 10),
    comment TEXT NOT NULL,
    FOREIGN KEY (idGame) REFERENCES games(idGame) ON DELETE CASCADE,
    FOREIGN KEY (idUser) REFERENCES users(idUser) ON DELETE SET NULL
);

-- Many to Many table for games and users
CREATE TABLE gameHasUsers (
    idGame INT,
    idUser INT,
    PRIMARY KEY (idGame, idUser),
    FOREIGN KEY (idGame) REFERENCES games(idGame) ON DELETE CASCADE,
    FOREIGN KEY (idUser) REFERENCES users(idUser) ON DELETE CASCADE
);

-- Insert initial data into games
INSERT INTO games (title, releaseDate, genre, idDeveloper) 
VALUES 
    ('World of Warcraft', '2004-11-23', 'MMORPG', 1), 
    ('Minecraft', '2011-11-18', 'Sandbox', 2), 
    ('Super Mario Bros', '1985-09-13', 'Platformer', 3);


INSERT INTO developers (name, foundedDate, country)
VALUES
    ('Blizzard Entertainment', '1991-02-08', 'USA'),
    ('Mojang Studios', '2009-05-17', 'Sweden'),
    ('Nintendo', '1889-09-23', 'Japan');

-- Insert initial data into users
INSERT INTO users (userName, email, registrationDate) 
VALUES 
    ('JohnDoe', 'john.doe@example.com', '2021-10-01'),
    ('JaneSmith', 'jane.smith@example.com', '2021-09-15'),
    ('JaneDoe', 'jan@example.com', '2021-03-12');

-- Insert initial data into reviews
INSERT INTO reviews (idGame, idUser, rating, comment) 
VALUES 
    (1, 1, 9, 'Amazing graphics and gameplay!'),
    (2, 2, 8, 'Great storyline but some bugs encountered.'),
    (1, 3, 8, 'Great game to play when bored.');

-- Insert initial data into gameHasUsers
INSERT INTO gameHasUsers(idGame, idUser)
VALUES
    (1,2),
    (1,1),
    (2,3);

-- Environment cleanup
SET FOREIGN_KEY_CHECKS=1;
COMMIT;


