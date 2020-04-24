const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
// const validator = require('express-validator');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');

const MONGO_URI = 'mongodb://localhost/kik-chat';

const app = express();
const store = new MongoDBStore({
    uri: MONGO_URI,
    collection: 'sessions'
});

// connect to mongodb
mongoose.connect(MONGO_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true 
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.log(err);
});

// get routes
const usersRoutes = require('./routes/users');

require('./config/passport-local');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'assets')));
// app.use(express.static(path.join(__dirname, 'helpers')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use(cookieParser());
app.use(session({
    secret: 'mustbesecrethuh',
    resave: false,
    saveUninitialized: false,
    store
}));
app.use(flash());
// app.use(validator());
app.use(passport.initialize());
app.use(passport.session());

// set template engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// use routes
app.use(usersRoutes);

// app listen
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`App is up on port ${PORT}`);
});