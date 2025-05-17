--run all of these commands in your postgresql 
--to put then in your version of the db
--this will need to be done until we actually host the database

--place with the current sql data that is used to create the postgreSQL database
CREATE DATABASE ketehauora;


--the service database will need to be updated more 
--later on so that it will actually match the expected out come
CREATE TABLE service(
    service_id SERIAL PRIMARY KEY, --allows for the id to increment
    company_name VARCHAR(50) NOT NULL,
    --add the rest of the needed data
);


INSERT INTO service (company_name) VALUES ('name1');
INSERT INTO service (company_name) VALUES ('name2');
INSERT INTO service (company_name) VALUES ('name3');

SELECT * FROM service;