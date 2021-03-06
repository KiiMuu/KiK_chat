const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const _ = require('lodash');
const { Users } = require('./helpers/UsersClass');
const { Global } = require('./helpers/Global');

const MONGO_URI = 'mongodb://localhost/kik-chat';

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

const store = new MongoDBStore({
    uri: MONGO_URI,
    collection: 'sessions'
});

// connect to mongodb
mongoose.connect(MONGO_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.log(err);
});

// socket.io
require('./socket/groupchat')(io, Users);
require('./socket/friend')(io);
require('./socket/globalroom')(io, Global, _);
require('./socket/privatemessage')(io);

// get routes
const usersRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const homeRoutes = require('./routes/home');
const groupChat = require('./routes/group');
const resultsRoutes = require('./routes/results');
const privateChat = require('./routes/privatechat');

require('./config/passport-local');
require('./config/passport-facebook');
require('./config/passport-google');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'helpers')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use(express.static(path.join(__dirname, '/public/uploads')));
app.use(cookieParser());
app.use(session({
    secret: 'thisIsSoSecured',
    resave: true,
    saveUninitialized: true,
    store
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// set template engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// use routes
app.use(usersRoutes);
app.use(adminRoutes);
app.use(homeRoutes);
app.use(groupChat);
app.use(resultsRoutes);
app.use(privateChat);

// app listen
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`App is up on port ${PORT}`);
});