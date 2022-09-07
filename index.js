const express = require("express");
const http = require("http"); // http module to create secure server
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const port = process.env.PORT || 3000; //process.ENV file data
const db = require("./routes/routes"); //Routes file
const multer = require("multer");

// View Engine Setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const upload = multer({
  dest: "images",
});

//Api to upload profile pic
app.post("/upload/profile/pic", upload.single("upload"), (req, res) => {
  res.send("Profile pic uploaded");
});

//JSON body parser
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//Routes section
app.get("/get/all/users", db.getUsers); //This api is working with postman
app.get("/user/with/id/:id", db.getUserById); //This api is working with postman

app.post("/signup/user", db.createUser); //This api is working with postman
app.post("/select/account/type/withid/:id", db.SelectAccountType);

app.put("/update/users/:id", db.updateUser); //This api is working with postman
app.delete("/delete/users/:id", db.deleteUser); //This api is working with postman
//Routes section

//Using http security to create server
const server = http.createServer(app);

//Listening to the server
server.listen(port, function (res , req) {

  res.writeHead(200,{'content-type':'text/html'});

  console.log("App listening at port http 3000");
});
