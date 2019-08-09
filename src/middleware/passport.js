const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const logger = require('../logging').logger;

module.exports = createPassportMiddleware;

function createPassportMiddleware(database) {
  if (!database) throw new Error('Missing required argument: database');

  let User = database.models.User;

  // Pass just the user id to the passport middleware
  passport.serializeUser(function(user, done) {
    logger.debug(
      "Serializing user with name: " + user.name + " to session " +
      "as id: " + user.id
    );
    done(null, user.id);
  });

  // Reading your user base ont he user.id
  passport.deserializeUser(function(id, done) {
    logger.debug("Deserializing user with id: " + id + " from session.");
    User.findByPk(id).then(function(user) {
      logger.debug(
        "Deserializing user with id: " + id + " to session " +
        "as user: " + JSON.stringify(user)
      );
      done(null, user.getPublicProfile());
    }).catch(() => {
      logger.debug("Could not deserialize user with id: " + id );
    });
  });

  function verifyUser(name, password, done) {
    User.findOne({where: {name: name}})
    .then(function(user) {
      if (user) {
        // attempt authenticating with the supplied password
        if (user.authenticate(password)) {
          logger.debug(
            "Authenticating: User authenticated: " + JSON.stringify(user)
          );
          done(null, user.getPublicProfile());
        } else {
          logger.debug(
            "Authenticating: Incorrect password: " + JSON.stringify(user)
          );
          done("INVALID_LOGIN", false);
        }
      // no user with the given name was found
      } else {
        logger.debug("Authenticating: Incorrect username: " + name);
        done("INVALID_LOGIN", false);
      }
    })
  }

  passport.use(new LocalStrategy({
    usernameField: 'seqpress-user',
    passwordField: 'seqpress-password'
  }, verifyUser));

  return passport;
}
