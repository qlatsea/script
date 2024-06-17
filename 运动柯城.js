/*
软件名:运动柯城
完成每日任务，一天55积分左右，可以兑换实物，外地正常发货
变量名:ydkcck
手机号注册登录软件后，设置登陆密码，将手机号#密码填入变量，多账号换行隔开
定时:每天一到二次
*/
NAME = "运动柯城";
VALY = ["ydkcck"];
CK = "";
LOGS = 0;
channel = ["5d60be1db1985030db8625f2", "5d60bf44b1985030db8625f4", "63490a34fe3fc1680f581e1f", "6229a95cad61a429c691c707", "5d60bdf21b011b2a0fbb9c4a"];
sq = 1;

const fs = require("fs");
dcfhost = process.env.dcfhost;

class Bar {
  constructor(_0x410a5f) {
    this.rsakey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQD6XO7e9YeAOs+cFqwa7ETJ+WXizPqQeXv68i5vqw9pFREsrqiBTRcg7wB0RIp3rJkDpaeVJLsZqYm5TW7FWx/iOiXFc+zCPvaKZric2dXCw27EvlH5rq+zwIPDAJHGAfnn1nmQH7wR3PCatEIb8pz5GFlTHMlluw4ZYmnOwg+thwIDAQAB";
    this.phone = _0x410a5f.split("#")[0];
    this.password = encodeURIComponent($.RSA(_0x410a5f.split("#")[1], this.rsakey));
    this.ts = $.time(13);
    this.reid = $.udid(1);
    this.channelid = $.randomArr(channel);
    this.rsakey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQD6XO7e9YeAOs+cFqwa7ETJ+WXizPqQeXv68i5vqw9pFREsrqiBTRcg7wB0RIp3rJkDpaeVJLsZqYm5TW7FWx/iOiXFc+zCPvaKZric2dXCw27EvlH5rq+zwIPDAJHGAfnn1nmQH7wR3PCatEIb8pz5GFlTHMlluw4ZYmnOwg+thwIDAQAB";
    this.logs = true;
  }

  async login() {
    let _0x76db4a = "client_id=42&password=" + this.password + "&phone_number=" + this.phone,
        _0x2d23dd = await $.task("post", "https://passport.tmuyun.com/web/oauth/credential_auth", {}, _0x76db4a);

    _0x2d23dd.code == 0 ? (this.code = _0x2d23dd.data.authorization_code.code, console.log("【" + this.phone + "】登录成功"), this.logs = true, await this.gettoken()) : this.logs = false;
  }

  async gettoken() {
    let _0x2dc685 = $.SHA_Encrypt(1, "SHA256", "/api/zbtxz/login&&63fecca75057613538d94d82&&" + this.reid + "&&" + this.ts + "&&FR*r!isE5W&&29"),
        _0x3d0beb = {
      "X-SESSION-ID": "63fecca75057613538d94d82",
      "X-REQUEST-ID": this.reid,
      "X-TIMESTAMP": this.ts,
      "X-SIGNATURE": _0x2dc685,
      "X-TENANT-ID": 29,
      "User-Agent": "1.2.0;" + this.reid + ";Xiaomi M2011K2C;Android;11;Release"
    },
        _0x2430d8 = "code=" + this.code + "&token=&type=-1&union_id=",
        _0x36b498 = await $.task("post", "https://vapp.tmuyun.com/api/zbtxz/login", _0x3d0beb, _0x2430d8);

    this.sessionid = _0x36b498.data.session.id;
    this.name = _0x36b498.data.account.nick_name;
  }

  async tasklist() {
    let _0x360c4c = $.SHA_Encrypt(1, "SHA256", "/api/user_mumber/numberCenter&&" + this.sessionid + "&&" + this.reid + "&&" + this.ts + "&&FR*r!isE5W&&29"),
        _0x3ee160 = {
      "X-SESSION-ID": this.sessionid,
      "X-REQUEST-ID": this.reid,
      "X-TIMESTAMP": this.ts,
      "X-SIGNATURE": _0x360c4c,
      "X-TENANT-ID": 29,
      "User-Agent": "1.2.0;" + this.reid + ";Xiaomi M2011K2C;Android;11;Release"
    },
        _0x1c4a81 = await $.task("get", "https://vapp.tmuyun.com/api/user_mumber/numberCenter?is_new=1", _0x3ee160);

    if (_0x1c4a81.code == 0) {
      console.log("【" + this.name + "】==>现有积分" + _0x1c4a81.data.rst.total_integral);

      for (let _0x41a5b4 of _0x1c4a81.data.rst.user_task_list) {
        if (_0x41a5b4.name == "分享资讯给好友" && _0x41a5b4.completed == 0) {
          for (let _0x3eac9d = _0x41a5b4.finish_times; _0x3eac9d < _0x41a5b4.frequency; _0x3eac9d++) {
            await this.share();
          }
        }

        if (_0x41a5b4.name == "新闻资讯评论" && _0x41a5b4.completed == 0) {
          for (let _0x4bbb5c = _0x41a5b4.finish_times; _0x4bbb5c < _0x41a5b4.frequency; _0x4bbb5c++) {
            await this.dailyoneword();
            await this.comment();
          }
        }

        if (_0x41a5b4.name == "新闻资讯阅读" && _0x41a5b4.completed == 0) {
          for (let _0x4f3f67 = _0x41a5b4.finish_times; _0x4f3f67 < _0x41a5b4.frequency; _0x4f3f67++) {
            await this.read();
          }
        }

        _0x41a5b4.name == "使用本地服务" && _0x41a5b4.completed == 0 && (await this.local());

        if (_0x41a5b4.name == "新闻资讯点赞" && _0x41a5b4.completed == 0) {
          for (let _0x178408 = _0x41a5b4.finish_times; _0x178408 < _0x41a5b4.frequency; _0x178408++) {
            await this.like();
          }
        }

        if (_0x41a5b4.name == "社区帖子分享" && _0x41a5b4.completed == 0) {
          for (let _0x4e2cea = _0x41a5b4.finish_times; _0x4e2cea < _0x41a5b4.frequency; _0x4e2cea++) {
            await this.sharesq();
          }
        }

        _0x41a5b4.name == "社区帖子点赞" && _0x41a5b4.completed == 0 && (await this.likesq());
        sq == 1 && _0x41a5b4.name == "社区帖子发布" && _0x41a5b4.completed == 0 && (await this.sqft());
      }

      for (let _0x132b35 of _0x1c4a81.data.daily_sign_info.daily_sign_list) {
        _0x132b35.current == "今天" && _0x132b35.signed == false && (await this.signin());
      }
    } else {
      console.log("【" + this.name + "】获取任务列表失败，请稍后再试");
    }
  }

  async share() {
    let _0x5ba428 = this.ii[$.RT(0, 29)].id,
        _0x2263d4 = $.SHA_Encrypt(1, "SHA256", "/api/user_mumber/doTask&&" + this.sessionid + "&&" + this.reid + "&&" + this.ts + "&&FR*r!isE5W&&29"),
        _0x3f3402 = {
      "X-SESSION-ID": this.sessionid,
      "X-REQUEST-ID": this.reid,
      "X-TIMESTAMP": this.ts,
      "X-SIGNATURE": _0x2263d4,
      "X-TENANT-ID": 29,
      "User-Agent": "1.2.0;" + this.reid + ";Xiaomi M2011K2C;Android;11;Release"
    },
        _0x15281f = "memberType=3&member_type=3&target_id=" + _0x5ba428,
        _0x3e108a = await $.task("post", "https://vapp.tmuyun.com/api/user_mumber/doTask", _0x3f3402, _0x15281f);

    _0x3e108a.code == 0 ? (console.log("【" + this.name + "】 分享资讯成功"), await $.wait(10000, 20000)) : console.log("【" + this.name + "】 分享资讯失败");
  }

  async list() {
    let _0x50087c = $.SHA_Encrypt(1, "SHA256", "/api/article/channel_list&&" + this.sessionid + "&&" + this.reid + "&&" + this.ts + "&&FR*r!isE5W&&29"),
        _0x218bf4 = {
      "X-SESSION-ID": this.sessionid,
      "X-REQUEST-ID": this.reid,
      "X-TIMESTAMP": this.ts,
      "X-SIGNATURE": _0x50087c,
      "X-TENANT-ID": 29,
      "User-Agent": "1.2.0;" + this.reid + ";Xiaomi M2011K2C;Android;11;Release"
    },
        _0x5a88b9 = await $.task("get", "https://vapp.tmuyun.com/api/article/channel_list?channel_id=" + this.channelid + "&isDiFangHao=false&is_new=true&list_count=0&size=30", _0x218bf4);

    this.ii = _0x5a88b9.data.article_list;
  }

  async dailyoneword() {
    let _0x20fe9a = await $.task("get", "https://v1.jinrishici.com/all.json", {});

    this.word = _0x20fe9a.content;
  }

  async comment() {
    let _0x761845 = this.ii[$.RT(0, 29)].id,
        _0x38691b = $.SHA_Encrypt(1, "SHA256", "/api/comment/create&&" + this.sessionid + "&&" + this.reid + "&&" + this.ts + "&&FR*r!isE5W&&29"),
        _0x3280f7 = {
      "X-SESSION-ID": this.sessionid,
      "X-REQUEST-ID": this.reid,
      "X-TIMESTAMP": this.ts,
      "X-SIGNATURE": _0x38691b,
      "X-TENANT-ID": 29,
      "User-Agent": "1.2.0;" + this.reid + ";Xiaomi M2011K2C;Android;11;Release"
    },
        _0x498436 = "channel_article_id=" + _0x761845 + "&content=" + encodeURIComponent(this.word),
        _0x3ce4d4 = await $.task("post", "https://vapp.tmuyun.com/api/comment/create", _0x3280f7, _0x498436);

    _0x3ce4d4.code == 0 ? (console.log("【" + this.name + "】 评论资讯成功"), await $.wait(10000, 20000)) : console.log("【" + this.name + "】 评论资讯失败");
  }

  async read() {
    let _0x465f20 = this.ii[$.RT(0, 29)].id,
        _0xe4410e = $.SHA_Encrypt(1, "SHA256", "/api/article/detail&&" + this.sessionid + "&&" + this.reid + "&&" + this.ts + "&&FR*r!isE5W&&29"),
        _0x3236dc = {
      "X-SESSION-ID": this.sessionid,
      "X-REQUEST-ID": this.reid,
      "X-TIMESTAMP": this.ts,
      "X-SIGNATURE": _0xe4410e,
      "X-TENANT-ID": 29,
      "User-Agent": "1.2.0;" + this.reid + ";Xiaomi M2011K2C;Android;11;Release"
    },
        _0x1a75a5 = await $.task("get", "https://vapp.tmuyun.com/api/article/detail?id=" + _0x465f20, _0x3236dc);

    _0x1a75a5.code == 0 ? (console.log("【" + this.name + "】 阅读文章成功"), await $.wait(10000, 20000)) : console.log("【" + this.name + "】 阅读文章失败");
  }

  async like() {
    let _0x563ba2 = this.ii[$.RT(0, 29)].id,
        _0x2de5cd = $.SHA_Encrypt(1, "SHA256", "/api/favorite/like&&" + this.sessionid + "&&" + this.reid + "&&" + this.ts + "&&FR*r!isE5W&&29"),
        _0x5a7eed = {
      "X-SESSION-ID": this.sessionid,
      "X-REQUEST-ID": this.reid,
      "X-TIMESTAMP": this.ts,
      "X-SIGNATURE": _0x2de5cd,
      "X-TENANT-ID": 29,
      "User-Agent": "1.2.0;" + this.reid + ";Xiaomi M2011K2C;Android;11;Release"
    },
        _0x42ff03 = "action=true&id=" + _0x563ba2,
        _0x38eeaa = await $.task("post", "https://vapp.tmuyun.com/api/favorite/like", _0x5a7eed, _0x42ff03);

    _0x38eeaa.code == 0 ? (console.log("【" + this.name + "】 资讯点赞成功"), await $.wait(10000, 20000)) : console.log("【" + this.name + "】 资讯点赞失败");
  }

  async signin() {
    let _0x3ba8a1 = $.SHA_Encrypt(1, "SHA256", "/api/user_mumber/sign&&" + this.sessionid + "&&" + this.reid + "&&" + this.ts + "&&FR*r!isE5W&&29"),
        _0x1194c1 = {
      "X-SESSION-ID": this.sessionid,
      "X-REQUEST-ID": this.reid,
      "X-TIMESTAMP": this.ts,
      "X-SIGNATURE": _0x3ba8a1,
      "X-TENANT-ID": 29,
      "User-Agent": "1.2.0;" + this.reid + ";Xiaomi M2011K2C;Android;11;Release"
    },
        _0x17e978 = await $.task("get", "https://vapp.tmuyun.com/api/user_mumber/sign", _0x1194c1);

    _0x17e978.code == 0 ? console.log("【" + this.name + "】 签到成功") : console.log("【" + this.name + "】 签到失败");
  }

  async local() {
    let _0x17dcd4 = $.SHA_Encrypt(1, "SHA256", "/api/user_mumber/doTask&&" + this.sessionid + "&&" + this.reid + "&&" + this.ts + "&&FR*r!isE5W&&29"),
        _0x48b26d = {
      "X-SESSION-ID": this.sessionid,
      "X-REQUEST-ID": this.reid,
      "X-TIMESTAMP": this.ts,
      "X-SIGNATURE": _0x17dcd4,
      "X-TENANT-ID": 29,
      "User-Agent": "1.2.0;" + this.reid + ";Xiaomi M2011K2C;Android;11;Release"
    },
        _0x392904 = "memberType=6&member_type=6",
        _0x1244b2 = await $.task("post", "https://vapp.tmuyun.com/api/user_mumber/doTask", _0x48b26d, _0x392904);

    _0x1244b2.code == 0 ? (console.log("【" + this.name + "】 使用本地服务成功"), await $.wait(10000, 20000)) : console.log("【" + this.name + "】 使用本地服务失败");
  }

  async sqlist() {
    let _0x559aff = $.SHA_Encrypt(1, "SHA256", "/api/article/thread_list&&" + this.sessionid + "&&" + this.reid + "&&" + this.ts + "&&FR*r!isE5W&&29"),
        _0x5c5941 = {
      "X-SESSION-ID": this.sessionid,
      "X-REQUEST-ID": this.reid,
      "X-TIMESTAMP": this.ts,
      "X-SIGNATURE": _0x559aff,
      "X-TENANT-ID": 29,
      "User-Agent": "1.2.0;" + this.reid + ";Xiaomi M2011K2C;Android;11;Release"
    },
        _0x3d11cd = await $.task("get", "https://vapp.tmuyun.com/api/forum/thread_list?forum_id=239", _0x5c5941);

    this.sqi = _0x3d11cd.data.thread_list;
    this.sqid = this.sqi[$.RT(0, 6)].id;
  }

  async sharesq() {
    let _0x30ec4c = this.sqi[$.RT(0, 6)].id,
        _0x34a699 = $.SHA_Encrypt(1, "SHA256", "/api/user_mumber/doTask&&" + this.sessionid + "&&" + this.reid + "&&" + this.ts + "&&FR*r!isE5W&&29"),
        _0x108a08 = {
      "X-SESSION-ID": this.sessionid,
      "X-REQUEST-ID": this.reid,
      "X-TIMESTAMP": this.ts,
      "X-SIGNATURE": _0x34a699,
      "X-TENANT-ID": 29,
      "User-Agent": "1.2.0;" + this.reid + ";Xiaomi M2011K2C;Android;11;Release"
    },
        _0xfe5220 = await $.task("post", "https://vapp.tmuyun.com/api/user_mumber/doTask?member_type=14&target_id=" + _0x30ec4c, _0x108a08);

    _0xfe5220.code == 0 ? (console.log("【" + this.name + "】 分享社区文章成功"), await $.wait(10000, 20000)) : console.log("【" + this.name + "】 分享社区文章失败");
  }

  async likesq() {
    let _0x1b5e13 = $.SHA_Encrypt(1, "SHA256", "/api/forum/like&&" + this.sessionid + "&&" + this.reid + "&&" + this.ts + "&&FR*r!isE5W&&29"),
        _0x1dd8c7 = {
      method: "post",
      url: "https://vapp.tmuyun.com/api/forum/like",
      headers: {
        "X-SESSION-ID": this.sessionid,
        "X-REQUEST-ID": this.reid,
        "X-TIMESTAMP": this.ts,
        "X-SIGNATURE": _0x1b5e13,
        "X-TENANT-ID": 29,
        "User-Agent": "1.2.0;" + this.reid + ";Xiaomi M2011K2C;Android;11;Release"
      },
      formData: {
        target_type: "1",
        target_id: "" + this.sqid
      }
    },
        _0x32ef3e = await $.httpRequest(_0x1dd8c7);

    if (_0x32ef3e.code == 0) {
      console.log("【" + this.name + "】社区文章点赞成功");
      await $.wait(10000, 20000);
    } else {
      console.log("【" + this.name + "】社区文章点赞失败");
    }
  }

  async dailyoneword() {
    let _0x1aec4d = await $.task("get", "https://v1.jinrishici.com/all.json", {});

    this.word = _0x1aec4d.content;
  }

  async wyy() {
    let _0x55243f = await $.task("get", "https://v1.hitokoto.cn", {});

    this.wyyword = _0x55243f.hitokoto;
  }

  async sqft() {
    await this.dailyoneword();

    let _0x3bd61f = $.SHA_Encrypt(1, "SHA256", "/api/forum/post_thread&&" + this.sessionid + "&&" + this.reid + "&&" + this.ts + "&&FR*r!isE5W&&29"),
        _0x2d9508 = {
      method: "post",
      url: "https://vapp.tmuyun.com/api/forum/post_thread",
      headers: {
        "X-SESSION-ID": this.sessionid,
        "X-REQUEST-ID": this.reid,
        "X-TIMESTAMP": this.ts,
        "X-SIGNATURE": _0x3bd61f,
        "X-TENANT-ID": 29,
        "User-Agent": "1.2.0;" + this.reid + ";Xiaomi M2011K2C;Android;11;Release"
      },
      formData: {
        forum_id: "239",
        title: "每日打卡",
        content: "" + this.word,
        attachments: "",
        location_name: "{}"
      }
    },
        _0x5df2d5 = await $.httpRequest(_0x2d9508);

    if (_0x5df2d5.code == 0) {
      console.log("【" + this.name + "】社区发帖成功");
      await $.wait(10000, 20000);
    } else {
      console.log("【" + this.name + "】社区发帖失败");
    }
  }

}

$ = DD();
!(async () => {
  console.log(NAME);
    await $.ExamineCookie();
      await $.Multithreading("login");
      let _0x57a1a8 = $.cookie_list.filter(_0x28a28c => _0x28a28c.logs == true);
      if (_0x57a1a8.length == 0) {
        console.log("Cookie格式错误 或 账号被禁封");
        return;
      } else {
        await $.Multithreading("list");
        await $.Multithreading("sqlist");
        await $.Multithreading("tasklist");
      }
  
})().catch(_0x1b66e5 => {
  console.log(_0x1b66e5);
}).finally(() => {});

function DD() {
  return new class {
    constructor() {
      this.cookie_list = [];
      this.CryptoJS = require("crypto-js");
      this.NodeRSA = require("node-rsa");
      this.request = require("request");
      this.Sha_Rsa = require("jsrsasign");
    }

    async Multithreading(_0x1952e9, _0x5d9948, _0x4b130f) {
      let _0x519eff = [];
      !_0x4b130f && (_0x4b130f = 1);

      while (_0x4b130f--) {
        for (let _0x2fcfed of $.cookie_list) {
          _0x519eff.push(_0x2fcfed[_0x1952e9](_0x5d9948));
        }
      }

      await Promise.allSettled(_0x519eff);
    }

    ExamineCookie() {
      let _0x4f3cc2 = process.env[VALY] || CK,
          _0x529210 = 0;

      if (_0x4f3cc2) {
        for (let _0x25ac6a of _0x4f3cc2.split("\n").filter(_0x25d629 => !!_0x25d629)) {
          $.cookie_list.push(new Bar(_0x25ac6a));
        }

        _0x529210 = $.cookie_list.length;
      } else {
        console.log("\n【" + NAME + "】：未填写变量: " + VALY);
      }

      console.log("共找到" + _0x529210 + "个账号");
      return $.cookie_list;
    }

    task(_0x55d102, _0x55b7ea, _0x162747, _0x50e413, _0xadbe09) {
      if (_0x55d102 == "delete") {
        _0x55d102 = _0x55d102.toUpperCase();
      } else {
        _0x55d102 = _0x55d102;
      }

      if (_0x55d102 == "post") {
        delete _0x162747["content-type"];
        delete _0x162747["Content-type"];
        delete _0x162747["content-Type"];
        $.safeGet(_0x50e413) ? _0x162747["Content-Type"] = "application/json;charset=UTF-8" : _0x162747["Content-Type"] = "application/x-www-form-urlencoded";
        _0x50e413 && (_0x162747["Content-Length"] = $.lengthInUtf8Bytes(_0x50e413));
      }

      _0x55d102 == "get" && (delete _0x162747["content-type"], delete _0x162747["Content-type"], delete _0x162747["content-Type"], delete _0x162747["Content-Length"]);
      _0x162747.Host = _0x55b7ea.replace("//", "/").split("/")[1];
      return new Promise(async _0x1b7cc8 => {
        if (_0x55d102.indexOf("T") < 0) {
          var _0xddb80b = {
            url: _0x55b7ea,
            headers: _0x162747,
            body: _0x50e413
          };
        } else {
          var _0xddb80b = {
            url: _0x55b7ea,
            headers: _0x162747,
            form: JSON.parse(_0x50e413)
          };
        }

        this.request[_0x55d102.toLowerCase()](_0xddb80b, (_0x1faaea, _0x5c444f, _0xebb2f4) => {
          try {
            _0xebb2f4 && LOGS == 1 && (console.log("================ 请求 ================"), console.log(_0xddb80b), console.log("================ 返回 ================"), $.safeGet(_0xebb2f4) ? console.log(JSON.parse(_0xebb2f4)) : console.log(_0xebb2f4));
          } catch (_0x49a874) {
            console.log(_0x49a874, _0x55b7ea + "\n" + _0x162747);
          } finally {
            let _0x4faea3 = "";

            if (!_0x1faaea) {
              if ($.safeGet(_0xebb2f4)) {
                _0x4faea3 = JSON.parse(_0xebb2f4);
              } else {
                _0xebb2f4.indexOf("/") != -1 && _0xebb2f4.indexOf("+") != -1 ? _0x4faea3 = $.decrypts(_0xebb2f4) : _0x4faea3 = _0xebb2f4;
              }
            } else {
              _0x4faea3 = _0x55b7ea + "   API请求失败，请检查网络重试\n" + _0x1faaea;
            }

            return _0x1b7cc8(_0x4faea3);
          }
        });
      });
    }

    async readUUID() {
      const _0x1f8115 = "uuid.txt";
      await $.generateUUID(_0x1f8115);

      try {
        const _0x58f254 = fs.readFileSync(_0x1f8115, "utf8"),
              _0x2ba188 = _0x58f254.trim();

        return _0x2ba188;
      } catch (_0x359aed) {
        return null;
      }
    }

    generateUUID(_0x184475) {
      if (fs.existsSync(_0x184475)) {
        return;
      }

      const _0x26c2e8 = uuidv4();

      fs.writeFile(_0x184475, _0x26c2e8, "utf8", _0x4923a7 => {
        if (_0x4923a7) {
          console.error("写入文件出错: " + _0x4923a7.message);
          return;
        }

        console.log("uuid.txt 文件已创建并写入 UUID。");
      });
    }

    async getkami() {
      let _0x503efc = await $.readUUID(),
          _0x11f9e2 = await $.task("get", "http://" + dcfhost + ":5705/query?dcf=" + dcfkey + "&MA=" + _0x503efc, {});

      return _0x11f9e2;
    }

    async httpRequest(_0x444e99) {
      delete _0x444e99.fn;

      var _0x8ed9e7 = require("request");

      return new Promise(_0x2f3315 => {
        _0x8ed9e7(_0x444e99, function (_0x1a497c, _0x54a583) {
          if (_0x1a497c) {
            throw new Error(_0x1a497c);
          }

          let _0x5d80e7 = _0x54a583.body;

          _0x2f3315(_0x5d80e7);
        });
      });
    }

    lengthInUtf8Bytes(_0x5a9f74) {
      let _0x57ac05 = encodeURIComponent(_0x5a9f74).match(/%[89ABab]/g);

      return _0x5a9f74.length + (_0x57ac05 ? _0x57ac05.length : 0);
    }

    randomArr(_0x44b059) {
      return _0x44b059[parseInt(Math.random() * _0x44b059.length, 10)];
    }

    wait(_0x7b24b9) {
      return new Promise(_0x40cde1 => setTimeout(_0x40cde1, _0x7b24b9));
    }

    time(_0x520f2d) {
      if (_0x520f2d == 10) {
        return Math.round(+new Date() / 1000);
      } else {
        return +new Date();
      }
    }

    timenow(_0x42abe6) {
      let _0xb002c8 = new Date();

      if (_0x42abe6 == undefined) {
        let _0x22660d = new Date(),
            _0x795c5b = _0x22660d.getFullYear() + "-",
            _0x5b0205 = (_0x22660d.getMonth() + 1 < 10 ? "0" + (_0x22660d.getMonth() + 1) : _0x22660d.getMonth() + 1) + "-",
            _0x2b6040 = _0x22660d.getDate() + " ",
            _0x47ca1b = _0x22660d.getHours() + ":",
            _0xb4df19 = _0x22660d.getMinutes() + ":",
            _0x38256f = _0x22660d.getSeconds() + 1 < 10 ? "0" + _0x22660d.getSeconds() : _0x22660d.getSeconds();

        return _0x795c5b + _0x5b0205 + _0x2b6040 + _0x47ca1b + _0xb4df19 + _0x38256f;
      } else {
        if (_0x42abe6 == 0) {
          return _0xb002c8.getFullYear();
        } else {
          if (_0x42abe6 == 1) {
            return _0xb002c8.getMonth() + 1 < 10 ? "0" + (_0xb002c8.getMonth() + 1) : _0xb002c8.getMonth() + 1;
          } else {
            if (_0x42abe6 == 2) {
              return _0xb002c8.getDate();
            } else {
              if (_0x42abe6 == 3) {
                return _0xb002c8.getHours();
              } else {
                if (_0x42abe6 == 4) {
                  return _0xb002c8.getMinutes();
                } else {
                  if (_0x42abe6 == 5) {
                    return _0xb002c8.getSeconds() + 1 < 10 ? "0" + _0xb002c8.getSeconds() : _0xb002c8.getSeconds();
                  }
                }
              }
            }
          }
        }
      }
    }

    safeGet(_0x50d89e) {
      try {
        if (typeof JSON.parse(_0x50d89e) == "object") {
          return true;
        }
      } catch (_0x23a847) {
        return false;
      }
    }

    randomString(_0x2521c3, _0x58ad3d) {
      if (_0x58ad3d == 0) {
        let _0x3a394d = "QWERTYUIOPASDFGHJKLZXCVBNM01234567890123456789",
            _0x3900ac = _0x3a394d.length,
            _0x2c87e3 = "";

        for (let _0x1ad1f2 = 0; _0x1ad1f2 < _0x2521c3; _0x1ad1f2++) {
          _0x2c87e3 += _0x3a394d.charAt(Math.floor(Math.random() * _0x3900ac));
        }

        return _0x2c87e3;
      } else {
        let _0x3974bb = "qwertyuiopasdfghjklzxcvbnm01234567890123456789QWERTYUIOPASDFGHJKLZXCVBNM",
            _0x1063e5 = _0x3974bb.length,
            _0x5c0407 = "";

        for (let _0x5c5374 = 0; _0x5c5374 < _0x2521c3; _0x5c5374++) {
          _0x5c0407 += _0x3974bb.charAt(Math.floor(Math.random() * _0x1063e5));
        }

        return _0x5c0407;
      }
    }

    udid(_0x418ec2) {
      function _0x588a66() {
        return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
      }

      let _0x173147 = _0x588a66() + _0x588a66() + "-" + _0x588a66() + "-" + _0x588a66() + "-" + _0x588a66() + "-" + _0x588a66() + _0x588a66() + _0x588a66();

      if (_0x418ec2 == 0) {
        return _0x173147.toUpperCase();
      } else {
        return _0x173147.toLowerCase();
      }
    }

    encodeUnicode(_0x2c2ac2) {
      var _0x3955d7 = [];

      for (var _0x873670 = 0; _0x873670 < _0x2c2ac2.length; _0x873670++) {
        _0x3955d7[_0x873670] = ("00" + _0x2c2ac2.charCodeAt(_0x873670).toString(16)).slice(-4);
      }

      return "\\u" + _0x3955d7.join("\\u");
    }

    decodeUnicode(_0x5f14b3) {
      _0x5f14b3 = _0x5f14b3.replace(/\\u/g, "%u");
      return unescape(unescape(_0x5f14b3));
    }

    RT(_0x562152, _0x50f050) {
      return Math.round(Math.random() * (_0x50f050 - _0x562152) + _0x562152);
    }

    arrNull(_0x32b734) {
      var _0x24aaf6 = _0x32b734.filter(_0x3de44c => {
        return _0x3de44c && _0x3de44c.trim();
      });

      return _0x24aaf6;
    }

    nowtime() {
      return new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 28800000);
    }

    timecs() {
      let _0x2c386f = $.nowtime();

      if (JSON.stringify(_0x2c386f).indexOf(" ") >= 0) {
        _0x2c386f = _0x2c386f.replace(" ", "T");
      }

      return new Date(_0x2c386f).getTime() - 28800000;
    }

    rtjson(_0x51df8c, _0x465cb7, _0x4eebd7, _0x567d20) {
      return _0x567d20 == 0 ? JSON.stringify(_0x51df8c.split(_0x465cb7).reduce((_0x1d4e17, _0x507028) => {
        let _0x40446a = _0x507028.split(_0x4eebd7);

        _0x1d4e17[_0x40446a[0].trim()] = _0x40446a[1].trim();
        return _0x1d4e17;
      }, {})) : _0x51df8c.split(_0x465cb7).reduce((_0x51590a, _0x36f1ec) => {
        let _0x4d5f7c = _0x36f1ec.split(_0x4eebd7);

        _0x51590a[_0x4d5f7c[0].trim()] = _0x4d5f7c[1].trim();
        return _0x51590a;
      }, {});
    }

    MD5Encrypt(_0x1f9796, _0x4840c1) {
      if (_0x1f9796 == 0) {
        return this.CryptoJS.MD5(_0x4840c1).toString().toLowerCase();
      } else {
        if (_0x1f9796 == 1) {
          return this.CryptoJS.MD5(_0x4840c1).toString().toUpperCase();
        } else {
          if (_0x1f9796 == 2) {
            return this.CryptoJS.MD5(_0x4840c1).toString().substring(8, 24).toLowerCase();
          } else {
            if (_0x1f9796 == 3) {
              return this.CryptoJS.MD5(_0x4840c1).toString().substring(8, 24).toUpperCase();
            }
          }
        }
      }
    }

    SHA_Encrypt(_0x569a18, _0x34f105, _0x2400d0) {
      if (_0x569a18 == 0) {
        return this.CryptoJS[_0x34f105](_0x2400d0).toString(this.CryptoJS.enc.Base64);
      } else {
        return this.CryptoJS[_0x34f105](_0x2400d0).toString();
      }
    }

    HmacSHA_Encrypt(_0x38bb48, _0x139304, _0x2a38be, _0x32c703) {
      return _0x38bb48 == 0 ? this.CryptoJS[_0x139304](_0x2a38be, _0x32c703).toString(this.CryptoJS.enc.Base64) : this.CryptoJS[_0x139304](_0x2a38be, _0x32c703).toString();
    }

    Base64(_0x2aab4c, _0x64392c) {
      return _0x2aab4c == 0 ? this.CryptoJS.enc.Base64.stringify(this.CryptoJS.enc.Utf8.parse(_0x64392c)) : this.CryptoJS.enc.Utf8.stringify(this.CryptoJS.enc.Base64.parse(_0x64392c));
    }

    DecryptCrypto(_0x2bc9c2, _0x2d4bda, _0x419787, _0x5a10f2, _0x3fc07b, _0x5debae, _0x316835) {
      if (_0x2bc9c2 == 0) {
        const _0x3a98aa = this.CryptoJS[_0x2d4bda].encrypt(this.CryptoJS.enc.Utf8.parse(_0x3fc07b), this.CryptoJS.enc.Utf8.parse(_0x5debae), {
          iv: this.CryptoJS.enc.Utf8.parse(_0x316835),
          mode: this.CryptoJS.mode[_0x419787],
          padding: this.CryptoJS.pad[_0x5a10f2]
        });

        return _0x3a98aa.toString();
      } else {
        const _0x3b18df = this.CryptoJS[_0x2d4bda].decrypt(_0x3fc07b, this.CryptoJS.enc.Utf8.parse(_0x5debae), {
          iv: this.CryptoJS.enc.Utf8.parse(_0x316835),
          mode: this.CryptoJS.mode[_0x419787],
          padding: this.CryptoJS.pad[_0x5a10f2]
        });

        return _0x3b18df.toString(this.CryptoJS.enc.Utf8);
      }
    }

    RSA(_0x5dc3a7, _0x2eef08) {
      const _0x18f9fc = require("node-rsa");

      let _0x2df6cf = new _0x18f9fc("-----BEGIN PUBLIC KEY-----\n" + _0x2eef08 + "\n-----END PUBLIC KEY-----");

      _0x2df6cf.setOptions({
        encryptionScheme: "pkcs1"
      });

      return _0x2df6cf.encrypt(_0x5dc3a7, "base64", "utf8");
    }

    SHA_RSA(_0x5b65ac, _0x2ec53f) {
      let _0x2acf87 = this.Sha_Rsa.KEYUTIL.getKey("-----BEGIN PRIVATE KEY-----\n" + $.getNewline(_0x2ec53f, 76) + "\n-----END PRIVATE KEY-----"),
          _0x23e592 = new this.Sha_Rsa.KJUR.crypto.Signature({
        alg: "SHA256withRSA"
      });

      _0x23e592.init(_0x2acf87);

      _0x23e592.updateString(_0x5b65ac);

      let _0x5b2d2b = _0x23e592.sign(),
          _0x2a6ea0 = this.Sha_Rsa.hextob64u(_0x5b2d2b);

      return _0x2a6ea0;
    }

    getNewline(_0x8e3a58, _0x493364) {
      let _0x354f7e = new String(_0x8e3a58),
          _0x2e99f2 = 0,
          _0x1e3c80 = "";

      for (let _0x302df3 = 0, _0x2ff228 = _0x354f7e.length; _0x302df3 < _0x2ff228; _0x302df3++) {
        let _0x30424c = _0x354f7e.charCodeAt(_0x302df3);

        _0x30424c >= 1 && _0x30424c <= 126 || 65376 <= _0x30424c && _0x30424c <= 65439 ? _0x2e99f2 += 1 : _0x2e99f2 += 2;
        _0x1e3c80 += _0x354f7e.charAt(_0x302df3);
        _0x2e99f2 >= _0x493364 && (_0x1e3c80 = _0x1e3c80 + "\n", _0x2e99f2 = 0);
      }

      return _0x1e3c80;
    }

  }();
}