var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const request = require('request')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var login = require('./routes/login');
const fs = require('fs')
var app = express();
// 读取配置文件
new Promise(res => {
  fs.readFile('./config.json', 'utf-8', (err, data) => {
    var config = JSON.parse(data)
    res(config)
  });
}).then(data => {
  global.apiUrl = data.apiUrl
  global.Post = data.Post // 监听的端口号
  global.appId = data.appId   // 公众号appid
  global.secret = data.secret   // 公众号密钥  
  global.client_id = data.client_id
  global.client_secret = data.client_secret
  global.urls = function (post) {
    return data.apiUrl + post
  }
})
//设置跨域访问
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT,GET,POST,DELETE,OPTIONS");
  res.header("ACCess-Control-Allow-Headers", "Content-Type,username");
  next();
});
// view engine setup
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', login);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(4000, function () {
  console.log(`Server Connected : 4000`)
})


module.exports = app;
