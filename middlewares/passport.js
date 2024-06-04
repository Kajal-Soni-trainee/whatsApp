const passport = require('passport');
let JwtStrategy = require('passport-jwt').Strategy;
const { users } = require('../models');
const getToken = (req) => {
  return req.cookies.token;
}

let opts = {};

opts.jwtFromRequest = getToken;
opts.secretOrKey = process.env.SECRET_KEY;

passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
  try {
    let user = await users.findAll({
      where: { id: jwt_payload.id },
      raw: true
    })
    if (user) {
      return done(null, user);
    }
    else {
      return done(null, false);
    }
  }
  catch (error) {
    return done(error);
  }
}));