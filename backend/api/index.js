let app;
try {
  app = require('../server');
} catch (error) {
  app = (req, res) => {
    res.status(200).json({
      error: 'Cold Start Error',
      message: error.message,
      stack: error.stack
    });
  };
}
module.exports = app;