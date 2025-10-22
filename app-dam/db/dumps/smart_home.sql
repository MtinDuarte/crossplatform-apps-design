-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: mysql-server
-- Tiempo de generación: 30-11-2020 a las 23:27:10
-- Versión del servidor: 5.7.27
-- Versión de PHP: 7.2.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `DAM`
--
CREATE DATABASE IF NOT EXISTS `DAM` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `DAM`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Dispositivos`
--

CREATE TABLE `Devices` (
  `ID` int(11) NOT NULL,
  `DeviceID` varchar(200) DEFAULT NULL,
  `MAC_ADDRESS` varchar(200) DEFAULT NULL,
  `DateTimeCreated` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `Measurements` (
  `MeasureID` int(11) NOT NULL,
  `DeviceID` varchar(200) DEFAULT NULL,
  `Voltage` int(11) DEFAULT NULL,
  `TimestampUTC` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indices de la tabla `Dispositivos`
--
ALTER TABLE `Devices`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `fk_Devices_idx` (`ID`);

  ALTER TABLE `Measurements`
  ADD PRIMARY KEY (`MeasureID`),
  ADD KEY `fk_Measurements_idx` (`MeasureID`);


ALTER TABLE `Devices`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;


ALTER TABLE `Measurements`
  MODIFY `MeasureID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

 INSERT INTO `Devices` (`ID`,`DeviceID`, `MAC_ADDRESS`, `DateTimeCreated`) VALUES
 (1,'ESP32', '25:3A:42:CE:B7:FF', NOW());

 INSERT INTO `Measurements` (`MeasureID`,`DeviceID`, `Voltage`, `TimestampUTC`) VALUES
 (1,'ESP32', 3220, NOW());

-- ALTER TABLE `Devices`
--   MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

-- ALTER TABLE `Measurements`
--   MODIFY `MeasureID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--  ALTER TABLE `Measurements`
--   ADD CONSTRAINT `fk_Measurements_Devices` FOREIGN KEY (`DeviceID`) REFERENCES `Devices` (`DeviceID`) ON DELETE NO ACTION ON UPDATE NO ACTION;
--  COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;