This folder contains the backend code and the code for actually communicating with the database and the server

I don't currently think the order matters but I have been starting the server first each time before starting the react app 

to run the server:
requirments:
-node installed (most recent version of it)
-postgresql installed with pg4admin (most recent versions of them)
-you will need to enter and create the database the sql commands to do this can be found in database.sql
-change the password in db.js to match the one you set after installing postgresql
-run "npm install –g nodemon" this will allow the php/backend server to keep running 

Steps to start the server
-cd to server 
-run "nodemon index" this will allow the server to keep updating and restarting each time somthing is changed