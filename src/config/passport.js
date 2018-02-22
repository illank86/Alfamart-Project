import bcrypt from 'bcrypt';
import LocalStrategy from 'passport-local';

import logger from './logger';
import db from './db';

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
		done(null, user.id);
    });
 
    passport.deserializeUser(function(id, done) {
		db.query("SELECT * FROM users WHERE id_user = ?", id, function(err,rows){	
			done(err, rows[0]);
		});
    });

    passport.use('local-signup', new LocalStrategy({  
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, username, password, done) {

	    db.query("SELECT * FROM users WHERE username = ?", username, function(err, rows){
			if (err) {                
                return done(err);
            }
              
			if (rows.length) {                
                return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
            } else {				
                    
                const saltRounds = 10; 
                let newUserMysql = new Object();

                newUserMysql.username = username;                
                newUserMysql.password = password; 
                newUserMysql.email = req.body.email;
                newUserMysql.name = req.body.name;               
            
                let insertQuery = `INSERT INTO users ( username, name, email, password ) VALUES (?, ?, ?, ?)`;
                
                bcrypt.hash(password, saltRounds, function(err, hash) {
                    db.query(`INSERT INTO users ( username, password, email, name ) VALUES (?,?,?,?)`, [username, hash, req.body.email, req.body.name], function(err, rows) {
                        if(err) {    
                            logger.error(err);
                            return done(null, false, req.flash('signupMessage', `${err}`));
                        } else {
                            newUserMysql.id = rows.insertId;
                            return done(null, newUserMysql);
                        }
                    });	
                });
            }
		});
    }));
 

    passport.use('local-login', new LocalStrategy({
    
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, username, password, done) {

         db.query("SELECT * FROM `users` WHERE `username` = ?", username, function(err,rows){
			if (err)
                return done(err);
			 if (!rows.length) {
                return done(null, false, req.flash('loginMessage', `You're not in our database.`));
            } 
			
            bcrypt.compare(password, rows[0].password, function(err, isMatch) {
                if(err) {
                    logger.error(err);
                }

                if(isMatch) {
                    return done(null, rows[0]);		
                } else {
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                }
            });
		});
    }));
};