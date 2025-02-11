CREATE TABLE `service_center` (
  `service_center_email` varchar(45) NOT NULL,
  `service_center_name` varchar(45) NOT NULL,
  `service_center_passwd` varchar(255) NOT NULL,
  `service_center_state` varchar(45) NOT NULL,
  `service_center_city` varchar(45) NOT NULL,
  `serviceType` varchar(45) NOT NULL,
  `imageUrl` varchar(95) DEFAULT '/uploads/SC1.png',
  PRIMARY KEY (`service_center_email`)
);

USE car_care;

DESC service_center;

INSERT INTO `service_center` VALUES ('3MCAR@GMAIL.COM','3m_Car','3m@123','Goa','Panaji','','');

SELECT * FROM service_center;

DELETE FROM service_center WHERE service_center_email = "3MCAR@GMAIL.COM";

ALTER TABLE service_center ADD COLUMN about TEXT;  
