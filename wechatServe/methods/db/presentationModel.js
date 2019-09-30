
var mongoose = require('mongoose')
// 配置骨架
var presentationSchems = new mongoose.Schema({
    id: String,
    user_id: String,
    group_id:String,
    plan:{
        id:String,
        name:String,
        description:String
    }
})
var presentationModel = mongoose.model('presentationModel', presentationSchems, 'presentationlist')
module.exports=presentationModel