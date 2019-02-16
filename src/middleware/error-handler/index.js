const path = require('path');

module.exports = createErrorHandler;
function createErrorHandler() {

  let errorFile = path.resolve(path.join(__dirname, 'error.html'));
  let invalidLoginFile = path.resolve(path.join(__dirname, 'login-error.html'));


  function errorHandler(err, req, res, next) {
    if (err === "INVALID_LOGIN") {
      res.sendFile(invalidLoginFile)
    } else {
      res.sendFile(errorFile);
    }
  }
  return errorHandler;
}
