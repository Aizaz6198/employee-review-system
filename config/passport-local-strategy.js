const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

// Authentication using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      // find a user and establish the identity
      User.findOne({ email: email }, async function (err, user) {
        if (err) {
          req.flash('error', err);
          return done(err);
        }

        if (!user) {
          req.flash('error', 'Invalid username or password');
          return done(null, false);
        }

        // match the password
        const isPasswordCorrect = await user.isValidatedPassword(password);

        if (!isPasswordCorrect) {
          req.flash('error', 'Invalid username or password');
          return done(null, false);
        }

        return done(null, user);
      });
    }
  )
);

// Serializing the user
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// Deserializing the user
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log('Error in finding user');
      return done(err);
    }

    return done(null, user);
  });
});

// Check if user authenticated (middleware)
passport.checkAuthentication = function (req, res, next) {
  // if the user is signed in, then pass on the request to the next function
  console.log('inside check authentication: ', req);
  if (req.isAuthenticated()) {
    return next();
  }

  // if the user is not signed in
  return res.redirect('/');
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    // req.user contains the current signed in user from the session cookie
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
