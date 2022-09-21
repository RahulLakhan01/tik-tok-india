const { rmSync } = require("fs");
const { Query } = require("pg");
const { GetClient } = require("./routes");
const client = GetClient();

const LoginCheck = (request, response) => {
  var email = request.body.email;
  var password = request.body.password;

  client.query(
    `SELECT * FROM sign_up WHERE email = $1 AND password = $2`,
    [email, password],
    (error, QueryData) => {
      
      try{
        var userEmail = QueryData.rows[0].email;
        var userPassword= QueryData.rows[0].password;
   
        if(email == userEmail && password == userPassword){
         response.json('Primary key= '+QueryData.rows[0].id);
         console.log('Login successful');
        }
      }
      catch(err){
        response.status(500).send('Incorrect data');
        console.log('Incorrect data');
      }

    }
  );
}; //Function end----->>

module.exports = {
  LoginCheck,
};
