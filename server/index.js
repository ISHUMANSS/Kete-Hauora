const express = require("express");//make sure express is installed
const app = express();//run express
const cors = require("cors");//make sure cors is needed
const pool = require("./db");//allows us to make postgres querys

//middleware
app.use(cors());//run cors
app.use(express.json());//gives us access to request the data
//use req.body to be able to access the info from the client side

//routes
//all of the actions that we will have
//req is the request
//res is the response

//use app.post along with async functions to post a service

//get all listings
app.get("/services", async(req,res) =>{
    //uses _GET
    try {
        const allServices = await pool.query("SELECT * FROM service;");
        res.json(allServices.rows);
    } catch (err) {
        console.error(err.message);
    }
});


//search for a specific listing
app.get("/services:id", async (req,res) =>{
    //search for a listing by id
    //uses _GET
    try {
        const {id} = req.params;//set the id as the one in the url

        //serach for the service where it matches the id given
        const service = await pool.query("SELECT * FROM services WHERE service_id = $1", [id]);
        
        res.json(service.row[0]);
    } catch (err) {
        console.error(err.message);
    }
});


//update a listing
//use app.put

//delete a listing?
//use app.delete



//listen to the port to start the server
app.listen(3000, () => {
    console.log("server started on port 3000");
});
//to start the server use node index 

