const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/users');

// implementing
module.exports = function(passport) {
	passport.use(
		'local',
		new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
			// Match user
			User.findOne({
				email : email
			})
				.then((user) => {
					if (!user) {
						return done(null, false);
					}

					// Match password
					bcrypt.compare(password, user.password, (err, isMatch) => {
						if (err) throw err;
						if (isMatch) {
							return done(null, user);
						} else {
							return done(null, false);
						}
					});
				})
				.catch((e) => console.log(e));
		})
	);

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
};
