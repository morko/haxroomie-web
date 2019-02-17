const bcrypt = require('bcrypt');

module.exports = createUser;
function createUser(sequelize, DataTypes) {
  const User = sequelize.define('user', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [6, 18]
      }
    },
    // stores passwords as hashed values
    hash: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // bcrypt max string length is 72 characters
        len: [8, 72]
      },
      set(value) {
        this.setDataValue('hash', bcrypt.hashSync(value, 10));
      }
    }
  });

  User.prototype.getPublicProfile = function() {
    return {
      id: this.id,
      name: this.name
    }
  }

  User.prototype.authenticate = function(password) {
    if (bcrypt.compareSync(password, this.hash))
    {
      return this.getPublicProfile();
    } else {
      return false;
    }
  }
  return User;

}
