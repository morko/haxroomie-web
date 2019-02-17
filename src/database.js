const Sequelize = require('sequelize');
const logger = require('./logging').logger;

module.exports = createDatabase;
function createDatabase(storage, opt) {

  opt = opt || {};

  // create database, ensure 'sqlite3' in your package.json
  const sequelize = new Sequelize(
    "database",
    "username",
    "password",
    {
      dialect: "sqlite",
      storage: storage,
      operatorsAliases: false,
      logging: (msg) => logger.debug(msg)
    },
  );

  const models = require('./models')(sequelize);

  let initialized = false;
  return {
    init,
    createUser,
    removeUser,
    updateUser,
    get sequelize() {
      if (!initialized)
        throw new Error('Database is not initialized! Call init() first.');
      return sequelize;
    },
    get models() {
      if (!initialized)
        throw new Error('Database is not initialized! Call init() first.');
      return models;
    }
  }

  async function init() {
    if (initialized) return;

    logger.debug('Initializing database.')
    await sequelize.sync();

    initialized = true;
  }

  async function createUser(user, throwIfExists = false) {
    logger.debug("Trying to create user: " + JSON.stringify(user));
    if (!initialized) {
      throw new Error('Database is not initialized! Call init() first.');
    }
    let userModel = await models.User.find({
      where: { name: user.name }
    });
    if (throwIfExists && userModel) {
      throw new Error(`User ${user.name} exists already!`);
    }
    await models.User.findOrCreate({
      where: { name: user.name },
      defaults: {
        hash: user.password
      }
    });
  }

  async function removeUser(user) {
    logger.debug("Trying to remove user: " + JSON.stringify(user));
    if (!initialized) {
      throw new Error('Database is not initialized! Call init() first.');
    }
    let userModel = await models.User.find({
      where: { name: user.name }
    });
    if (!user) {
      throw new Error(`Could not find user ${user.name}!`);
    }
    return userModel.destroy();
  }

  async function updateUser(user) {
    logger.debug("Trying to update user: " + JSON.stringify(user));
    if (!initialized) {
      throw new Error('Database is not initialized! Call init() first.');
    }
    let userModel = await models.User.find({
      where: { name: user.name }
    });
    if (!user) {
      throw new Error(`Could not find user ${user.name}!`);
    }
    return userModel.update(user);
  }

}
