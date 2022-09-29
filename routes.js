// const { json } = require("body-parser");
// const bodyParser = require("body-parser");
// const { response } = require("express");
// const req = require("express/lib/request");
// const { request } = require("http");
// const { endianness } = require("os");
const { Client } = require("pg");
// const { stringify } = require("querystring");
// const multer = require("multer");
// const { profile } = require("console");
const {Hash} = require('./hashing');
// const bcrypt = require('bcryptjs');
// const SendFileName = require('./index');




//Database connection
const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "app_test",
  password: "123",
  port: 5432,
});





//Checking database connection
client.connect(function (err) {
  if (err) throw err;
  console.log("Database is Connected!");
});








//Get recommendations at first sign up
const WelcomeRecommendation = (request, response) => {
  client.query("SELECT firstname FROM sign_up ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
    console.log(results.rows);
  });
};







//Search page
const SearchUsers = (request, response) => {

  const SearchFor = request.body.username;

  client.query(`SELECT * FROM sign_up WHERE username LIKE '%${SearchFor}%'`,(error, results) => {
    
    try {

      if(results.rows[0].account_type == 'private'){
        response.send('This account is private');
      }
      else{
        response.status(200).send(results.rows);
      }
  
    } catch (err) {
      response.status(500).send(err);
      console.log(err);
    }

    // response.status(200).json(results.rows);
    console.log(results);
  });
};







//Get single user through id
// const getUserById = (request, response) => {
//   const id = parseInt(request.params.id);

//   client.query(
//     "SELECT * FROM sign_up WHERE id = $1",
//     [id],
//     (error, results) => {
//       if (error) {
//         throw error;
//       }
//       response.status(200).json(results.rows);
//       console.log(results.rows);
//     }
//   );
// };






// Create a new user account
const createUser = (request, response) => {

  const {
    firstname,
    lastname,
    email,
    phone,
    username,
    password,
    account_type,
    bio,
  } = request.body;

  const File = request.file.filename;

  const hashpass = Hash(password);

  client.query(
    "INSERT INTO sign_up (firstname, lastname, email, phone, username, password, account_type, bio, profile) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
    [firstname, lastname, email, phone, username, hashpass, account_type, bio, File],
    (error, results) => {
      if (error) {
        throw error;
      }

      response.status(201).send(`User added` + '\n');
      console.log(firstname + "\n");
      console.log(lastname + "\n");
      console.log(email + "\n");
      console.log(phone + "\n");
      console.log(username + "\n");
      console.log(hashpass + "\n"); 
      console.log(password + "\n");
      console.log(account_type + "\n");
      console.log(bio + "\n");
      console.log(File);
    }
  );
};







//Update user data
const updateUser = (request, response) => {
  const id = parseInt(request.params.id);

  const {
    firstname,
    lastname,
    email,
    phone,
    username,
    password,
    account_type,
    bio
  } = request.body;

  const File = request.file.filename;

  client.query(
    `UPDATE sign_up SET firstname = $1, lastname = $2 , email = $3 , phone = $4 , username = $5 , password = $6 , account_type =$7, bio=$8, profile=$9 WHERE id = ${id}`,
    [firstname, lastname, email, phone, username, password, account_type, bio, File],

    (error, results) => {
      if (error) {
        throw error;
      }

      response.status(200).send(`User modified with ID: ${id}`);

      console.log(firstname);
      console.log(lastname);
      console.log(email);
      console.log(phone);
      console.log(username);
      console.log(password);
      console.log(account_type);
      console.log(bio);
      console.log(File);
    }
  );
};









//Delete any user account
const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  client.query("DELETE FROM sign_up WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};







const GetProfile = (req, res) => {
  const id = req.params.id;

  client.query(`SELECT profile FROM sign_up WHERE id = ${id}`, (error, results) => {
    if (error) {
      throw error;
    }

    res.status(200).send(results.rows);
    console.log(id);
    console.log(results.rows);
  });
};






const GetCompleteProfile = (req, res) => {
  const id = req.params.id;

  client.query(`SELECT * FROM sign_up INNER JOIN media_data ON sign_up.id = media_data.media_id`, (error, results) => {
    if (error) {
      throw error;
    }

    res.status(200).send(results.rows);
    console.log(id);
    console.log(results.rows);
  });
};








//Uploading vidoes into database
const UploadVideo = (request , res) => {

  const Userid = request.params.id;

  const video = request.file.filename;

  client.query(`INSERT INTO media_data (media_id ,video) VALUES ($1 , $2) RETURNING *`,
    [Userid , video],
    (error, results) => {
      if (error) {
        throw error;
      }

      res.status(200).send('Video has been uploaded to db');
      console.log(video);
    }
  );
};





//Send follow request
const SendFollowRequest = (request , response) => {

  const follower_id = request.body.userid;

    const UserNameForRequest = request.body.username;

    var requestId;

    client.query(`SELECT * FROM sign_up WHERE username LIKE '%$1%'`,[UserNameForRequest],(error , results) => {
        try{

          requestId = results.rows[0].id;

          //Query to send follow request
          client.query(`INSERT INTO  following(follower_id, request_for_id, usernametofollow) VALUES($1,$2,$3)`,[follower_id, requestId, UserNameForRequest],() => {
              console.log('you have starte following '+UserNameForRequest);
              response.status(200).send('following started');
              
          });

        } 
        catch(error){
            response.status(500).send(error);
            console.log(error);
        }
    });
}







//Check your following list
const ChechFollowingList = (request , response) => {
  const UserId = request.params.userid;

 client.query(`SELECT * FROM following WHERE follower_id = $1`,[UserId], (error , results) => {

    try{
        response.status(200).send(results.rows);
        console.log(results.rows);
    }
    catch(error){
      response.status(500).send(error);
      console.log(error);
    }

  });
}





//Get database connection
const GetClient = () => {
    return client;
}

module.exports = {
  WelcomeRecommendation,
  // getUserById,
  createUser,
  updateUser,
  deleteUser,
  UploadVideo,
  GetProfile,
  GetCompleteProfile,
  GetClient,
  SearchUsers,
  SendFollowRequest,
  ChechFollowingList
};