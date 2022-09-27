const express = require("express");
const http = require("http"); // http module to create secure server
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const port = process.env.PORT || 3000; //process.ENV file data
const db = require("./routes"); //Routes file
const Login = require("./login");

const { GetClient } = require("./routes");
const client = GetClient();

const multer = require("multer");
const { constants } = require("buffer");
const req = require("express/lib/request");

//JSON body parser
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// View Engine Setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");








//video upload section
const videoUpload = multer({
  dest: "videos", // Destination to store video
});

//Api to upload videos
app.post("/upload/video/user/id/:id",videoUpload.single("videoUpload"),db.UploadVideo,() => {
    //JSON header
    res.type("json");
  }
);

//Routes section
app.get("/get/all/users", db.getUsers, () => {
  res.type("json");
});

app.get("/user/with/id/:id", db.getUserById, () => {
  res.type("json");
});

app.get("/get/profile/id/:id", db.GetProfile, () => {
  res.type("json");
});

app.get("/get/complete/profile/id/:id", db.GetCompleteProfile, () => {
  res.type("json");
});

app.put("/update/users/:id", db.updateUser, () => {
  res.type("json");
});

app.delete("/delete/users/:id", db.deleteUser, () => {
  res.type("json");
});

app.post("/login", Login.LoginCheck, () => {
  res.type("json");
});

//image upload section----
const upload = multer({});
app.post("/signup/user", upload.single("upload"), db.createUser, () => {
  res.type("json");
});
//Routes section---------





//Using http security to create server
const server = http.createServer(app);

//Listening to the server
server.listen(port, function (res, req) {
  console.log("App listening at port http 3000");
});