const { json } = require("body-parser");
const bodyParser = require("body-parser");
const { response } = require("express");
const req = require("express/lib/request");
const { request } = require("http");
const { endianness } = require("os");
const { Client } = require("pg");
const { stringify } = require("querystring");
const multer = require("multer");
const { profile } = require("console");






const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "app_test",
  password: "123",
  port: 5432,
});






client.connect(function (err) {
  if (err) throw err;
  console.log("Database is Connected!");
});








//Get all users details
const getUsers = (request, response) => {
  response.set("Content-Type", "json");
  // => 'application/json'

  client.query("SELECT * FROM sign_up ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
    console.log(results.rows);
  });
};








//Get single user through id
const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  client.query(
    "SELECT * FROM sign_up WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
      console.log(results.rows);
    }
  );
};








//Create a new user account
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

  client.query(
    "INSERT INTO sign_up ( firstname, lastname, email, phone, username, password, account_type, bio, profile) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
    [firstname, lastname, email, phone, username, password, account_type, bio, File],
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
  } = request.body;

  client.query(
    `UPDATE sign_up SET firstname = $1, lastname = $2 , email = $3 , phone = $4 , username = $5 , password = $6 , account_type =$7 WHERE id = ${id}`,
    [firstname, lastname, email, phone, username, password, account_type],

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
    }
  );

  // client.end();
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






const GetVideo = (req, res) => {
  const id = req.params.id;

  client.query(`SELECT media_data.video FROM media_data JOIN sign_up ON sign_up.first_name WHERE id = ${id}`, (error, results) => {
    if (error) {
      throw error;
    }

    res.status(200).send(results.rows);
    console.log(id);
    console.log(results.rows);
  });
};








//Uploading vidoes into database
const InsertVideo = (req , res) => {

  const video = req.file.filename;

  client.query(`INSERT INTO media_data (video) VALUES ($1) RETURNING *`,
    [video],
    (error, results) => {
      if (error) {
        throw error;
      }

      res.status(200).send('Video has been uploaded to db');
      console.log(video);
    }
  );
};







const GetClient = () => {
    return client;
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  InsertVideo,
  GetProfile,
  GetVideo,
  GetClient
};
