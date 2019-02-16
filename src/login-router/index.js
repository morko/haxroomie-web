const express = require('express');
const path = require('path');

module.exports = createLoginRouter;
function createLoginRouter(passport) {
  if (!passport) throw new Error('Missing required argument: passport');

  let htmlFilePath = path.resolve(path.join(__dirname, 'index.html'));
  let router = express.Router();

  router.get('/login', function(req, res) {
    res.sendFile(htmlFilePath);
  });

  router.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    }
  );

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });

  return router;
}
