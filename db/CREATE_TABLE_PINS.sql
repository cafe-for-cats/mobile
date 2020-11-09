CREATE TABLE master.pins
(
    pin_id CHAR(38) CHARACTER SET UTF8MB4,
    user_id CHAR(38) CHARACTER SET UTF8MB4,
    latitude DECIMAL(6,3),
    longitude DECIMAL(6,3),
    label NVARCHAR(512),
    create_date DATETIME,
    CONSTRAINT pk_pin PRIMARY KEY (pin_id, user_id),
    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
);

/*
DROP TABLE pins; 
*/

