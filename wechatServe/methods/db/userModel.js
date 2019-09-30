
var mongoose = require('mongoose')
// 配置骨架
var userSchems = new mongoose.Schema({
    id:String,
    emailL:String,
    group: {
        id: String,
        name: String,
        description: String
      }
})
var userModel = mongoose.model('userModel', userSchems, 'userlist')
module.exports=userModel