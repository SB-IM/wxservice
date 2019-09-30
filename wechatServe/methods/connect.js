// 引入mongoose
var mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/wxserve', function (err) {
  if (err) {
    throw err
  } else {
    console.log('数据库已连接了')
  }
})
