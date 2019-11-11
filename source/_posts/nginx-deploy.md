---
title: 全栈工程师最后一公里实战
date: 2019-11-08 17:06:44
tags:
description: 服务器上线node项目、安装mongodb、配置https
---

### 远程登录服务器

#### 第一次 ssh 远程登录服务器

设置密码
登录

```bash
ssh root@[IP ID地址]
```

#### 配置 root 及应用账号权限

```json
$ adduser hhp # 自动加入群组 hhp，生成 /home/hhp
$ gpasswd -a hhp sudo # 将 hhp 加入到 群组 sudo
$ sudo visudo # 设置
# User privilege specification
hhp ALL=(ALL:ALL) ALL
# 或者
hhp ALL=(ALL) NOPASSWD: ALL
# 上面的NOPASSWD表示，切换sudo时，不需要输入密码，而第一种则是正常的输入密码
```

保存
执行“Ctrl+O”
回车
执行完“Ctrl+O”后，会输出”File Name to Write sudoers.tmp”，在 tmp 后执行回车
退出
执行“Ctrl+X”

用新账号远程联机

```bash
$ ssh hhp@[外网 IP]
```

#### 配置本地无密码 SSH 登录

(1) 客户端配置

```bash
# 确保还没有创建过（没有 id_rsa）
$ ls ~/.ssh
# 新建公钥和私钥
$ ssh-keygen -t rsa -b 4096 -C "[电子邮件地址]"
# 会生成 id_rsa 和 id_rsa.pub 两个文件
```

(2) 服务端配置 ~/.ssh/authorized_keys 文件

```bash
# 将客户端的 id_rsa.pub 中的公钥信息复制到这个文件
$ vi ~/.ssh/authorized_keys
# 文件权限设置
$ sudo chmod 600 ~/.ssh/authorized_keys
# 重启 ssh 服务
$ sudo service ssh restart
```

(3) 然后就可以通过 ssh 登录服务器而不需要密码了

### 增强服务安全等级

#### 修改服务器默认 ssh 登录端口

注意：远程修改 ssh 的配置文件有可能不小心就导致当前 ssh 连接断线，再也不能用 ssh 远程登录。因此可以多开一个 ssh 登录服务器。

```json
$ sudo vim /etc/ssh/sshd_config
# 可以是 0-65536，其中 0-1024 通常会被系统程序使用，而且必须占用这个端口的程序用 root 身份才能启动，因此最好别用 0-1024
Port 12345
PermitRootLogin no
UseDNS no
PasswordAuthentication no
PermitEmptyPasswords no
AllowUsers [允许 ssh 远程登录的用户名]

# 重启 ssh 服务

$ sudo service ssh restart
```

#### 配置 iptables 和 Fall2Ban 增强安全等级 iptables

☑ 注意: 为了防止 iptables 设置不当导致远程无法登陆，额外开一个 ssh 远程登录。

```json
# 清空当前所有 iptables 规则
$ sudo iptables -F
# 编写 iptables 规则的配置文件
$ sudo vim /etc/iptables.up.rules
*filter
# allow all input
-A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
# allow all output
-A OUTPUT -j ACCEPT
# allow http(s)
-A INPUT -p tcp --dport 443 -j ACCEPT
-A INPUT -p tcp --dport 80 -j ACCEPT
# allow ssh port login
-A INPUT -p tcp -m state --state NEW --dport 12345 -j ACCEPT
# allow ping
-A INPUT -p icmp -m icmp --icmp-type 8 -j ACCEPT
# log denied calls
-A INPUT -m limit --limit 5/min -j LOG --log-prefix "iptables denied:" --log-level 7
# drop incoming sensitive connections
-A INPUT -p tcp --dport 80 -i eth0 -m state --state NEW -m recent --set
-A INPUT -p tcp --dport 80 -i eth0 -m state --state NEW -m recent --update --seconds 60 --hitcount 150 -j DROP
# reject all other inbound
-A INPUT -j REJECT
-A FORWARD -j REJECT

COMMIT

# 应用防火墙规则
$ sudo iptables-restore < /etc/iptables.up.rules
# 查看防火墙是否开启
$ sudo ufw status
# 开启防火墙
$ sudo ufw enable
# 设置 iptables 在网络服务启动时自动启动
$ vim /etc/network/if-up.d/iptables

#!/bin/sh
iptables-restore /etc/iptables.up.rules
$ sudo chmod +x /etc/network/if-up.d/iptables
```

**Fail2Ban**

☑ 说明： 一个安防模块，可以看作一个防御性的动作库，通过监控系统的日志文件，根据检测到任意可疑的行为，出发不同的环境动作，比如对可疑的目标执行 ip 锁定等。

##### 安装

```bash
$ sudo apt-get install fail2ban
```

##### 配置

/etc/fail2ban/jail.conf

```bash
bantime = 3600
destemail = mengqingshen_sean@outlook.com
action = %(action_mw)s
```

##### 运行状态

```bash
$ sudo service fail2ban status
```

##### 开启与关闭

```bash
$ sudo servive fail2ban start
$ sudo servive fail2ban stop
```

### 搭建 Nodejs

#### 搭建服务器的 Nodejs 环境依赖环境

```bash
$ sudo apt-get update # 更新系统
$ sudo apt-get install vim openssl build-essential libssl-dev wget curl git
```

#### nvm

☑ 注意: 安装后，需要重新登入终端，从而载入 nvm 相关的环境变量。

```bash
$ wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
```

最好重新打开一个窗口，进行一下命令

#### nodejs

```bash
$ nvm ls-remote
$ nvm install v7.9.0
$ nvm use v7.9.0
$ nvm alias default v7.9.0 # 使系统里面的默认版本是 v7.9.0
```

#### 升级 npm

```bash
# 国内网速慢的话，可以考虑用淘宝的源
$ npm install --registry=https://registry.npm.taobao.org install -g npm
```

#### 设置系统文件监控数目

```bash
$ echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

#### 使用 cnpm 取代 npm

☑ 注意: 只要网络不是太糟糕，建议始终使用 npm 而不是 cnpm。

```bash
$ npm install --registry=https://registry.npm.taobao.org install -g cnpm
```

#### 常用 nodejs 包

```bash
$ npm i pm2 webpack gulp grunt-cli -g
```

#### 借助 pm2 让 Nodejs 服务常驻

```bash
# 启动 nodejs 程序
$ pm2 start app.js
# 当前 pm2 管理的 nodejs 程序列表
$ pm2 list
# 查看某个程序的详细信息
$ pm2 show app
# 查看实时日志
$ pm2 logs
```

### 配置 nginx 实现反向代理

#### 删除 apache

```bash
$ sudo service apache2 stop
$ sudo service apache stop
$ update-rc.d -f apache2 remove
$ sudo apt-get remove apache2
```

#### 安装 nginx

```bash
$ sudo apt-get update
$ sudo apt-get install nginx
```

#### 配置 nginx

/etc/nginx/conf.d/webappbook-8081.conf

```
upstream imooc {
      server 127.0.0.1:8081;
}

server {
    listen 80;
    server_name [服务器外网 IP 地址];

    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-Nginx-Proxy true;
        proxy_pass http://imooc;
        proxy_redirect off;
        }
}
```

```bash
$ sudo nginx -s reload
```

/etc/nginx/nginx.conf

```json
...http {
    ...
    # 响应头中隐藏 nginx 版本信息
    server_tokens off;
    include /etc/nginx/conf.d/*.conf;
    ...
}
```

```bash

# 测试 nginx 有没有问题
$ sudo nginx -t
# 启动 nginx$ sudo nginx start
# 重新载入配置
$ sudo nginx -s reload
$ sudo service nginx reload
```

### 服务器配置安装 MongoDB

注意： 因为成本原因，MongoDB 和 Web 服务在同一个 ECS 实例上，在商业实践中，为了解耦，应当放在不同的实例中。或者有条件的话，可以购买阿里云专门的 MongoDB 数据库服务。

#### 在 Ubuntu 14.04 上安装 MongoDB

##### 安装

参考 MongoDB 官网 Install on Ubuntu

```bash
$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
$ echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
$ sudo apt-get update
$ sudo apt-get install -y mongodb-org
# 如果上一步提示找不到 mongodb-org，则将 aliyun 的源注释掉，使用 ubuntu 官方的源。
# $ sudo vim /etc/apt/apt.conf
# 然后，如果要加快加快下载速度，可以将 mongodb 的源改为 aliyun
# $ sudo vim /etc/apt/sources.list.d/mongodb-org-3.4.list
# deb [ arch=amd64,arm64 ] http://mirrors.aliyun.com/apt/ubuntu trusty/mongodb-org/3.4 multiverse
```

##### 配置 MongoDB 配置

/etc/mongod.conf

```
net:
    port 27018 # 为了安全起见，不使用默认端口

$ sudo service mongod restart
```

防火墙配置

/etc/iptables.up.rules

```
# mongodb connect
-A INPUT -s 127.0.1 -p tcp --destination-port 27017 -m state --state NEW,ESTABLISHED -j ACCEPT
-A OUTPUT -s 127.0.1 -p tcp --source-port 27017 -m state --state ESTABLISHED -j ACCEPT
$ sudo iptables-restore < /etc/iptables.up.rules
```

##### 启动

```bash
# mongodb 的日志文件

\$ cat /var/log/mongodb/mongod.log

# 启动 mongodb 服务

\$ sudo service mongod start

# 重启 mongodb 服务

\$ sudo service mongod restart

# 查看 mongodb 服务的状态

\$ sudo service mongod status
```

##### 连接

```bash
$ mongo --port 27018
```

#### 往线上 MongoDB 导入单表数据或数据库

☑ 技巧: 导入的时机一般是在数据库软件安装好之后，数据库用户创建前。从而避免用户权限带来的一些麻烦。

##### 整个数据库本地导出、打包、上传

```bash
# 存放项目备份数据的文件夹
$ cd deploy-projects
# 将本地 MongoDB 中的名为indust-app的数据库导出到当前目录下的 indust-app-backup 文件夹下
$ mongodump -h 127.0.0.1:27017 -d indust-app -o indust-app-backup
```

```bash
# 打包 MongoDB 数据库数据并压缩
$ tar zcvf indust-app.tar.gz indust-app-backup
# 上传到服务器
$ scp -P [ssh端口] ./indust-app-backup.tar.gz [远程服务器用户名]@[远程服务器 IP]:[远程服务器目录]
```

##### 服务器解压、导入

```bash
$ tar xvf indust-app-backup.tar.gz
$ cd indust-app-backup# 将解压的数据导入当前机器中的 MongoDB 的 indust-app 数据库
$ mongorestore --host 127.0.0.1:[mongoDB 服务端口] -d indust-app ./indust-app/
# 查看导入的数据
$ mongo --port [mongoDB 服务端口]> use indust-app> show tables
```

### 服务器正式部署和发布上线 Nodejs 项目

#### 上传项目代码到线上私有 Git 仓库

```bash
$ git config --global user.name "Scott"
$ git config --global user.email "xx@xx.xx"
$ cd deploy-project/website-server
# 初始化 git 仓库
$ git init
$ git add .
$ git commit -m 'First commit'
# 关联线上仓库
$ git remote add origin git@git.oschina.net:wolf18387/backend-website.git
# 同步数据
$ git push -u origin master
$ git fetch
$ git merge origin/master
$ git push -u origin master
```

#### 配置 PM2 一键部署线上项目结构

使用 PM2，并采用配置文件的方式来部署项目。

##### 服务端准备

(1) 准备好程序所在的文件夹

```bash
$ sudo mkdir -p /www/website
$ sudo chmod 777 /www/website
```

##### 从客户端发布

(1) 本地在项目中创建 PM2 配置文件

#/ecosystem.json

```js
{
 "apps": [
{
 "name": "Website", // 应用名称
 "script": "app.js", // 应用入口
 "env": {// 启动应用时的环境变量
 "COMMON_VARIABLE": true
 },
 "env_production": {// 生产环境启动应用时的环境变量
 "NODE_ENV": "production"
 }
 }
 ],
 "deploy": {
 "production": { // 任务名
 "user": "imooc_manager", // 生产服务器账号
 "host": ["120.26.235.4"], // 生产服务器地址
 "port": "39999", // 服务器 SSH 端口
 "ref": "origin/master", // 分支
 "repo": "git@git.oschina.net:wolf18387/backend-website.git", // 仓库地址
 "path": "/www/website/production", // 应用部署路径(绝对路径, 要确保该路径对 imooc_manager 可读可写可执行)
 "ssh_options": "StrictHostKeyChecking=no",
 "post-deploy": "npm install --registry=https://registry.npm.taobao.org && grunt build && pm2 startOrRestart ecosystem.json --env production",
 "env": { // 环境变量设置
 "NODE_ENV": "production"
 }
 }
}}
```

(2) 本地使用 PM2 部署到线上服务器

```bash
$ pm2 deploy ecosystem.json production setup
```

```bash
# 新配置的服务器可能还没有使用过ssh连接GitHub，方法与服务器的ssh登录相似
# 可以用以下命令测试
$ ssh git@github.com
```

#### 从本地发布上线和更新服务器的 Nodejs 项目

使用 PM2 实现本地控制远端代码更新和服务重启。

##### 服务端准备

```bash
$ sudo vim  ~/.bashrc
```

由于 PM2 需要以交互的方式通过 SSH 连接服务器，需要注释掉下面的代码:

```bash
# If not running interactively, don't do anything
#case $- in
#	*i*);;
#	*) return;;
#esac
```

```bash
$ source ~/.bashrc
```

##### 从客户端发布到服务端并启动应用

```bash
$ pm2 deploy ecosystem.json production
```

##### 修改入口代码

```js
let env = process.env.NODE_ENV || "development";
let dbUrl = "mongodb://127.0.0.1:20811/数据库名";
// 开发环境连接测试使用的 MongoDB 服务器
if (env === "development") {
  dbUrl = "mongodb://127.0.0.1/数据库名";
}

mongoose.connect(dbUrl, { useNewUrlParser: true });
```

##### nginx 配置

/etc/nginx/conf.d/\*\*\*.conf

```js
upstream movie {
  server 127.0.0.1:3001;
}

server {
  listen 80;
  server_name movie.iblack7.com;
  location / {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X-Nginx-Proxy true;
    proxy_pass http://movie;
    proxy_redirect off;
  }
  // 静态文件路由配置
  localtion ~* ^.+\.(jpg|jpeg|gif|png|ico|css|js|pdf|txt) {
    root /www/movie/production/current/public; // 静态文件路径
  }
}
```

##### iptables 配置 打开特定端口

/etc/iptables.up.rules

```bash
# movie
-A INPUT -s 127.0.0.1 -p tcp --destination-port 3001 -m state --state NEW,ESTABLISHED -j ACCEPT
-A OUTPUT -s 127.0.0.1 -p tcp --source-port 3001 -m state --state ESTABLISHED -j ACCEPT
```

```bash
$ sudo iptables-restore < /etc/iptables.up.rules
```

### 使用和配置更安全的 HTTPS 协议

#### SSL 证书

##### SSL 证书分类

| DV | 一般 | 个人博客、产品展示、中小企业网站 | 有些免费的可以选择，即便收费的也通常不贵，申请流程也比较简单。|
| OV | 企业级别、等级较高 | 常用在一些电商网站、社交、 O2O 等涉及到用户资料、订单支付的场景 | 审核比较严格，价格不亲民，对业务有一定规模的可以考虑。|
| EV | 按照严格身份验证标准颁发的证书，是目前全球最高等级的 SSL 证书，安全性非常高，使用这个证书的网站，浏览器地址栏一般会显示为绿色 | 常用金融支付、网上银行等资金交易比较敏感的场景。|

##### SSL 证书有效期

3 个月、一年；每次过期都需要更新证书，或者重新提交申请。可以通过一些工具或脚本，实现证书的自动更新。

##### 免费的 SSL 证书

沃通与 StarSSL 已经被 Google 与 Firefox 屏蔽。

##### 付费的 SSL 证书

赛门铁克、 Geotrust 、 亚洲诚信

#### 云平台申请免费证书及 Nginx 配置

又拍云、七牛云、腾讯云

##### Nginx 配置

(1) 将 SSL 证书文件上传到服务器

```bash
# 将 mini.iblack7.com 对应的 SSL 证书的 key 文件上传到服务器
$ scp -P [ssh 端口] mini.iblack7.com/Nginx/2_mini.iblack7.com.key imoooc_manager@[服务器IP]:/home/imooc_manager/
# 将 mini.iblack7.com 对应的 SSL 证书的证书文件上传到服务器
$ scp -P [ssh 端口] mini.iblack7.com/Nginx/1_mini.iblack7.com_bundle.crt imoooc_manager@[服务器IP]:/home/imooc_manager/

# 将 free.iblack7.com 对应的 SSL 证书的 key 文件上传到服务器
$ scp -P [ssh 端口] free.iblack7.com/Nginx/2_free.iblack7.com.key imoooc_manager@[服务器IP]:/www/ssl/
# 将 mini.iblack7.com 对应的 SSL 证书的证书文件上传到服务器
$ scp -P [ssh 端口] free.iblack7.com/Nginx/1_free.iblack7.com_bundle.crt imoooc_manager@[服务器IP]:/www/ssl/
```

(2) nginx 配置更新

```js
upstream free {
  server 127.0.0.1:3002;
}

# 将 HTTP 请求都重定向到 HTTPS 协议
server {
  listen 80;
  server_name free.iblack7.com;
  # rewrite ^(.*) https://$host$1 permanent;
  return 301 https://free.iblack7.com$request_uri;
}
server {
  #SSL--
  listen 443; # https 协议的默认端口
  server_name free.iblack7.com;
  ssl on; # 启动 ssl 认证
  ssl_certificate /www/ssl/1_free.iblack7.com_bundle.crt; # SSL 证书文件的路径
  ssl_certificate_key /www/ssl/2_free.iblack7.com.key; # SSL key 文件的路径
  ssl_session_timeout 5m;
  ssl_protocals TLSv1 TLSv1.1 TLSv1.2; # SSL 证书采用的协议
  ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE; # 配置的加密套件
  ssl_prefer_server_chiphers on;
  if ($ssl_protocol = "") {
       rewrite ^(.*) https://$host$1 permanent;
  }
  #-- SSL
  location / {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X-Nginx-Proxy true;
    proxy_pass http://free;
    proxy_redirect off;
  }
  // 静态文件路由配置
  localtion ~* ^.+\.(jpg|jpeg|gif|png|ico|css|js|pdf|txt) {
    root /www/app/production/current/public;
  }
}
```
