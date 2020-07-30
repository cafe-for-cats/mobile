CREATE TABLE master.PINS
(
    PIN_ID CHAR(38) CHARACTER SET UTF8MB4,
    USER_ID CHAR(38) CHARACTER SET UTF8MB4,
    LATITUDE DECIMAL(6,5),
    LONGITUDE DECIMAL(6,5),
    LABEL NVARCHAR(512),
    CREATE_DATE DATETIME,
    CONSTRAINT PK_PIN PRIMARY KEY (PIN_ID, USER_ID),
    FOREIGN KEY (USER_ID)
        REFERENCES USERS(USER_ID)
);

/*
DROP TABLE PINS; 
*/


-- leave for 2 hours and then vacuum

-- they come back EVERY 3 months

-- they come back for free between the quarterly's if they see pests

-- 50 FOR FIRST, 105 QUARTERLY
-- 105 WILL NEVER CHANGE