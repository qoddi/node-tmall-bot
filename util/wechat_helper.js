const urllib = require('urllib');
const config = require('../config/config.json');
const tokenApiUrl = 'https://qyapi.weixin.qq.com/cgi-bin/gettoken';
const pushApiUrl = 'https://qyapi.weixin.qq.com/cgi-bin/message/send';

class WechatHelper {
    constructor() {
        this.secret = config.secret;
        this.agentId = config.agentId;
        this.id = config.id;
    }


    /** 获取token
     * 
     */
    async getToken() {
        try {
            let apiRes = await urllib.curl(tokenApiUrl, {
                method: 'GET',
                data: {
                    'corpid': this.id,
                    'corpsecret': this.secret,
                },
                dataAsQueryString: true,
                dataType: 'json',
            });
            if (apiRes.status !== 200) throw new Error('http status code error');
            if (apiRes.data.errcode !== 0) throw new Error(apiRes.data.errmsg);
            return {
                status: true,
                data: apiRes.data.access_token,
            }
        } catch (error) {
            console.error(error);
            return {
                status: false,
                error: error
            }
        }
    }

    async sendMsg(_token, _data) {
        let content=JSON.stringify({
            "touser": "@all",
            "msgtype": "text",
            "agentid": this.agentId,
            "text": { "content": _data },
            "safe": 0
        });
        try {
            let apiRes = await urllib.curl(pushApiUrl + '?access_token=' + _token, {
                method: 'POST',
                data: content,
                contentType:'text',
                dataType: 'json',
            });
            if (apiRes.status !== 200) throw new Error('http status code error');
            if (apiRes.data.errcode !== 0) throw new Error(apiRes.data.errmsg);
            return {
                status: true,
                data: '',
            }
        } catch (error) {
            console.error(error);
            return {
                status: false,
                error: error
            }
        }
    }


}

module.exports = WechatHelper;