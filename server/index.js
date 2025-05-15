const express = require("express");//make sure express is installed
const app = express();//run express
const cors = require("cors");//make sure cors is needed


//middleware
app.use(cors());//run cors
app.use(express.json());//gives us access to request the data


//listen to the port to start the server
app.listen(5000, () =>{
    console.log("server started on port 5000");
});
//to start the server use node index 

