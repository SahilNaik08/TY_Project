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

SELECT * FROM service_center;

ALTER TABLE service_center ADD COLUMN available BOOLEAN DEFAULT TRUE;


CREATE TABLE R_car_model (
    model_name VARCHAR(100) PRIMARY KEY,
    manufacturer VARCHAR(100),
    year INT
);

CREATE TABLE R_spare_part (
    part_id INT PRIMARY KEY,
    part_name VARCHAR(100),
    details TEXT
);

CREATE TABLE R_spare_part_for_car_model (
    part_id INT,
    model_name VARCHAR(100),
    PRIMARY KEY (part_id, model_name),
    FOREIGN KEY (part_id) REFERENCES R_spare_part(part_id),
    FOREIGN KEY (model_name) REFERENCES R_car_model(model_name)
);

CREATE TABLE R_spare_part_sold_by_vendor (
    part_id INT,
    ven_id INT,
    PRIMARY KEY (part_id, ven_id),
    FOREIGN KEY (part_id) REFERENCES R_spare_part(part_id),
    FOREIGN KEY (ven_id) REFERENCES R_vendor(ven_id)
);

CREATE TABLE R_vendor (
    ven_id INT PRIMARY KEY,
    vendor_name VARCHAR(100),
    address TEXT,
    contact_num VARCHAR(20)
);

CREATE TABLE R_car (
    license_plate VARCHAR(20) PRIMARY KEY,
    model_name VARCHAR(100),
    car_color VARCHAR(50),
    user_email VARCHAR(100),
    FOREIGN KEY (model_name) REFERENCES R_car_model(model_name)
);

CREATE TABLE R_policy (
    policy_num INT PRIMARY KEY,
    license_plate VARCHAR(20),
    policy_type VARCHAR(50),
    start_date DATE,
    end_date DATE,
    file BLOB,
    FOREIGN KEY (license_plate) REFERENCES R_car(license_plate)
);

CREATE TABLE R_service_history (
    sh_id INT PRIMARY KEY,
    license_plate VARCHAR(20),
    serv_status VARCHAR(50),
    serv_date DATE,
    at_km INT,
    booking_id INT,
    FOREIGN KEY (license_plate) REFERENCES R_car(license_plate)
);

CREATE TABLE R_booking (
    booking_id INT PRIMARY KEY,
    user_email VARCHAR(100),
    no_of_services INT,
    status VARCHAR(50),
    FOREIGN KEY (user_email) REFERENCES Users(user_email)
);

CREATE TABLE R_bill (
    bill_id INT PRIMARY KEY,
    booking_id INT,
    bill_date DATE,
    bill_status VARCHAR(50),
    total_amount DECIMAL(10,2),
    FOREIGN KEY (booking_id) REFERENCES R_booking(booking_id)
);

CREATE TABLE R_service (
    serv_id INT PRIMARY KEY,
    serv_details TEXT
);
use car_care;
SELECT service_center_email, service_center_name, available, about FROM service_center;

select * from users;

desc users;

ALTER TABLE service_center 
DROP PRIMARY KEY,
ADD COLUMN sc_id INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE service_center 
ADD CONSTRAINT unique_service_center_email UNIQUE (service_center_email);

desc service_center;

SELECT sc_id, service_center_email FROM service_center;


CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    sc_id INT NOT NULL,
    slot_date VARCHAR(20) NOT NULL,
    slot_time VARCHAR(20) NOT NULL,
    user_data JSON NOT NULL,
    sc_data JSON NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date BIGINT NOT NULL,
    cancelled TINYINT(1) DEFAULT 0, -- Using TINYINT(1) instead of BOOLEAN
    is_completed TINYINT(1) DEFAULT 0, -- Using TINYINT(1) instead of BOOLEAN
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (sc_id) REFERENCES service_center(sc_id) ON DELETE CASCADE
);


desc bookings;