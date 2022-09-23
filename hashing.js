<<<<<<< HEAD
const bcrypt = require('bcryptjs');
const { Result } = require('express-validator');

    const Hash = (password) => {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      return hash;
    } 

module.exports = {
    Hash
=======
const bcrypt = require('bcryptjs');
const { Result } = require('express-validator');

    const Hash = (password) => {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      return hash;
    } 

module.exports = {
    Hash
>>>>>>> b12764230751d223d758417d60f0e9e27c75765f
}