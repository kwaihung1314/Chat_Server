const express = require('express');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

const MongoClient = require('mongodb').MongoClient;
const dbUri = 'mongodb+srv://kwaihung1314:admin@firstcluster-dpxbb.gcp.mongodb.net/test?retryWrites=true';
const dbClient = new MongoClient(dbUri, { useNewUrlParser: true });

dbClient.connect((err, client) => {
  if (err) {
    console.log(err.message);
    return;
  }
  const db = dbClient.db('chatroom');
  const collection = db.collection('test');
  console.log('successful connected to db ' + db.databaseName + ' of mongo');
  collection.insertOne({a: 'hello'}, (err, result) => {
    if (err) {
      console.log(err.message);
    }
    console.log(result.ops);
  });
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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