var express = require('express');
var router = express.Router();
var jwtService = require('../utils/jwt');
var passport = require('passport');
passport.use(jwtService.JwtStrategy);
var userController = require('../controllers/user');

router.get('/test', userController.test);

router.get('/', function(req, res, next) {
  res.send('Welcome to USER API');
});
router.get('/login', userController.login);
router.get('/verifytoken', passport.authenticate('jwt', {session: false}), userController.verifyToken);

module.exports = router;
