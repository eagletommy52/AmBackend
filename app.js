const createError = require('http-errors');
const express = require('express');
const path = require('path');

const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');
const rsvpRouter = require('./routes/rsvp')

const app = express();


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(()=>console.log('MongoDB Connected'))
  .catch(err=>{console.log(err)})

const slowDown = require("express-slow-down");
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 25, // allow 25 requests per 15 minutes, then...
  delayMs: 500 // begin adding 500ms of delay per request above 100:
});
//  apply to all requests
app.use(speedLimiter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/rsvp', rsvpRouter)

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

module.exports = app;
