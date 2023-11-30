-- phpMyAdmin SQL Dump
-- version 5.2.1-1.el7.remi
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 26, 2023 at 02:11 PM
-- Server version: 10.6.15-MariaDB-log
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs340_jensenm3`
--

-- --------------------------------------------------------

--
-- Table structure for table `developers`
--

CREATE TABLE `developers` (
  `idDeveloper` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `foundedDate` date NOT NULL,
  `country` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `developers`
--

INSERT INTO `developers` (`idDeveloper`, `name`, `foundedDate`, `country`) VALUES
(18, 'Microsoft', '2023-11-07', 'USA'),
(19, 'Sony', '2023-11-21', 'Japan'),
(20, 'Rockstar', '2023-11-02', 'USA'),
(21, 'Gemenon', '2023-11-08', 'France'),
(22, 'Ubisoft', '2023-11-14', 'Japan'),
(23, 'Sega', '2023-11-22', 'Japan');

-- --------------------------------------------------------

--
-- Table structure for table `gameHasUsers`
--

CREATE TABLE `gameHasUsers` (
  `idGame` int(11) NOT NULL,
  `idUser` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `gameHasUsers`
--

INSERT INTO `gameHasUsers` (`idGame`, `idUser`) VALUES
(61, 3),
(64, 9),
(65, 8),
(66, 3),
(68, 10);

-- --------------------------------------------------------

--
-- Table structure for table `games`
--

CREATE TABLE `games` (
  `idGame` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `releaseDate` date NOT NULL,
  `genre` varchar(50) NOT NULL,
  `idDeveloper` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `games`
--

INSERT INTO `games` (`idGame`, `title`, `releaseDate`, `genre`, `idDeveloper`) VALUES
(61, 'halo4', '2023-11-15', 'Shooting', 19),
(62, 'Mario 64', '2023-11-08', 'Adventure', NULL),
(64, 'Grand Theft Auto 5', '2023-11-02', 'Adventure', 20),
(65, 'Mario Kart', '2023-11-01', 'Racing', 19),
(66, 'NFL Madden 24', '2023-11-02', 'Sports', 18),
(68, 'Max Payne', '2023-11-15', 'Shooting', 19),
(69, 'Lego', '2023-11-22', 'Adventure', 20);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `idReview` int(11) NOT NULL,
  `idGame` int(11) DEFAULT NULL,
  `idUser` int(11) DEFAULT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` >= 1 and `rating` <= 10),
  `comment` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`idReview`, `idGame`, `idUser`, `rating`, `comment`) VALUES
(7, 61, NULL, 10, 'cool\r\n'),
(10, 62, 5, 9, 'great');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `idUser` int(11) NOT NULL,
  `userName` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `registrationDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`idUser`, `userName`, `email`, `registrationDate`) VALUES
(3, 'JaneDoe', 'jan@example.com', '2021-03-12'),
(5, ' Joe', 'joe@gmail.com', '2023-11-23'),
(7, 'Melissa', 'melissa@gmail.com', '0000-00-00'),
(8, 'John', 'john@gmail.com', '2023-11-23'),
(9, 'user1', 'user1@gmail.com', '2023-11-21'),
(10, 'user2', 'mike@gmail.com', '2023-11-15');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `developers`
--
ALTER TABLE `developers`
  ADD PRIMARY KEY (`idDeveloper`);

--
-- Indexes for table `gameHasUsers`
--
ALTER TABLE `gameHasUsers`
  ADD PRIMARY KEY (`idGame`,`idUser`),
  ADD KEY `idUser` (`idUser`);

--
-- Indexes for table `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`idGame`),
  ADD KEY `idDeveloper` (`idDeveloper`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`idReview`),
  ADD KEY `idGame` (`idGame`),
  ADD KEY `idUser` (`idUser`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`idUser`),
  ADD UNIQUE KEY `userName` (`userName`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `developers`
--
ALTER TABLE `developers`
  MODIFY `idDeveloper` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `games`
--
ALTER TABLE `games`
  MODIFY `idGame` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `idReview` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `idUser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `gameHasUsers`
--
ALTER TABLE `gameHasUsers`
  ADD CONSTRAINT `gameHasUsers_ibfk_1` FOREIGN KEY (`idGame`) REFERENCES `games` (`idGame`) ON DELETE CASCADE,
  ADD CONSTRAINT `gameHasUsers_ibfk_2` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`) ON DELETE CASCADE;

--
-- Constraints for table `games`
--
ALTER TABLE `games`
  ADD CONSTRAINT `games_ibfk_1` FOREIGN KEY (`idDeveloper`) REFERENCES `developers` (`idDeveloper`) ON DELETE SET NULL;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`idGame`) REFERENCES `games` (`idGame`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
