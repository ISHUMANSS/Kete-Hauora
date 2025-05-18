const express = require("express");//make sure express is installed
const app = express();//run express
const cors = require("cors");//make sure cors is needed
const path = require("path")

//middleware
app.use(cors());//run cors
app.use(express.json());//gives us access to request the data

app.use(express.static("public")); // serve static files like style.css

app.get("/", (_, res) => {
    res.sendFile(path.join(__dirname, "homepage.html", "public")) // route for homepage
});

//listen to the port to start the server
app.listen(3000, () => {
    console.log("server started on port 3000");
});
//to start the server use node index 

