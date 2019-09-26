var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const rooms = require('./routes/rooms'); /*Following the REST convention, our new action should be on URL makereddit.com/rooms/new, not makereddit.com/new.
We need to namespace our routes under rooms. So inside our app.js file, let's add the following:
This tells our index router that all of the URL's we define in routes/rooms.js should be accessed under rooms*/

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'secret-unique-code', cookie: { maxAge: 3600000 }, resave: true, saveUninitialized: true }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/rooms', rooms);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Database setup
const mongoose = require('mongoose');
const mongoURI = 'mongodb://newreddit:Obinna1!@ds253324.mlab.com:53324/newreddit';

mongoose.connect(mongoURI)
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


module.exports = app;
