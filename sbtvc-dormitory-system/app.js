// installed third part packages
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');
const bodyParser = require('body-parser')
const session = require("express-session");
//const MongoStore = require('connect-mongo')(session);
const cors = require('cors');
const config = require("./configs/config.js");
//const mongoose = require('mongoose');

// mondodb session setup
//const db = mongoose.connection;

// database setup
/*
const mongoose = require('mongoose');
const db = require("./configs/config.js");
*/


const app = express();

// router setup
fs.readdirSync("./routers").forEach(async files => {
    let router = require(`./routers/${files}`);
    app.use(router);
    console.log(`[Routes] Loaded : ${files}`);
});

// database setup
fs.readdirSync("./database").forEach(async folders => {
    fs.readdirSync(`./database/${folders}`).forEach(async files => {
        require(`./database/${folders}/${files}`).connect();
        console.log(`[Database] Loaded : ${folders}/${files}`);
    });
});

/*
// point mongoose to the DB URI
mongoose.connect(db.database.mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const mongoDB = mongoose.connection;
mongoDB.on('error',console.error.bind(console,'Connection Error:'));
mongoDB.once('open',()=>{
   console.log('MongoDB Already Connected');
});
*/

// view engine setup
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');  //express -e

app.use(logger('dev'));
app.use(express.json());
/* app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db,
    }),
})); */
// connect session to MongoDB
/*app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db,
    }),
}));*/

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true 
}));
app.use(express.static(path.join(__dirname,'./public')));
app.use(express.static(path.join(__dirname,'./node_modules')));

// catch 404 and forward to error handler
app.use((req, res, next) =>{
    next(createError(404));
});

// error handler
app.use((err, req, res, next) =>{
    // set locals, only providing error in development
    // res.locals.message = err.message;
    // res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {},
    });
});

module.exports = app;