const BaiduUtil = require('./baidu_util.js');
const WechatHelper=require('./wechat_helper');
const fs = require('fs');
const Config = require('../config/config.json');
const env = Config.ENV;




class TmallUtil {

    /** 结果提送微信
     * 
     * @param {*} _msg 消息
     */
    async pushMsg(_msg){
        console.log("天猫精灵打卡姬，异步结果启动!");
        let wechat=new WechatHelper();
        let tokenRes=await wechat.getToken();
        if(tokenRes.status){
            await wechat.sendMsg(tokenRes.data,`【天猫精灵自动化打卡】消息通知:${_msg}`);
        }
    }


    /** 打卡方法
     * 
     * @param {*} _keywords 关键字列表
     */
    async check(_keywords){
        console.log("天猫精灵打卡姬，正式启动!");
        let test = new BaiduUtil();
        let wechat=new WechatHelper();
        
        _keywords.push('对我说“闭嘴”');
        
        for (let i = 0; i < _keywords.length; i++) {
            let cmdStr = _keywords[i].replace(/[^\u4e00-\u9fa5]/gi, "").replace('对我说', '天猫精灵,');
            console.log(`第${i}条打卡指令:${cmdStr}`);
            if (env !== 1) {
                let txt2AudioRes=await test.textToAudio(cmdStr);
                console.log(txt2AudioRes);
                let playRes=await test.playMp3();
                console.log(playRes);
                let tokenRes=await wechat.getToken();
                if(tokenRes.status){
                    await wechat.sendMsg(tokenRes.data,`【天猫精灵自动化打卡】第${i}条指令:${cmdStr},文字转语音结果${txt2AudioRes.status},播放结果${playRes.status}`);
                }
                
                test.sleep(5000);
            }
        };
        console.log("打卡任务执行完毕");


    }





    async ocrCheck() {
        console.log("天猫精灵打卡姬，启动!");
        //读取任务截图，以后改成爬虫自动获取
        let test = new BaiduUtil();
        let imageData = fs.readFileSync('./WechatIMG123.jpeg');
        let imageDataBase64 = Buffer.from(imageData).toString("base64");
        //图片中文字识别，提取打卡关键字
        console.log("读取任务页面截图成功，准备开始解析");
        let ocrResult = await test.ocrFilter(imageDataBase64, '对我说');
        let ocrArray = ocrResult.data;
        //加一条指令，让天猫精灵闭嘴
        ocrArray.push({ words: '对我说“闭嘴”' });
        for (let i = 0; i < ocrResult.data.length; i++) {
            let cmdStr = ocrResult.data[i].words.replace(/[^\u4e00-\u9fa5]/gi, "").replace('对我说', '天猫精灵,');
            console.log(`第${i}条打卡指令:${cmdStr}`);
            if (env === 1) {
                console.log(await test.textToAudio(cmdStr));
                console.log(await test.playMp3());
                test.sleep(5000);
            }

        };
        console.log("打卡任务执行完毕");
    }





}

module.exports=TmallUtil;



