
var http = require('http')
var url = require('url');
var qs = require('querystring');//解析参数的库
var exec = require('child_process').exec;
var server = http.createServer()
var TmallUtil = require('./util/tmall_util');

function test() {
    console.log('function test executed');
};



function check(_arg) {
    console.log('function check executed');
    let keyWords = JSON.parse(_arg.keyword);
    let tmall = new TmallUtil();
    tmall.check(keyWords);


};

function push(_arg) {
    console.log('function check executed');
    let tmall = new TmallUtil();
    tmall.push(_arg.msg);
}

server.on('request', function (request, response) {
    console.log('request uri：' + request.url)
    //得到键值对
    var arg1 = url.parse(request.url, true).query;
    //获得请求路径
    var pathname = url.parse(request.url, true).pathname;
    //打印键值对中的值
    console.log(arg1.keyword);


    if (pathname === '/tmall/check') {
        response.write('tmall check service success')
        //启动蓝牙连接
        let shell = new ShellUtil();
        shell.execShell('./config/ble.sh');
        check(arg1);
    }

    if (pathname === '/tmall/push') {
        response.write('tmall push service success')
        push(arg1);
    }

    if (request.url === '/tmall/test') {
        response.write('interface test')
        test();
    }
    response.write('hello')
    response.write(' nodejs')

    response.end()
})

server.listen(3000, function () {
    console.log('\r\nservice start success，open http://127.0.0.1:3000/')
})
