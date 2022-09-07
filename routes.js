const { json } = require("body-parser");
const bodyParser = require("body-parser");
const { response } = require("express");
const req = require("express/lib/request");
const { request } = require("http");
const { endianness } = require("os");
const { Client } = require("pg");
const { stringify } = require("querystring");





const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "app_test",
  password: "123",
  port: 5432,
});






client.connect(function (err) {
  if (err) throw err;
  console.log("Database Connected!");
});





//Get all users details
const getUsers = (request, response) => {

  response.set('Content-Type', 'json');
    // => 'application/json'

  client.query("SELECT * FROM sign_up ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
    console.log(results.rows);
  });
};





//Get all users details
// const getHomePage = (request, response) => {
//   const { login_email, email_password } = request.body;

//   console.log("Login Email- " + login_email);
//   console.log("Password- " + email_password);

//   const check = client.query(
//     "SELECT password FROM sign_up WHERE email = $1",
//     [login_email],
//     (error, results) => {
//       if (error) {
//         throw error;
//       }

//       if (check === email_password) {
//         response.send("Login Successful");
//         response.sendFile(path.join(__dirname, "../html/welcome.html"));
//         console.log("Login Successful");
//       }

//       if (!check === email_password) {
//         throw error;
//         response.send("Your login details are incorrect");
//         console.log("Your login details are incorrect");
//         return;
//       }

//       console.log("Check- " + check);

//       response.status(200).json(results.rows);
//       console.log(results.rows);
//     }
//   );
// };










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

  // response.set('Content-Type', 'text/html')
  //   // => 'application/json'

  //   response.type('json');
  
  const {firstname,lastname,email,phone,username,password,account_type} = request.body;

  // const CreateData = JSON.parse(userData);
  

    //  firstname = CreateData.firstname;
    //  lastname = CreateData.lastname;
    //  email = CreateData.email;
    //  phone = CreateData.phone;
    //  username = CreateData.username;
    //  password = CreateData.password;
    //  account_type = CreateData.account_type;


  // client.query('INSERT INTO sign_up ( firstname, lastname, email, phone, username, password, account_type ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
  // [ firstJSON, lastJSON, emailJSON, phoneJSON, usernameJSON, passwordJSON, account_typeJSON ], (error, results) => {
  //   if (error) {
  //     throw error
  //   }
    
    response.status(201).send(`User added`);
    // console.log(userData);
    console.log(firstname + '\n');
    console.log(lastname + '\n');
    console.log(email + '\n');
    console.log(phone + '\n');
    console.log(username + '\n');
    console.log(password + '\n');
    console.log(account_type + '\n');

  }





//Update user data
const updateUser = (request, response) => {
  const id = parseInt(request.params.id);

  const { firstname, lastname, email, phone, username, password, account_type } = request.body;

  if(firstname == null || firstname == undefined){
    console.log('Firstname is undefined or null');  
    return;
  }

  if(lastname == null || lastname == undefined){
    console.log('Lastname is undefined or null');  
   return;
  }

  if(email == null || email == undefined){
    console.log('Lastname is undefined or null');  
    return;
  }

  if(phone == null || phone == undefined){
    console.log('Lastname is undefined or null');  
    return;
  }

  if(username == null || username == undefined){
    console.log('Lastname is undefined or null');  
    return;
  }

  if(password == null || password == undefined){
    console.log('Lastname is undefined or null');  
    return;
  }

  if(account_type == null || account_type == undefined){
    console.log('Lastname is undefined or null');  
    return;
  }

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
  
  client.end();
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






//Selcecting account type
const SelectAccountType = (request , response) => {

  const id = parseInt(request.params.id);

  const { account_type } = String(request.body);

  client.query(
    `UPDATE sign_up SET account_type = $1 WHERE id = ${id}`,
    [account_type],

    (error, results) => {
      if (error) {
        throw error;
      }

      response.status(200).send(`User modified with ID: ${id}`);

      console.log(account_type);

      console.log('id- ' + id);

    }
  ); 
}




module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  // getHomePage,
  SelectAccountType,
};