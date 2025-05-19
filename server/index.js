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
app.get("/services/:name", async (req, res) => {
    try {
        const { name } = req.params;
        const service = await pool.query(
            "SELECT * FROM service WHERE company_name ILIKE $1",
            [`${name}%`]//matches names starting with name so partial matchs will turn up
        );

        if (service.rows.length === 0) {
            return res.status(404).json({ error: "Service not found" });
        }

        res.json(service.rows);//get all the services that match
        //had an error where it just got one
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});



//update a listing
//use app.put

//delete a listing?
//use app.delete



//listen to the port to start the server
app.listen(5000, () =>{
    console.log("server started on port 5000");
});
//to start the server use node index 

