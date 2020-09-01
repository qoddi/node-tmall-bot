# node_tmall_bot
## 程序功能
1. 配合autojs提取天猫精灵app中的打卡任务，打卡完成情况
2. 部署于树莓派/armbian上的基于nodejs的服务端，对接百度AI平台接口，实现文字转语音打卡
3. 推送文字转语音情况以及采集的打卡完成情况，转发文字转语音情况，任务完成情况到企业微信推送号

## 准备工作
1. 树莓派一个，已直接音响或蓝牙音响，已安装pulseaudio服务并启动，使用play xxx.mp3可以正常播放音乐，并安装nodejs基础服务
2. 部署autojs的手机一台，需取消解锁密码
3. 蓝牙音响一台
4. 申请好的微信企业号(免费的)并获取到key，申请好的百度api账号(免费的)并获取到key

##使用方法
1. config目录下的tmall_get_keyword_callback.js，为天猫精灵打开采集程序，配合autojs定时任务运行
2. 上面的脚本中，需要把urlPrefix中的ip地址改为实际树莓派地址
3. 程序拷贝到树莓派后，使用npm install --safe安装依赖包，修改配置文件中的SPEECH开头的几个百度的key,以及secret、agentId、id三个微信企业号的key,然后使用node index.js启动服务

4. 使用其他电脑访问http://树莓派ip:3000/tmall/check?keyword=[对我说早上好,对我说你好]  测试语音接口功能,如果没问题以后可以用pm2实现开机启动，详情百度

##注意事项
1. config目录下有一个连接蓝牙音响的shell，如果用的蓝牙音响，把里面的mac地址换成你音响的地址
