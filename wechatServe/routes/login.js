var express = require('express');
var router = express.Router();
var request = require('request')
var multer = require('multer')
var upload = multer({ dest: '../file' })
express.use(upload.fields('fields'))
// 获取无人机的微信授权,获取openid
router.get('/openid', function (req, res, next) {
    console.log(req.query.code)
    let code = req.query.code  //前端授权传过来的code，用作跟微信服务器换取openid
    // 第一步，获取access_token and openid
    request({
        url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + appId + '&secret=' + secret + '&code=' + code + '&grant_type=authorization_code',
        method: 'GET'
    }, (err, resd, body) => {
        let openid = JSON.parse(body).openid  
        let access_token=JSON.parse(body).access_token
        let REDIRECT_URL=``  // 重定向的url
        res.redirect(`${REDIRECT_URL}?openid=${openid}`)   // 重定向并携带openid（如需后续操作需用到openid
    })
    // res.send(`body`)
});

// 登录主账号 ， 登录成功=>绑定微信openid
router.post('/login', (req, result) => {
    let userName = req.body.username
    let passWord = req.body.password
    request({
        url: urls('/oauth/token'),
        method: "POST",
        form: {
            grant_type: "password",
            username: userName,  // "sb@sb.im"
            password: passWord,  // 123456
            client_id: client_id,
            client_secret: client_secret
        }
    }, async (err, res, body) => {
        let data = JSON.parse(body)
        if (data.access_token) {
            const token = await JSON.parse(body).access_token
            console.log(`token`, token)
            console.log(`------------`)
            request({
                url: urls('/api/v1/user'),
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            }, (err, res, body) => {
                console.log(JSON.parse(body))
                /*
                  ...
                  数据库操作等流程数据等完善再做
                  ...
                */
                result.status(200)
                result.json({
                    code: '10002',
                    msg: '登录成功',
                    data: JSON.parse(body)
                })
            })
        } else {
            result.status(200)
            result.json({
                code: '10002',
                msg: '密码错误'
            })
        }
    })

})

// 接收webhook接口
router.post('/api/v1/webhook', (req, res) => {
    console.log(req.body)   //数据列表
    console.log(req.files)  // 文件列表
    /*
    后续进行数据库操作，前端请求显示数据库信息
    */
})

//send 微信推送
function send(access_token,openid,template_id){
    const url=`https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${access_token}`
    const requestData = { //发送模板消息的数据
        touser: openid,
        template_id: template_id,
        url: 'http://weixin.qq.com/download'
        }
    request({
        url:url,
        method: 'POST',
        body:JSON.stringify(requestData),
    },(err,response,body)=>{
        console.log(body)
    })
  }

module.exports = router