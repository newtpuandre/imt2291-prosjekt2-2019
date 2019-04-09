SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


CREATE TABLE `Person` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


INSERT INTO `Person` (`id`, `name`) VALUES
(1, 'William'),
(2, 'Marc'),
(3, 'John');

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` bigint(20) NOT NULL,
  `givenName` varchar(128) NOT NULL,
  `lastName` varchar(128) NOT NULL,
  `email` varchar(128) NOT NULL,
  `studyProgram` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `givenName`, `lastName`, `email`, `studyProgram`) VALUES
(1, 'JÃ¸rgen Aamot', 'Caspersen', 'jorgenac@stud.ntnu.no', 'Bachelor in Geomatics\r'),
(2, 'Ugnius', 'Raizys', 'ugniusr@stud.ntnu.no', 'Bachelor in Information Security\r'),
(3, 'Kristoffer SÃ¸rvang', 'Dahl', 'kristoffer.dahl2@stud.ntnu.no', 'Bachelor in Information Security\r'),
(4, 'Christopher', 'Berglind', 'chbergli@stud.ntnu.no', 'Bachelor in Information Security\r'),
(5, 'Ali Abdullahi', 'Ali', 'aliaa@stud.ntnu.no', 'Bachelor in IT-Operations and Information Security\r'),
(6, 'Abu Baker Mohammed Abdullah', 'Al-Shammari', 'abalsham@stud.ntnu.no', 'Bachelor in IT-Operations and Information Security\r'),
(7, 'Rune', 'Bergh', 'runbergh@stud.ntnu.no', 'Bachelor in IT-Operations and Information Security\r'),
(8, 'Johanne', 'BognÃ¸y', 'johabog@stud.ntnu.no', 'Bachelor in IT-Operations and Information Security\r'),
(9, 'Joakim Nereng', 'Ellestad', 'joakine@stud.ntnu.no', 'Bachelor in IT-Operations and Information Security\r'),
(10, 'Martine', 'Granlien', 'margranl@stud.ntnu.no', 'Bachelor in IT-Operations and Information Security\r'),
(11, 'Anders GjengstÃ¸', 'Gustad', 'andersgj@stud.ntnu.no', 'Bachelor in IT-Operations and Information Security\r'),
(12, 'Hamse Abdi', 'Hashi', 'hamseah@stud.ntnu.no', 'Bachelor in IT-Operations and Information Security\r'),
(13, 'Martin AndrÃ©', 'KvalvÃ¥g', 'martiakv@stud.ntnu.no', 'Bachelor in IT-Operations and Information Security\r'),
(14, 'Magnus Lien', 'Lilja', 'magnull@stud.ntnu.no', 'Bachelor in IT-Operations and Information Security\r'),
(15, 'Adrian', 'Lund-Lange', 'adrian.lund-lange@ntnu.no', 'Bachelor in IT-Operations and Information Security\r'),
(16, 'Askil AmundÃ¸y', 'Olsen', 'askilao@stud.ntnu.no', 'Bachelor in IT-Operations and Information Security\r'),
(17, 'Espen StÃ¥rvik', 'Skuggerud', 'espenssk@stud.ntnu.no', 'Bachelor in IT-Operations and Information Security\r'),
(18, 'Benjamin Normann', 'Skinstad', 'benjamns@stud.ntnu.no', 'Bachelor in IT-Operations and Information Security\r'),
(19, 'Ã…smund Helland', 'Bu', 'asmund.bu@stud.ntnu.no', 'Bachelor in Network and System Administration\r'),
(20, 'Maria Inez Pourmosleh', 'Ã˜ksnes', 'mariaine@stud.ntnu.no', 'Bachelor in Programming\r'),
(21, 'Brede Fritjof', 'Klausen', 'bredefk@stud.ntnu.no', 'Bachelor in Programming\r'),
(22, 'Ole Kristian Lund', 'LysÃ¸', 'oklyso@stud.ntnu.no', 'Bachelor in Programming\r'),
(23, 'Stian Bakken', 'SÃ¸rslett', 'stianbso@stud.ntnu.no', 'Bachelor in Programming\r'),
(24, 'Eldar Hauge', 'Torkelsen', 'eldarht@stud.ntnu.no', 'Bachelor in Programming\r'),
(25, 'Sondre Benjamin', 'Aasen', 'sondrbaa@stud.ntnu.no', 'Bachelor in Programming\r'),
(26, 'Aleksander', 'Azizi', 'aleksaaz@stud.ntnu.no', 'Bachelor in Programming\r'),
(27, 'Benjamin', 'Bergseth', 'benjabe@stud.ntnu.no', 'Bachelor in Programming\r'),
(28, 'Fredrik Mikal Meyer', 'GlÃ¸sen', 'fmglosen@stud.ntnu.no', 'Bachelor in Programming\r'),
(29, 'Ronny AndrÃ©', 'Gulberg', 'ronnyag@stud.ntnu.no', 'Bachelor in Programming\r'),
(30, 'AndrÃ© Gyrud', 'Gunhildberget', 'andregg@stud.ntnu.no', 'Bachelor in Programming\r'),
(31, 'Marius', 'HÃ¥konsen', 'marhaako@stud.ntnu.no', 'Bachelor in Programming\r'),
(32, 'Ole Kristian', 'Larsen', 'oleklar@stud.ntnu.no', 'Bachelor in Programming\r'),
(33, 'Amir Ali', 'Moaddeli', 'amiram@stud.ntnu.no', 'Bachelor in Programming\r'),
(34, 'HÃ¥kon', 'Schia', 'haakosc@stud.ntnu.no', 'Bachelor in Programming\r'),
(35, 'Vegard', 'Skaansar', 'vegaskaa@stud.ntnu.no', 'Bachelor in Programming\r'),
(36, 'Kristian AndrÃ© Bernhoff', 'Skoglund', 'kaskoglu@stud.ntnu.no', 'Bachelor in Programming\r'),
(37, 'Viktor Kind', 'Svendsen', 'viktorks@stud.ntnu.no', 'Bachelor in Programming\r'),
(38, 'Elisabeth', 'WÃ¥de-Bye', 'elisawaa@stud.ntnu.no', 'Bachelor in Programming\r'),
(39, 'Abubakar Ahmed', 'Yusuf', 'abubakay@stud.ntnu.no', 'Bachelor in Programming\r'),
(40, 'Vanja', 'Falck', 'vanja.falck@ntnu.no', 'Bachelor in Programming\r'),
(41, 'Nedim', 'Delalic', 'nedimd@stud.ntnu.no', 'Bachelor in Web Development\r'),
(42, 'Carl Oskar', 'Eriksen', 'carloe@stud.ntnu.no', 'Bachelor in Web Development\r'),
(43, 'Jonas', 'Ã˜degÃ¥rden', 'jonasod@stud.ntnu.no', 'Bachelor in Web Development\r'),
(44, 'Robin-Andre Due', 'Herrmann', 'raherrma@stud.ntnu.no', 'Bachelor in Web Development\r'),
(45, 'Cecilie Urdahl', 'Fossum', 'ceciliuf@stud.ntnu.no', 'Bachelor of Engineering in Computer Science\r'),
(46, 'Magnus', 'Nordling', 'nordling@stud.ntnu.no', 'Bachelor of Engineering in Computer Science\r'),
(47, 'Hans Emil Beritsveen', 'Eid', 'hanseei@stud.ntnu.no', 'Bachelor of Game Programming\r');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;
COMMIT;

CREATE TABLE `user` (
  `id` bigint(20) NOT NULL,
  `uname` varchar(64) NOT NULL,
  `type` ENUM('student','teacher','admin') NOT NULL DEFAULT 'student',
  `pwd` varchar(130) NOT NULL,
  `avatar` blob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `user` (`id`, `uname`, `type`, `pwd`, `avatar`) VALUES (1, 'student', 'student', MD5('student'), NULL);
INSERT INTO `user` (`id`, `uname`, `type`, `pwd`, `avatar`) VALUES (2, 'laerer', 'teacher', MD5('laerer'), NULL);
INSERT INTO `user` (`id`, `uname`, `type`, `pwd`, `avatar`) VALUES (3, 'admin', 'admin', MD5('admin'), NULL);

ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
