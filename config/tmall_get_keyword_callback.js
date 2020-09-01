function check() {
    auto.waitFor();
    unlockPhone();
    var appName = "天猫精灵";
    launchApp(appName);
    sleep(15000);
    var chongyaBtn = text("冲鸭打卡").findOne().parent();
    if (!chongyaBtn) {
        toast("未找到冲鸭按钮");
        killApp2();
    };
    chongyaBtn.click();

    sleep(2000);
    var keyword = classNameContains("View").textContains("对我说").untilFind();
    if (!keyword) {
        toast("未找到签到指令");
        killApp2();
    }
    var keywordList = [];
    if (!keyword.empty()) {
        for (let i = 0; i < keyword.length; i++) {
            keywordList.push(keyword[i].text());
        }
    };
    toast("第1句打卡指令:" + keywordList[0] + "\r\n第2句打卡指令:" + keywordList[1]);
    let urlPrefix = "http://192.168.123.253:3000/tmall/check?keyword=";
    let r = http.get(urlPrefix + JSON.stringify(keywordList));
    sleep(5000);
    toast("冲鸭打卡关键字采集执行完成，开始进入校验流程");
    killApp2();

}


function checkResult() {
    var appName = "天猫精灵";
    launchApp(appName);
    sleep(15000);
    var chongyaBtn = text("冲鸭打卡").findOne().parent();
    if (!chongyaBtn) {
        toast("未找到冲鸭按钮");
        killApp2();
    };
    chongyaBtn.click();

    sleep(2000);
    var result = classNameContains("View").textContains("进度").findOne();
    toast("冲鸭打卡进度:" + result.text());
    if (!result) {
        toast("未找到签到结果信息");
        let urlPrefix = "http://192.168.123.253:3000/tmall/push?msg=";
        let msg = "autojs格式化签到结果失败"
        let r = http.get(urlPrefix + msg);
    } else {

        let urlPrefix = "http://192.168.123.253:3000/tmall/push?msg=";
        let msg = "签到结果:" + (/2\/2/.test(result.text()) ? "成功" : "失败") + ",进度详情:" + result.text();
        toast("签到结果查询成功:" + msg);
        let r = http.get(urlPrefix + msg);
        //当检测打卡失败时，尝试重新打卡
        if (!/2\/2/.test(result.text())) {
            killApp2();
            check();
        }

    }
    sleep(5000);
    killApp2();
}

// 停止APP
function killApp(packageName) {
    shell('am kill ' + packageName, true);
    exit;
};

function killApp2() {
    let packageName = currentPackage();
    app.openAppSetting(packageName);
    text(app.getAppName(packageName)).waitFor();
    let is_sure = textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*)/).findOne();
    if (is_sure.enabled()) {
        textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*)/).findOne().click();
        textMatches(/(.*确.*|.*定.*)/).findOne().click();
        log(app.getAppName(packageName) + "应用已被关闭");
        sleep(1000);
        back();
    } else {
        log(app.getAppName(packageName) + "应用不能被正常关闭或不在后台运行");
        back();
    }
}


function unlockPhone() {
    if (!device.isScreenOn()) {
        device.wakeUp();
        gesture(1000, [350, 1100], [350, 500]);
        sleep(5000);
    }

}
check();
sleep(60000);
checkResult();

