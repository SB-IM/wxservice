const fs = require('fs');
const readline = require('readline');
// 解析获取航线坐标轴
 function getMapPath(url,cb) {
    let input = fs.createReadStream(url)
    const rl = readline.createInterface({
        input: input
    });
    let arr = []
    rl.on('line', (line) => {
        let data = line.split(/\s+/)
        if (data[3] == '16') {
            // arr.push({
            //     lat: Number.parseFloat(data[8]),
            //     lng: Number.parseFloat(data[9])
            // });
            arr.push([Number.parseFloat(data[8]),Number.parseFloat(data[9])])
        }
        // console.log(`Line from file: ${data}`);
    });
     rl.on('close', (line) => {
        console.log("读取完毕！");
        cb(arr)
    })
}

module.exports = getMapPath;