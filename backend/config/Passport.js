import LocalStrategy from 'passport-local';
import User from '../models/User.js';

export default function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
            try {
                const user = await findOne({ email });
                if (!user) {
                    return done(null, false, { message: 'Invalid credentials' });
                }

                const isMatch = await user.matchPassword(password);
                if (!isMatch) {
                    return done(null, false, { message: 'Invalid credentials' });
                }

                return done(null, user);
            } catch (err) {
                console.error(err);
                return done(err);
            }
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        findById(id, (err, user) => {
            done(err, user);
        });
    });
};
