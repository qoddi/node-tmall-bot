'use strict';
const Config = require('../config/config.json');
const appIdSpeech = Config.SPEECH_APP_ID;
const apiKeySpeech = Config.SPEECH_API_KEY;
const secretKeySpeech = Config.SPEECH_SECRET_KEY;
const appIdOcr = Config.OCR_APP_ID;
const apiKeyOcr = Config.OCR_API_KEY;
const secretKeyOcr = Config.OCR_SECRET_KEY;
const env = Config.ENV;
const AipSpeechClient = require("baidu-aip-sdk").speech;
const AipOcrClient = require("baidu-aip-sdk").ocr;
const HttpClient = require("baidu-aip-sdk").HttpClient;
const fs = require('fs');
var { execFile } = require('child_process');
const { resolve } = require('path');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
const { ocr } = require('baidu-aip-sdk');

class BaiduUtil {
  constructor() {
    this.baiduSpeechClient = new AipSpeechClient(appIdSpeech, apiKeySpeech, secretKeySpeech);
    this.baiduOcrClient = new AipOcrClient(appIdOcr, apiKeyOcr, secretKeyOcr);
  }


  /** 图片中的文字识别
   * 
   * @param {*} _text 
   * @param {*} _fileName 
   */

  async ocr(_image) {
    let that = this;
    return new Promise((_resolve, _reject) => {
      that.baiduOcrClient.generalBasic(_image).then(function (result) {
        if (!result.words_result) {
          _reject({ status: false, err: result.err_msg });
        };
        _resolve({ status: true, msg: "图片中文字识别成功", data: result.words_result });

      })
    })

  }


  async ocrFilter(_image, _filter) {
    console.log('开始过滤指定指令识别图片中的文字');
    let words = await this.ocr(_image);
    let filterArray = words.data.filter((value, index) => {

      return eval('/' + _filter + '/').test(value.words);
    })
    console.log('过滤指令:' + _filter + ',过滤前的长度' + words.data.length + ',过滤后的长度:' + filterArray.length);
    return { status: true, msg: '过滤图片文字识别成功', data: filterArray }
  };

  /** 文字转语音
   * 
   * @param {*} _text  文字
   * @param {*} _fileName 输出文件名
   */
  async textToAudio(_text, _fileName) {
    console.log('开始执行文字转语音:' + _text);
    let that = this;
    return new Promise((_resolve, _reject) => {
      that.baiduSpeechClient.text2audio(_text).then(function (result) {
        if (!result.data) {
          console.log(result);
          _reject({ status: false, err: result.err_msg });
        };
        fs.writeFileSync(_fileName || 'tmp.mp3', result.data);
        _resolve({ status: true, msg: "文字转语音成功" });

      })
    })
  };




  /** 播放指令文字
   * 
   * @param {*} _fileName 文件名
   */
  async playMp3(_fileName) {
    let that = this;
    return new Promise((_resolve, _reject) => {
      var play = execFile('play', [_fileName || 'tmp.mp3'],
        (error, stdout, stderr) => {
          if (error) {
            console.log(error)
            _reject({ status: false, err: result.err_msg });

          }
          console.log(stdout);
          _resolve({ status: true, msg: "播放成功" });
        })
    })
  }

  async sleep(n) {
    var start = new Date().getTime();//定义起始时间的毫秒数
    while (true) {
      var time = new Date().getTime();//每次执行循环取得一次当前时间的毫秒数
      if (time - start > n) {//如果当前时间的毫秒数减去起始时间的毫秒数大于给定的毫秒数，即结束循环
        break;
      }
    }
  }



}

module.exports=BaiduUtil;

async function unit() {
  //读取任务截图，以后改成爬虫自动获取
  let test = new BaiduUtil();
  let imageData = fs.readFileSync('./WechatIMG123.jpeg');
  let imageDataBase64 = Buffer.from(imageData).toString("base64");
  //图片中文字识别，提取打卡关键字

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






}





//unit()
