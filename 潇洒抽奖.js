/**
 * 潇洒桐庐
 * 幻生魔改版
 * 原作者：小鹿
 * 30 7,9,17 * * *
 */

// got库设置全局代理
// const { bootstrap } = require('global-agent');
// process.env.GLOBAL_AGENT_HTTP_PROXY = 'http://cc1359.ddns.us:55555';
// bootstrap();

const $ = new Env("潇洒桐庐");
const notify = $.isNode() ? require("./sendNotify") : "";
let ckName = "xiaosa";
let envSplitor = ["&", "\n"]; //多账号分隔符
let strSplitor = "#"; //多变量分隔符
let userIdx = 0;
let userList = [];

function extractMiddleText (source, beforeText, afterText, allMatches = false) {
    let results = [];
    let startIndex = source.indexOf(beforeText);
    let sourceAfterBeforeText, endIndex;

    while (startIndex !== -1) {
        sourceAfterBeforeText = source.slice(startIndex + beforeText.length);
        endIndex = sourceAfterBeforeText.indexOf(afterText);

        if (endIndex === -1) {
            break;
        }

        results.push(sourceAfterBeforeText.slice(0, endIndex));
        if (!allMatches) {
            break;
        }

        source = sourceAfterBeforeText.slice(endIndex + afterText.length);
        startIndex = source.indexOf(beforeText);
    }

    return allMatches ? results : results[0] || '';
}

let channelIds = [];
class UserInfo {
    constructor(str) {
        this.index = ++userIdx;
        //this.ck = str.split(strSplitor)[0]; //单账号多变量分隔符
        this.ckStatus = true;
        this.artList = []
        this.accountId = null;
        this.sessionId = null;
        this.channelId = ``;
        this.round = 1;
        this.num = 10;
        if (str.split(strSplitor)[0].length === 11) {
            this.mobile = str.split(strSplitor)[0];
            this.password = str.split(strSplitor)[1];
        } else {
            this.sessionId = str.split(strSplitor)[0];
            this.accountId = str.split(strSplitor)[1];
        }
        if (str.split(strSplitor).length == 3) {
            this.nickName = str.split(strSplitor)[2];
        }
        this.code = null;
        this.username = null;
        this.wxopenId = null;
        //定义在这里的headers会被get请求删掉content-type 而不会重置
    }

    async main () {
        if (!this.accountId || !this.sessionId) {
            await this.getCode()
            if (this.code !== null) {
                await this.login()
            }
        }
        if (this.accountId && this.sessionId) {
            await this.getUserInfo();
            if (!this.valid) {
                let sessionId = this.sessionId;
                this.sessionId = this.accountId;
                this.accountId = sessionId;
                await this.getUserInfo();
            }
            if (this.valid) {
                await this.user_info()
                if (this.cnum > 0) {
                    await this.lottery_task()
                }
                if (this.wxopenId) {
                    for (let index = 0; index < channelIds.length; index++) {
                        const channelId = channelIds[index];
                        this.channelId = channelId;
                        await this.art_list();
                        if (this.artList?.length) {
                            break;
                        }
                    }
                    let canAddReadLottery = false;
                    for (let art of this.artList) {
                        if (art.mark_read == 1) {
                            console.log(`账号[${this.nickName || this.nick_name || this.index}] ${art.id}文章已经阅读过了，直接跳过！`);
                            continue;
                        }
                        await this.read_status(art.id)
                        if (this.artReadStatus == true) {
                            console.log(`账号[${this.nickName || this.nick_name || this.index}] 已阅读${art.id}`)
                            await this.read_task(art.id)
                        } else if (this.artReadStatus == false) {
                            console.log(`账号[${this.nickName || this.nick_name || this.index}] 未阅读${art.id}`)
                            await this.do_read(art.id)
                            await $.wait(5000 + Math.random() * 2000)
                            await this.read_task(art.id)
                            canAddReadLottery = true;
                        }
                    }
                    if (canAddReadLottery) {
                        await $.wait(Math.random() * 2000)
                        for (let index = 0; index < 8; index++) {
                            await this.lottery_num();
                        }
                    }
                } else {
                    $.log(`账号[${this.nickName || this.nick_name || this.index}] 未绑定微信`)
                }
            } else {
                $.log(`账号[${this.nickName || this.nick_name || this.index}] 状态异常，无法执行任务`)
            }

        }
    }
    // 增加自动获取文章分类ID
    async getChannels () {
        // Updated By Huansheng1
        try {
            let options = {
                fn: "获取文章频道列表",
                method: "get",
                url: `https://tp.hoolo.tv/h5/tlread/index.html?v=1205`,
                headers: this.get_headers(),
            };
            let { body: result } = await httpRequest(options);
            //测试请求结果：console.log(result);
            if (result.includes('" data-channelid="')) {
                let findChannelIds = extractMiddleText(result, '" data-channelid="', '"', true);
                channelIds = findChannelIds;
                console.log(`账号[${this.nickName || this.nick_name || this.index}] 找到了文章分类共：${findChannelIds?.length}个`);
            } else {
                console.log(`账号[${this.nickName || this.nick_name || this.index}] ❌获取文章分类失败`);
                console.log(JSON.stringify(result));
            }
        } catch (e) {
            console.log(e);
        }
    }
    async getCode () {
        try {
            let options = {
                fn: "获取登录code",
                method: "post",
                url: `https://passport.tmuyun.com/web/oauth/credential_auth`,
                headers: {
                    'Host': 'passport.tmuyun.com',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept-Encoding': 'gzip, deflate, br'
                },
                body: `client_id=10017&password=${encodeURIComponent(this.rsa_encrypt(this.password))}&phone_number=${this.mobile}`
            };
            let { body: result } = await httpRequest(options);
            //console.log(options);
            result = JSON.parse(result);
            //console.log(result);
            if (result.code == 0) {
                this.code = result.data.authorization_code.code
            } else {
                this.valid = false;
            }
        } catch (e) {
            console.log(e);
        }
    }
    async login () {
        try {
            let host_data = `/api/zbtxz/login`
            let REQUEST_ID = this.getUUID();
            let TIMESTAMP = Date.now();
            let s = `${host_data}&&6565886da95d5a47f651317f&&${REQUEST_ID}&&${TIMESTAMP}&&FR*r!isE5W&&59`
            // console.log(s)
            let SIGNATURE = this.SHA256_Encrypt(s)
            let options = {
                fn: "登录",
                method: 'post',
                url: `https://vapp.tmuyun.com/api/zbtxz/login`,
                headers: {
                    'X-SESSION-ID': `6565886da95d5a47f651317f`,
                    'X-REQUEST-ID': REQUEST_ID,
                    'X-TIMESTAMP': TIMESTAMP,
                    'X-SIGNATURE': SIGNATURE,
                    'X-TENANT-ID': `59`,
                    'User-Agent': '1.1.9;00000000-67f7-45bf-ffff-ffffa7397b83;Xiaomi MI 8 Lite;Android;10;Release',
                    'Cache-Control': 'no-cache',
                    Host: 'vapp.tmuyun.com',
                    Connection: 'Keep-Alive',
                },
                body: `check_token=&code=${this.code}&token=&type=-1&union_id=`
            };
            let { body: result } = await httpRequest(options);
            //console.log(options);
            result = JSON.parse(result);
            //console.log(result);
            if (result.code == 0) {
                this.sessionId = result.data.session.id
                this.accountId = result.data.session.account_id
                this.username = result.data.account.nick_name
                this.valid = true;
            } else {
                this.valid = false;
            }
        } catch (e) {
            console.log(e);
        }
    }
    async getUserInfo () {
        try {
            let host_data = `/api/user_mumber/account_detail`
            let REQUEST_ID = this.getUUID();
            let TIMESTAMP = Date.now();
            let s = `${host_data}&&${this.sessionId}&&${REQUEST_ID}&&${TIMESTAMP}&&FR*r!isE5W&&59`
            let SIGNATURE = this.SHA256_Encrypt(s)
            let options = {
                fn: "查询用户信息",
                method: 'get',
                url: `https://vapp.tmuyun.com/api/user_mumber/account_detail`,
                headers: {
                    'X-SESSION-ID': this.sessionId,
                    'X-REQUEST-ID': REQUEST_ID,
                    'X-TIMESTAMP': TIMESTAMP,
                    'X-SIGNATURE': SIGNATURE,
                    'X-TENANT-ID': `59`,
                    'User-Agent': '1.1.9;00000000-67f7-45bf-ffff-ffffa7397b83;Xiaomi MI 8 Lite;Android;10;Release',
                    'Cache-Control': 'no-cache',
                    Host: 'vapp.tmuyun.com',
                    Connection: 'Keep-Alive',
                },
            };
            let { body: result } = await httpRequest(options);
            //console.log(options);
            result = JSON.parse(result);
            if (result.code == 0) {
                this.nickName = result.data?.rst?.nick_name;
                this.valid = true;
            } else {
                console.log(`账号[${this.nickName || this.nick_name || this.index}] ` + '获取用户信息失败：', result);
                this.valid = false;
            }
        } catch (e) {
            console.log(e);
        }
    }
    async user_info () {
        try {
            let options = {
                fn: "信息查询",
                method: "get",
                url: `https://wxapi.hoolo.tv/event/dtqp/index.php?s=/home/TmApi/getUserInformation&accountId=${this.accountId}&username=${encodeURIComponent(this.username)}&type=jsonp`,
                headers: this.get_headers(),
            };
            let { body: result } = await httpRequest(options);
            //console.log(options);
            result = JSON.parse(result);
            //console.log(result);
            if (result.code == 0) {
                this.cnum = Number(result.data.cnum) || 0;
                console.log(`账号[${this.nickName || this.nick_name || this.index}] 查询账号信息成功，绑定的微信id为：${result.data.userid || ''}，可抽奖次数：${this.cnum} 次`);
                this.wxopenId = result.data.userid
            } else {
                console.log(`账号[${this.nickName || this.nick_name || this.index}] ❌[${options.fn}]失败`);
                console.log(JSON.stringify(result));
            }
        } catch (e) {
            console.log(e);
        }
    }
    async read_status (articleId) {
        try {
            let options = {
                fn: "阅读状态",
                method: "get",
                url: `https://wxapi.hoolo.tv/event/dtqp/index.php?s=/home/TmApi/getUserRead&accountId=${this.accountId}&articleId=${articleId}&type=jsonp`,
                headers: this.get_headers(),
            };
            let result = await httpRequest(options);
            try {
                result = result?.body;
                //console.log(options);
                result = JSON.parse(result);
            } catch (error) {
                result = {
                    message: `文章[${articleId}] ` + '阅读状态异常'
                };
            }
            //console.log(result);
            if (result?.read_effective == 1) {
                this.artReadStatus = true;
                await this.read_task(articleId)
            } else if (result.read_effective == 0) {
                this.artReadStatus = false;
            } else {
                console.log(`账号[${this.nickName || this.nick_name || this.index}] ❌[${options.fn}]失败`);
                console.log(JSON.stringify(result));
            }
        } catch (e) {
            console.log(e);
        }
    }
    async read_task (articleId) {
        try {
            let options = {
                fn: "阅读执行",
                method: "get",
                url: `https://wxapi.hoolo.tv/event/dtqp/index.php?s=home/baoming/postBaoming/&activityId=428&name=${this.accountId}&city=${articleId}&gender=1&cellphone=${this.mobile}&type=jsonp`,
                headers: this.get_headers(),
            };
            let { body: result } = await httpRequest(options);
            //console.log(options);
            result = JSON.parse(result);
            //console.log(result);
            if (result.code == 0) {
                $.log(`账号[${this.nickName || this.nick_name || this.index}] ✅阅读回调成功🎉`);
            } else {
                console.log(`账号[${this.nickName || this.nick_name || this.index}] ❌[${options.fn}]失败`);
                console.log(JSON.stringify(result));
            }
        } catch (e) {
            console.log(e);
        }
    }

    async lottery_num () {
        try {
            let options = {
                fn: "抽奖查询",
                method: "get",
                url: `https://wxapi.hoolo.tv/event/dtqp/index.php?s=/home/TmApi/addPrizenum&accountId=${this.accountId}&round=1&num=${this.num}&type=jsonp`,
                headers: this.get_headers(),
            };
            let { body: result } = await httpRequest(options);
            try {
                result = JSON.parse(result);
            } catch (error) {

            }
            //console.log(options);
            //result = JSON.parse(result);
            // console.log(result);
            if (result.code == "0") {
                //console.log(`✅账号[${this.index}]  欢迎用户: ${result.errcode}🎉`);
                $.log(`账号[${this.nickName || this.nick_name || this.index}] ✅可以抽奖咯！🎉`);
                await this.lottery_task();
            } else {
                console.log(`账号[${this.nickName || this.nick_name || this.index}] ❌[${options.fn}]失败`);
                console.log(JSON.stringify(result));
            }
        } catch (e) {
            console.log(e);
        }
    }

    async lottery_task () {
        let expando = "jQuery" + ("1.7.1" + Math.random()).replace(/\D/g, "");
        let time1 = new Date().getTime();
        let time2 = new Date().getTime();
        try {
            let options = {
                fn: "开始抽奖",
                method: "get",
                url: `https://wxapi.hoolo.tv/event/dtqp/index.php?s=/Home/ChoujiangNew/apiChoujiang&callback=${expando}_${time1}&openId=${this.accountId}&action=cj&typeId=122&address=&userid=${this.wxopenId}&_=${time2}`,
                headers: this.get_headers(),
            };
            let { body: result } = await httpRequest(options);
            //console.log(options);
            //result = JSON.parse(result);
            try {
                result = result.replace(`${expando}_${time1}`, "")
                result = result.replace(`(`, "")
                result = result.replace(`)`, "")
                result = JSON.parse(result)
                console.log(`${result?.msg?.includes('红包') ? '✅ ' : '❌ '}账号[${this.nickName || this.nick_name || this.index}] ${result?.msg?.includes('红包') ? '恭喜中奖，' : ' '}`, result?.msg)
            } catch (error) {
                console.log(`🔔 账号[${this.nickName || this.nick_name || this.index}] 抽奖结果：`, result)
            }
        } catch (e) {
            console.log(e);
        }
    }
    //

    async art_list () {
        try {
            let options = {
                fn: "文章列表",
                method: "get",
                url: `https://wxapi.hoolo.tv/event/dtqp/index.php?s=/home/TmApi/channelList&channelId=${this.channelId}&userId=${this.accountId}&sessionId=${this.sessionId}`,
                headers: this.get_headers(),
            };
            let { body: result } = await httpRequest(options);
            //console.log(options);
            try {
                result = JSON.parse(result);
            } catch (error) {

            }
            for (let art of result) {
                //console.log(art.id)
                // if (!art.mark_read) {
                this.artList.push(art)
                // }
            }
            console.log(`账号[${this.nickName || this.nick_name || this.index}] 获取到了 主题为 ${this.channelId} 的 ${result?.length || 0} 个文章，可阅读的文章数 ${this.artList.length} 个`);

        } catch (e) {
            console.log(e);
        }
    }
    getUUID () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    SHA256_Encrypt (str) {
        const crypto = require('crypto');
        return crypto.createHash("sha256").update(str).digest('hex');
    }
    async do_read (articleId) {
        let host_data = `/api/article/detail`
        let REQUEST_ID = this.getUUID();
        let TIMESTAMP = Date.now();
        let s = `${host_data}&&${this.sessionId}&&${REQUEST_ID}&&${TIMESTAMP}&&FR*r!isE5W&&59`
        let SIGNATURE = this.SHA256_Encrypt(s)
        let options = {
            fn: "阅读文章",
            method: 'get',
            url: `https://vapp.tmuyun.com/api/article/detail?id=${articleId}`,
            headers: {
                'X-SESSION-ID': `${this.sessionId}`,
                'X-REQUEST-ID': REQUEST_ID,
                'X-TIMESTAMP': TIMESTAMP,
                'X-SIGNATURE': SIGNATURE,
                'X-TENANT-ID': `59`,
                'User-Agent': '1.1.9;00000000-67f7-45bf-ffff-ffffa7397b83;Xiaomi MI 8 Lite;Android;10;Release',
                'Cache-Control': 'no-cache',
                Host: 'vapp.tmuyun.com',
                Connection: 'Keep-Alive',
            }
        };
        try {

            let { body: result } = await httpRequest(options);
            //console.log(options);
            result = JSON.parse(result);
            //console.log(result);
            if (result.code == "0") {
                $.log(`账号[${this.nickName || this.nick_name || this.index}] 阅读成功`)
            }

        } catch (e) {
            console.log(e);
        }
    }
    rsa_encrypt (data) {
        //创建RSA加密对象
        global["window"] = {}
        const JSEncrypt = require("jsencrypt")
        var encrypt = new JSEncrypt();
        //设置公钥
        var publicKey = "-----BEGIN PUBLIC KEY-----\n" +
            "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQD6XO7e9YeAOs+cFqwa7ETJ+WXizPqQeXv68i5vqw9pFREsrqiBTRcg7wB0RIp3rJkDpaeVJLsZqYm5TW7FWx/iOiXFc+zCPvaKZric2dXCw27EvlH5rq+zwIPDAJHGAfnn1nmQH7wR3PCatEIb8pz5GFlTHMlluw4ZYmnOwg+thwIDAQAB\n" +
            "-----END PUBLIC KEY-----";
        encrypt.setPublicKey(publicKey);

        //使用公钥进行加密
        return encrypt.encrypt(data);
    }
    get_headers () {
        return {
            // 'Host': 'wxapi.hoolo.tv',
            'Accept': 'application/json, text/javascript, /; q=0.01',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; MI 8 Lite Build/QKQ1.190910.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.138 Mobile Safari/537.36;xsb_xiaosatonglu;xsb_xiaosatonglu;1.0.60;native_app;6.5.1',
            'Origin': 'https://tp.hoolo.tv',
            'X-Requested-With': 'com.chinamcloud.wangjie.b87d8fb20e29a0328c6e21045e8b500e',
            'Sec-Fetch-Site': 'same-site',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Referer': 'https://tp.hoolo.tv/h5/tlread/index.html',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7'
        }

    }
}

async function start () {
    let taskall = [];
    if (userList?.length && !channelIds?.length) {
        await userList[0].getChannels()
    }
    let processNum = 5;
    for (let user of userList) {
        if (taskall.length && !(taskall.length % processNum)) {
            await Promise.all(taskall);
            taskall = [];
        }
        if (user.ckStatus) {
            taskall.push(user.main());
        }
    }
    await Promise.all(taskall);
}

!(async () => {
    if (!(await checkEnv())) return;
    if (userList.length > 0) {
        await start();
    }
    await SendMsg($.logs.join("\n"));
})()
    .catch((e) => console.log(e))
    .finally(() => $.done());

//********************************************************
/**
 * 变量检查与处理
 * @returns
 */
async function checkEnv () {
    let userCookie = ($.isNode() ? process.env[ckName] : $.getdata(ckName)) || "";
    // let userCookie = "19237484159&12643808";
    if (userCookie) {
        let e = envSplitor[0];
        for (let o of envSplitor)
            if (userCookie.indexOf(o) > -1) {
                e = o;
                break;
            }
        for (let n of userCookie.split(e)) n && userList.push(new UserInfo(n));
    } else {
        console.log("未找到CK");
        return;
    }
    return console.log(`共找到${userList.length}个账号`), true; //true == !0
}

/////////////////////////////////////////////////////////////////////////////////////
function httpRequest (options) {
    if (!options["method"]) {
        return console.log(`请求方法不存在`);
    }
    if (!options["fn"]) {
        console.log(`函数名不存在`);
    }
    return new Promise((resolve) => {
        $[options.method](options, (err, resp, data) => {
            try {
                if (err) {
                    $.logErr(err);
                } else {
                    try {
                        resp = JSON.parse(resp);
                    } catch (error) { }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve(resp);
            }
        });
    });
}
async function SendMsg (message) {
    if (!message) return;
    if ($.isNode()) {
        await notify.sendNotify($.name, message);
    } else {
        $.msg($.name, "", message);
    }
}
// prettier-ignore
function Env (t, s) { return new (class { constructor(t, s) { (this.name = t), (this.data = null), (this.dataFile = "box.dat"), (this.logs = []), (this.logSeparator = "\n"), (this.startTime = new Date().getTime()), Object.assign(this, s), this.log("", `\ud83d\udd14${this.name},\u5f00\u59cb!`) } isNode () { return "undefined" != typeof module && !!module.exports } isQuanX () { return "undefined" != typeof $task } isSurge () { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon () { return "undefined" != typeof $loon } getScript (t) { return new Promise((s) => { this.get({ url: t }, (t, e, i) => s(i)) }) } runScript (t, s) { return new Promise((e) => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let o = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); (o = o ? 1 * o : 20), (o = s && s.timeout ? s.timeout : o); const [h, a] = i.split("@"), r = { url: `http://${a}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: o }, headers: { "X-Key": h, Accept: "*/*" }, }; this.post(r, (t, s, i) => e(i)) }).catch((t) => this.logErr(t)) } loaddata () { if (!this.isNode()) return {}; { (this.fs = this.fs ? this.fs : require("fs")), (this.path = this.path ? this.path : require("path")); const t = this.path.resolve(this.dataFile), s = this.path.resolve(process.cwd(), this.dataFile), e = this.fs.existsSync(t), i = !e && this.fs.existsSync(s); if (!e && !i) return {}; { const i = e ? t : s; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata () { if (this.isNode()) { (this.fs = this.fs ? this.fs : require("fs")), (this.path = this.path ? this.path : require("path")); const t = this.path.resolve(this.dataFile), s = this.path.resolve(process.cwd(), this.dataFile), e = this.fs.existsSync(t), i = !e && this.fs.existsSync(s), o = JSON.stringify(this.data); e ? this.fs.writeFileSync(t, o) : i ? this.fs.writeFileSync(s, o) : this.fs.writeFileSync(t, o) } } lodash_get (t, s, e) { const i = s.replace(/\[(\d+)\]/g, ".$1").split("."); let o = t; for (const t of i) if (((o = Object(o)[t]), void 0 === o)) return e; return o } lodash_set (t, s, e) { return Object(t) !== t ? t : (Array.isArray(s) || (s = s.toString().match(/[^.[\]]+/g) || []), (s.slice(0, -1).reduce((t, e, i) => Object(t[e]) === t[e] ? t[e] : (t[e] = Math.abs(s[i + 1]) >> 0 == +s[i + 1] ? [] : {}), t)[s[s.length - 1]] = e), t) } getdata (t) { let s = this.getval(t); if (/^@/.test(t)) { const [, e, i] = /^@(.*?)\.(.*?)$/.exec(t), o = e ? this.getval(e) : ""; if (o) try { const t = JSON.parse(o); s = t ? this.lodash_get(t, i, "") : s } catch (t) { s = "" } } return s } setdata (t, s) { let e = !1; if (/^@/.test(s)) { const [, i, o] = /^@(.*?)\.(.*?)$/.exec(s), h = this.getval(i), a = i ? ("null" === h ? null : h || "{}") : "{}"; try { const s = JSON.parse(a); this.lodash_set(s, o, t), (e = this.setval(JSON.stringify(s), i)) } catch (s) { const h = {}; this.lodash_set(h, o, t), (e = this.setval(JSON.stringify(h), i)) } } else e = this.setval(t, s); return e } getval (t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? ((this.data = this.loaddata()), this.data[t]) : (this.data && this.data[t]) || null } setval (t, s) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, s) : this.isQuanX() ? $prefs.setValueForKey(t, s) : this.isNode() ? ((this.data = this.loaddata()), (this.data[s] = t), this.writedata(), !0) : (this.data && this.data[s]) || null } initGotEnv (t) { (this.got = this.got ? this.got : require("got")), (this.cktough = this.cktough ? this.cktough : require("tough-cookie")), (this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar()), t && ((t.headers = t.headers ? t.headers : {}), void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get (t, s = () => { }) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? $httpClient.get(t, (t, e, i) => { !t && e && ((e.body = i), (e.statusCode = e.status)), s(t, e, i) }) : this.isQuanX() ? $task.fetch(t).then((t) => { const { statusCode: e, statusCode: i, headers: o, body: h } = t; s(null, { status: e, statusCode: i, headers: o, body: h }, h) }, (t) => s(t)) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, s) => { try { const e = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); this.ckjar.setCookieSync(e, null), (s.cookieJar = this.ckjar) } catch (t) { this.logErr(t) } }).then((t) => { const { statusCode: e, statusCode: i, headers: o, body: h, } = t; s(null, { status: e, statusCode: i, headers: o, body: h }, h) }, (t) => s(t))) } post (t, s = () => { }) { if ((t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), delete t.headers["Content-Length"], this.isSurge() || this.isLoon())) $httpClient.post(t, (t, e, i) => { !t && e && ((e.body = i), (e.statusCode = e.status)), s(t, e, i) }); else if (this.isQuanX()) (t.method = "POST"), $task.fetch(t).then((t) => { const { statusCode: e, statusCode: i, headers: o, body: h } = t; s(null, { status: e, statusCode: i, headers: o, body: h }, h) }, (t) => s(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: e, ...i } = t; this.got.post(e, i).then((t) => { const { statusCode: e, statusCode: i, headers: o, body: h } = t; s(null, { status: e, statusCode: i, headers: o, body: h }, h) }, (t) => s(t)) } } time (t) { let s = { "M+": new Date().getMonth() + 1, "d+": new Date().getDate(), "H+": new Date().getHours(), "m+": new Date().getMinutes(), "s+": new Date().getSeconds(), "q+": Math.floor((new Date().getMonth() + 3) / 3), S: new Date().getMilliseconds(), }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (new Date().getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in s) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? s[e] : ("00" + s[e]).substr(("" + s[e]).length))); return t } msg (s = t, e = "", i = "", o) { const h = (t) => !t || (!this.isLoon() && this.isSurge()) ? t : "string" == typeof t ? this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : void 0 : "object" == typeof t && (t["open-url"] || t["media-url"]) ? this.isLoon() ? t["open-url"] : this.isQuanX() ? t : void 0 : void 0; this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(s, e, i, h(o)) : this.isQuanX() && $notify(s, e, i, h(o))); let logs = ['', '==============📣系统通知📣==============']; logs.push(t); e ? logs.push(e) : ''; i ? logs.push(i) : ''; console.log(logs.join('\n')); this.logs = this.logs.concat(logs) } log (...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr (t, s) { const e = !this.isSurge() && !this.isQuanX() && !this.isLoon(); e ? this.log("", `\u2757\ufe0f${this.name},\u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name},\u9519\u8bef!`, t) } wait (t) { return new Promise((s) => setTimeout(s, t)) } done (t = {}) { const s = new Date().getTime(), e = (s - this.startTime) / 1e3; this.log("", `\ud83d\udd14${this.name},\u7ed3\u675f!\ud83d\udd5b ${e}\u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } })(t, s) }
