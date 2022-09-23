const bcrypt = require('bcryptjs');
const { Result } = require('express-validator');

    const Hash = (password) => {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      return hash;
    } 

module.exports = {
    Hash
}