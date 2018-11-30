var jwt = require('jsonwebtoken');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
require('dotenv').config();

function signJWT(body) {
    let options = {
        expiresIn: process.env.JWT_EXPIRED_TIME
    }
    const token = jwt.sign(body, process.env.JWT_SECRET, options)
    return token || null;
}

const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = process.env.JWT_SECRET;

module.exports = {
    signJWT,
    JwtStrategy: new JwtStrategy(options, (jwt_payload, done) => done(null, true, jwt_payload))
}