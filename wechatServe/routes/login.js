var express = require('express');
var router = express.Router();
var request = require('request')
var multer = require('multer')
var fs = require('fs')
// 获取无人机的微信授权,获取openid
router.get('/openid', function (req, res, next) {
    console.log(req.query.code)
    let code = req.query.code  //前端授权传过来的code，用作跟微信服务器换取openid
    // 第一步，获取access_token and openid
    request({
        url:`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${K_config.appId}&secret=${K_config.secret}&code=${code}&grant_type=authorization_code`,
        method: 'GET'
    }, (err, resd, body) => {
        let openid = JSON.parse(body).openid
        let access_token = JSON.parse(body).access_token
        let REDIRECT_URL = ``  // 重定向的url
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
            client_id: K_config.client_id,
            client_secret: K_config.client_secret
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
router.post('/api/v1/webhook', multer({
    dest: 'file'
}).array('file', 10), (req, res) => {
    let message = req.body; // 传过来的数据列表
    let files = req.files;  // 传过来的文件列表  
    if (files.length === 0) {
        res.json("上传文件为空！");
        return
    } else {
        let fileInfos = [];
        for (var i in files) {
            let file = files[i];
            let fileInfo = {};
            fs.renameSync('./file/' + file.filename, './file/' + file.originalname);// 这里修改文件名。
            // 获取文件基本信息
            fileInfo.mimetype = file.mimetype;
            fileInfo.originalname = file.originalname;
            fileInfo.size = file.size;
            fileInfo.path = file.path;
            fileInfos.push(fileInfo);
        }
        // 文件已能正常保存至file目录
        // 设置响应类型及编码
        res.set({
            'content-type': 'application/json; charset=utf-8'
        });
        res.json("success!");
    }
    /*
    后续进行数据库操作，前端请求显示数据库信息 
    （ 已测试都能接收到各类数据，接受数据 => 数据以及文件url存库 => 调用下方的send方法推送 / 前端访问 => 根据id号渲染这条信息的报告
    */
})

//send 微信推送
function send(access_token, openid, template_id) {
    const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${access_token}`
    const requestData = { //发送模板消息的数据
        touser: openid,
        template_id: template_id,
        url: 'http://weixin.qq.com/download'
    }
    request({
        url: url,
        method: 'POST',
        body: JSON.stringify(requestData),
    }, (err, response, body) => {
        console.log(body)
    })
}

module.exports = router