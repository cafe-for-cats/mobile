INSERT INTO master.users(
    user_id
)
VALUES (
    "329e85ff-a699-4415-a9d8-118889e219ce"
)

INSERT INTO master.pins(
    label,
    latitude,
    longitude,
    pin_id,
    user_id
)
VALUES (
    "Water",
    42.1,
    -89.1,
    "c6152994-8c70-42fd-b15e-e7e9b62b2553",
    "329e85ff-a699-4415-a9d8-118889e219ce"
)

SELECT * FROM master.users;

SELECT * FROM master.pins;

-- DELETE FROM master.pins where TRUE;
