import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import expressValidator from 'express-validator';
import passport from 'passport';
import flash from 'connect-flash';
import session from 'express-session';



export default app => { 
    app.use(cors());
    app.use(bodyParser.json()); 
    app.use(expressValidator());
    app.use(bodyParser.urlencoded({ extended: true })); 
    app.use(session({ 
        secret: process.env.COOKIE_SECRET,
        cookie: { maxAge: 60000 },
        resave: true,
        saveUninitialized: true
    }));  
    app.use(morgan('combined'));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
}

