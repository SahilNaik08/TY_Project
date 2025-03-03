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

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    city VARCHAR(100) NULL,
    state VARCHAR(100) NULL,
    usr_img VARCHAR(255) DEFAULT 'uploads_user_img/profile_pic.png',
    address TEXT NULL,
    phone VARCHAR(20) NULL,
    dob DATE NULL,
    gender ENUM('Male', 'Female', 'Other') NULL
);

show tables;

select * from users;

ALTER TABLE service_center ADD COLUMN available BOOLEAN DEFAULT TRUE;


