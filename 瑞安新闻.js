/*
软件名:瑞安新闻
完成每日任务，一天55积分左右，可以兑换实物，外地正常发货
变量名:raxwck
手机号注册登录软件后，设置登陆密码，将手机号#密码填入变量，多账号换行隔开
定时:每天一到二次
*/
NAME = "瑞安新闻";
VALY = ["raxwck"];
CK = "";
LOGS = 0;
channel = ["619f0972b40eef3291d28394", "61a4d4d7fe3fc1616c96b38c", "61a4d5faad61a42065f8e32a", "61a4d50cfe3fc1616c96b38d", "61d7af7cad61a46e22a44935", "6339a0e724b56304de64e03d"];

const fs = require("fs");
dcfhost = process.env.dcfhost;

class Bar {
  constructor(_0x43baa4) {
    this.rsakey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQD6XO7e9YeAOs+cFqwa7ETJ+WXizPqQeXv68i5vqw9pFREsrqiBTRcg7wB0RIp3rJkDpaeVJLsZqYm5TW7FWx/iOiXFc+zCPvaKZric2dXCw27EvlH5rq+zwIPDAJHGAfnn1nmQH7wR3PCatEIb8pz5GFlTHMlluw4ZYmnOwg+thwIDAQAB";
    this.phone = _0x43baa4.split("#")[0];
    this.password = encodeURIComponent($.RSA(_0x43baa4.split("#")[1], this.rsakey));
    this.ts = $.time(13);
    this.reid = $.udid(1);
    this.channelid = $.randomArr(channel);
    this.logs = true;
  }

  async login() {
    let _0x4a2901 = "client_id=10004&password=" + this.password + "&phone_number=" + this.phone,
        _0xfbfff1 = await $.task("post", "https://passport.tmuyun.com/web/oauth/credential_auth", {}, _0x4a2901);

    _0xfbfff1.code == 0 ? (this.code = _0xfbfff1.data.authorization_code.code, console.log("【" + this.phone + "】登录成功"), this.logs = true, await this.gettoken()) : this.logs = false;
  }

  async gettoken() {
    let _0x5c3efd = $.SHA_Encrypt(1, "SHA256", "/api/zbtxz/login&&63aa6f7f3cbc2832a20bc158&&" + this.reid + "&&" + this.ts + "&&FR*r!isE5W&&48"),
        _0x29ee79 = {
      "X-SESSION-ID": "63aa6f7f3cbc2832a20bc158",
      "X-REQUEST-ID": this.reid,
      "X-TIMESTAMP": this.ts,
      "X-SIGNATURE": _0x5c3efd,
      "X-TENANT-ID": 48,
      "User-Agent": "2.31.737;" + this.reid + ";Android;11;Release"
    },
        _0x4731f1 = "code=" + this.code + "&token=&type=-1&union_id=",
        _0x4b7fd3 = await $.task("post", "https://vapp.tmuyun.com/api/zbtxz/login", _0x29ee79, _0x4731f1);

    this.sessionid = _0x4b7fd3.data.session.id;
    this.name = _0x4b7fd3.data.account.nick_name;
  }

  async tasklist() {
    let _0x1f52f4 = $.SHA_Encrypt(1, "SHA256", "/api/user_mumber/numberCenter&&" + this.sessionid + "&&" + this.reid + "&&" + this.ts + "&&FR*r!isE5W&&48"),
        _0xc30d18 = {
      "X-SESSION-ID": this.sessionid,
      "X-REQUEST-ID": this.reid,
      "X-TIMESTAMP": this.ts,
      "X-SIGNATURE": _0x1f52f4,
      "X-TENANT-ID": 48,
      "User-Agent": "2.31.737;" + this.reid + ";Android;11;Release"
    },
        _0x5df151 = await $.task("get", "https://vapp.tmuyun.com/api/user_mumber/numberCenter?is_new=1", _0xc30d18);

    if (_0x5df151.code == 0) {
      console.log("【" + this.name + "】==>现有积分" + _0x5df151.data.rst.total_integral);

      for (let _0x2c559a of _0x5df151.data.rst.user_task_list) {
        if (_0x2c559a.name == "分享资讯给好友" && _0x2c559a.completed == 0) {
          for (let _0x2b6a62 = _0x2c559a.finish_times; _0x2b6a62 < _0x2c559a.frequency; _0x2b6a62++) {
            await this.share();
          }
        }

        if (_0x2c559a.name == "新闻资讯评论" && _0x2c559a.completed == 0) {
          for (let _0x4be03b = _0x2c559a.finish_times; _0x4be03b < _0x2c559a.frequency; _0x4be03b++) {
            await this.dailyoneword();
            await this.comment();
          }
        }

        if (_0x2c559a.name == "新闻资讯阅读" && _0x2c559a.completed == 0) {
          for (let _0x4ec1d3 = _0x2c559a.finish_times; _0x4ec1d3 < _0x2c559a.frequency; _0x4ec1d3++) {
            await this.read();
          }
        }

        if (_0x2c559a.name == "新闻资讯点赞" && _0x2c559a.completed == 0) {
          for (let _0x278f8f = _0x2c559a.finish_times; _0x278f8f < _0x2c559a.frequency; _0x278f8f++) {
            await this.like();
          }
        }

        _0x2c559a.name == "使用本地服务" && _0x2c559a.completed == 0 && (await this.local());
      }

      for (let _0x5158c6 of _0x5df151.data.daily_sign_info.daily_sign_list) {
        if (_0x5158c6.current == "今天" && _0x5158c6.signed == false) {
          await this.signin();
        }
      }
    } else {
      console.log("【" + this.name + "】获取任务列表失败，请稍后再试");
    }
  }

  async share() {
    let _0x296ea0 = this.ii[$.RT(0, 29)].id,
        _0x126129 = $.SHA_Encrypt(1, "SHA256", "/api/user_mumber/doTask&&" + this.sessionid + "&&" + this.reid + "&&" + this.ts + "&&FR*r!isE5W&&48"),
        _0x8e8994 = {
      "X-SESSION-ID": this.sessionid,
      "X-REQUEST-ID": this.reid,
      "X-TIMESTAMP": this.ts,
      "X-SIGNATURE": _0x126129,
      "X-TENANT-ID": 48,
      "User-Agent": "2.31.737;" + this.reid + ";Android;11;Release"
    },
        _0x424476 = "memberType=3&member_type=3&target_id=" + _0x296ea0,
        _0x15c7aa = await $.task("post", "https://vapp.tmuyun.com/api/user_mumber/doTask", _0x8e8994, _0x424476);

    if (_0x15c7aa.code == 0) {
      console.log("【" + this.name + "】 分享资讯成功");
      await $.wait(10000, 20000);
    } else {
      console.log("【" + this.name + "】 分享资讯失败");
    }
  }

  async list() {
    let _0x37c2ad = $.SHA_Encrypt(1, "SHA256", "/api/article/channel_list&&" + this.sessionid + "&&" + this.reid + "&&" + this.ts + "&&FR*r!isE5W&&48"),
        _0x30bfd6 = {
      "X-SESSION-ID": this.sessionid,
      "X-REQUEST-ID": this.reid,
      "X-TIMESTAMP": this.ts,
      "X-SIGNATURE": _0x37c2ad,
      "X-TENANT-ID": 48,
      "User-Agent": "2.31.737;" + this.reid + ";Android;11;Release"
    },
        _0x274b78 = await $.task("get", "https://vapp.tmuyun.com/api/article/channel_list?channel_id=" + this.channelid + "&isDiFangHao=false&is_new=true&list_count=0&size=30", _0x30bfd6);

    this.ii = _0x274b78.data.article_list;
  }

  async dailyoneword() {
    let _0x3acd76 = await $.task("get", "https://v1.jinrishici.com/all.json", {});

    this.word = _0x3acd76.content;
  }

  async comment() {
    let _0xd6f5bd = this.ii[$.RT(0, 29)].id,
        _0x2842de = $.SHA_Encrypt(1, "SHA256", "/api/comment/create&&" + this.sessionid + "&&" + this.reid + "&&" + this.ts + "&&FR*r!isE5W&&48"),
        _0x3e0cc2 = {
      "X-SESSION-ID": this.sessionid,
      "X-REQUEST-ID": this.reid,
      "X-TIMESTAMP": this.ts,
      "X-SIGNATURE": _0x2842de,
      "X-TENANT-ID": 48,
      "User-Agent": "2.31.737;" + this.reid + ";Android;11;Release"
    },
        _0x4a5132 = "channel_article_id=" + _0xd6f5bd + "&content=" + encodeURIComponent(this.word),
        _0x1e9238 = await $.task("post", "https://vapp.tmuyun.com/api/comment/create", _0x3e0cc2, _0x4a5132);

    _0x1e9238.code == 0 ? (console.log("【" + this.name + "】 评论资讯成功"), await $.wait(10000, 20000)) : console.log("【" + this.name + "】 评论资讯失败");
  }

  async read() {
    let _0x48fa47 = this.ii[$.RT(0, 29)].id,
        _0x40cef8 = $.SHA_Encrypt(1, "SHA256", "/api/article/detail&&" + this.sessionid + "&&" + this.reid + "&&" + this.ts + "&&FR*r!isE5W&&48"),
        _0x5dab19 = {
      "X-SESSION-ID": this.sessionid,
      "X-REQUEST-ID": this.reid,
      "X-TIMESTAMP": this.ts,
      "X-SIGNATURE": _0x40cef8,
      "X-TENANT-ID": 48,
      "User-Agent": "2.31.737;" + this.reid + ";Android;11;Release"
    },
        _0x38f930 = await $.task("get", "https://vapp.tmuyun.com/api/article/detail?id=" + _0x48fa47, _0x5dab19);

    _0x38f930.code == 0 ? (console.log("【" + this.name + "】 阅读文章成功"), await $.wait(10000, 20000)) : console.log("【" + this.name + "】 阅读文章失败");
  }

  async like() {
    let _0x3eb1ab = this.ii[$.RT(0, 29)].id,
        _0x27d0fe = $.SHA_Encrypt(1, "SHA256", "/api/favorite/like&&" + this.sessionid + "&&" + this.reid + "&&" + this.ts + "&&FR*r!isE5W&&48"),
        _0x57c24b = {
      "X-SESSION-ID": this.sessionid,
      "X-REQUEST-ID": this.reid,
      "X-TIMESTAMP": this.ts,
      "X-SIGNATURE": _0x27d0fe,
      "X-TENANT-ID": 48,
      "User-Agent": "2.31.737;" + this.reid + ";Android;11;Release"
    },
        _0x347e4a = "action=true&id=" + _0x3eb1ab,
        _0x1c4fd8 = await $.task("post", "https://vapp.tmuyun.com/api/favorite/like", _0x57c24b, _0x347e4a);

    _0x1c4fd8.code == 0 ? (console.log("【" + this.name + "】 资讯点赞成功"), await $.wait(10000, 20000)) : console.log("【" + this.name + "】 资讯点赞失败");
  }

  async signin() {
    let _0x406e42 = $.SHA_Encrypt(1, "SHA256", "/api/user_mumber/sign&&" + this.sessionid + "&&" + this.reid + "&&" + this.ts + "&&FR*r!isE5W&&48"),
        _0x24edab = {
      "X-SESSION-ID": this.sessionid,
      "X-REQUEST-ID": this.reid,
      "X-TIMESTAMP": this.ts,
      "X-SIGNATURE": _0x406e42,
      "X-TENANT-ID": 48,
      "User-Agent": "2.31.737;" + this.reid + ";Android;11;Release"
    },
        _0x317390 = await $.task("get", "https://vapp.tmuyun.com/api/user_mumber/sign", _0x24edab);

    _0x317390.code == 0 ? console.log("【" + this.name + "】 签到成功") : console.log("【" + this.name + "】 签到失败");
  }

  async local() {
    let _0x1dce93 = $.SHA_Encrypt(1, "SHA256", "/api/user_mumber/doTask&&" + this.sessionid + "&&" + this.reid + "&&" + this.ts + "&&FR*r!isE5W&&48"),
        _0x4a42bb = {
      "X-SESSION-ID": this.sessionid,
      "X-REQUEST-ID": this.reid,
      "X-TIMESTAMP": this.ts,
      "X-SIGNATURE": _0x1dce93,
      "X-TENANT-ID": 48,
      "User-Agent": "2.31.737;" + this.reid + ";Android;11;Release"
    },
        _0x1c93f7 = "memberType=6&member_type=6",
        _0x51a4eb = await $.task("post", "https://vapp.tmuyun.com/api/user_mumber/doTask", _0x4a42bb, _0x1c93f7);

    _0x51a4eb.code == 0 ? (console.log("【" + this.name + "】 使用本地服务成功"), await $.wait(10000, 20000)) : console.log("【" + this.name + "】 使用本地服务失败");
  }

}

$ = DD();
!(async () => {
  console.log(NAME);
    await $.ExamineCookie();
      await $.Multithreading("login");
      let _0xf756f9 = $.cookie_list.filter(_0x1585e5 => _0x1585e5.logs == true);
      if (_0xf756f9.length == 0) {
        console.log("Cookie格式错误 或 账号被禁封");
        return;
      } else {
        await $.Multithreading("list");
        await $.Multithreading("tasklist");
      }
})().catch(_0x197d70 => {
  console.log(_0x197d70);
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

    async Multithreading(_0x3fd382, _0x1571ae, _0x424ca3) {
      let _0x12b691 = [];
      !_0x424ca3 && (_0x424ca3 = 1);

      while (_0x424ca3--) {
        for (let _0x2bb344 of $.cookie_list) {
          _0x12b691.push(_0x2bb344[_0x3fd382](_0x1571ae));
        }
      }

      await Promise.allSettled(_0x12b691);
    }

    ExamineCookie() {
      let _0x3abe72 = process.env[VALY] || CK,
          _0x39b3bf = 0;

      if (_0x3abe72) {
        for (let _0x323182 of _0x3abe72.split("\n").filter(_0x139a3e => !!_0x139a3e)) {
          $.cookie_list.push(new Bar(_0x323182));
        }

        _0x39b3bf = $.cookie_list.length;
      } else {
        console.log("\n【" + NAME + "】：未填写变量: " + VALY);
      }

      console.log("共找到" + _0x39b3bf + "个账号");
      return $.cookie_list;
    }

    task(_0x30611d, _0xc6e4aa, _0x47f451, _0x5b99e8, _0x3e51d2) {
      if (_0x30611d == "delete") {
        _0x30611d = _0x30611d.toUpperCase();
      } else {
        _0x30611d = _0x30611d;
      }

      _0x30611d == "post" && (delete _0x47f451["content-type"], delete _0x47f451["Content-type"], delete _0x47f451["content-Type"], $.safeGet(_0x5b99e8) ? _0x47f451["Content-Type"] = "application/json;charset=UTF-8" : _0x47f451["Content-Type"] = "application/x-www-form-urlencoded", _0x5b99e8 && (_0x47f451["Content-Length"] = $.lengthInUtf8Bytes(_0x5b99e8)));
      _0x30611d == "get" && (delete _0x47f451["content-type"], delete _0x47f451["Content-type"], delete _0x47f451["content-Type"], delete _0x47f451["Content-Length"]);
      _0x47f451.Host = _0xc6e4aa.replace("//", "/").split("/")[1];
      return new Promise(async _0x334f78 => {
        if (_0x30611d.indexOf("T") < 0) {
          var _0xaf7133 = {
            url: _0xc6e4aa,
            headers: _0x47f451,
            body: _0x5b99e8,
            proxy: "http://" + _0x3e51d2
          };
        } else {
          var _0xaf7133 = {
            url: _0xc6e4aa,
            headers: _0x47f451,
            form: JSON.parse(_0x5b99e8),
            proxy: "http://" + _0x3e51d2
          };
        }

        if (!_0x3e51d2) {
          delete _0xaf7133.proxy;
        }

        this.request[_0x30611d.toLowerCase()](_0xaf7133, (_0xac322b, _0x51e34c, _0x30d8ee) => {
          try {
            if (_0x30d8ee) {
              if (LOGS == 1) {
                console.log("================ 请求 ================");
                console.log(_0xaf7133);
                console.log("================ 返回 ================");

                if ($.safeGet(_0x30d8ee)) {
                  console.log(JSON.parse(_0x30d8ee));
                } else {
                  console.log(_0x30d8ee);
                }
              }
            }
          } catch (_0x20a8b7) {
            console.log(_0x20a8b7, _0xc6e4aa + "\n" + _0x47f451);
          } finally {
            let _0x3113e0 = "";

            if (!_0xac322b) {
              if ($.safeGet(_0x30d8ee)) {
                _0x3113e0 = JSON.parse(_0x30d8ee);
              } else {
                if (_0x30d8ee.indexOf("/") != -1 && _0x30d8ee.indexOf("+") != -1) {
                  _0x3113e0 = $.decrypts(_0x30d8ee);
                } else {
                  _0x3113e0 = _0x30d8ee;
                }
              }
            } else {
              _0x3113e0 = _0xc6e4aa + "   API请求失败，请检查网络重试\n" + _0xac322b;
            }

            return _0x334f78(_0x3113e0);
          }
        });
      });
    }

    async readUUID() {
      const _0xf2a9e1 = "uuid.txt";
      await $.generateUUID(_0xf2a9e1);

      try {
        const _0x5cd056 = fs.readFileSync(_0xf2a9e1, "utf8"),
              _0x47a658 = _0x5cd056.trim();

        return _0x47a658;
      } catch (_0x3cad69) {
        return null;
      }
    }

    generateUUID(_0x5afc2f) {
      if (fs.existsSync(_0x5afc2f)) {
        return;
      }

      const _0x4133b2 = uuidv4();

      fs.writeFile(_0x5afc2f, _0x4133b2, "utf8", _0x14397d => {
        if (_0x14397d) {
          console.error("写入文件出错: " + _0x14397d.message);
          return;
        }

        console.log("uuid.txt 文件已创建并写入 UUID。");
      });
    }

    async getkami() {
      let _0x59f97b = await $.readUUID(),
          _0x981829 = await $.task("get", "http://" + dcfhost + ":5705/query?dcf=" + dcfkey + "&MA=" + _0x59f97b, {});

      return _0x981829;
    }

    lengthInUtf8Bytes(_0x47c99e) {
      let _0x5868d2 = encodeURIComponent(_0x47c99e).match(/%[89ABab]/g);

      return _0x47c99e.length + (_0x5868d2 ? _0x5868d2.length : 0);
    }

    randomArr(_0x2b4fa2) {
      return _0x2b4fa2[parseInt(Math.random() * _0x2b4fa2.length, 10)];
    }

    wait(_0x5890d4) {
      return new Promise(_0xb6116e => setTimeout(_0xb6116e, _0x5890d4));
    }

    time(_0x21e818) {
      if (_0x21e818 == 10) {
        return Math.round(+new Date() / 1000);
      } else {
        return +new Date();
      }
    }

    timenow(_0x509941) {
      let _0x373776 = new Date();

      if (_0x509941 == undefined) {
        let _0x139adb = new Date(),
            _0x28ff9 = _0x139adb.getFullYear() + "-",
            _0x2ffede = (_0x139adb.getMonth() + 1 < 10 ? "0" + (_0x139adb.getMonth() + 1) : _0x139adb.getMonth() + 1) + "-",
            _0x2b3bfe = _0x139adb.getDate() + " ",
            _0x39e27a = _0x139adb.getHours() + ":",
            _0x2f5502 = _0x139adb.getMinutes() + ":",
            _0x530bf5 = _0x139adb.getSeconds() + 1 < 10 ? "0" + _0x139adb.getSeconds() : _0x139adb.getSeconds();

        return _0x28ff9 + _0x2ffede + _0x2b3bfe + _0x39e27a + _0x2f5502 + _0x530bf5;
      } else {
        if (_0x509941 == 0) {
          return _0x373776.getFullYear();
        } else {
          if (_0x509941 == 1) {
            return _0x373776.getMonth() + 1 < 10 ? "0" + (_0x373776.getMonth() + 1) : _0x373776.getMonth() + 1;
          } else {
            if (_0x509941 == 2) {
              return _0x373776.getDate();
            } else {
              if (_0x509941 == 3) {
                return _0x373776.getHours();
              } else {
                if (_0x509941 == 4) {
                  return _0x373776.getMinutes();
                } else {
                  if (_0x509941 == 5) {
                    return _0x373776.getSeconds() + 1 < 10 ? "0" + _0x373776.getSeconds() : _0x373776.getSeconds();
                  }
                }
              }
            }
          }
        }
      }
    }

    safeGet(_0x40fea4) {
      try {
        if (typeof JSON.parse(_0x40fea4) == "object") {
          return true;
        }
      } catch (_0x5aa4a6) {
        return false;
      }
    }

    randomString(_0x130f90, _0x5a6748) {
      if (_0x5a6748 == 0) {
        let _0x49e05a = "QWERTYUIOPASDFGHJKLZXCVBNM01234567890123456789",
            _0x29723d = _0x49e05a.length,
            _0x92eee7 = "";

        for (let _0x3ba47c = 0; _0x3ba47c < _0x130f90; _0x3ba47c++) {
          _0x92eee7 += _0x49e05a.charAt(Math.floor(Math.random() * _0x29723d));
        }

        return _0x92eee7;
      } else {
        let _0x510547 = "qwertyuiopasdfghjklzxcvbnm01234567890123456789QWERTYUIOPASDFGHJKLZXCVBNM",
            _0x5c61e7 = _0x510547.length,
            _0x5127de = "";

        for (let _0x3469eb = 0; _0x3469eb < _0x130f90; _0x3469eb++) {
          _0x5127de += _0x510547.charAt(Math.floor(Math.random() * _0x5c61e7));
        }

        return _0x5127de;
      }
    }

    udid(_0x5cf5ef) {
      function _0xb4ac94() {
        return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
      }

      let _0xabbb7d = _0xb4ac94() + _0xb4ac94() + "-" + _0xb4ac94() + "-" + _0xb4ac94() + "-" + _0xb4ac94() + "-" + _0xb4ac94() + _0xb4ac94() + _0xb4ac94();

      return _0x5cf5ef == 0 ? _0xabbb7d.toUpperCase() : _0xabbb7d.toLowerCase();
    }

    encodeUnicode(_0x3a1b1) {
      var _0x27e4fc = [];

      for (var _0x5c83e6 = 0; _0x5c83e6 < _0x3a1b1.length; _0x5c83e6++) {
        _0x27e4fc[_0x5c83e6] = ("00" + _0x3a1b1.charCodeAt(_0x5c83e6).toString(16)).slice(-4);
      }

      return "\\u" + _0x27e4fc.join("\\u");
    }

    decodeUnicode(_0x5bc7db) {
      _0x5bc7db = _0x5bc7db.replace(/\\u/g, "%u");
      return unescape(unescape(_0x5bc7db));
    }

    RT(_0x35b97b, _0x590f6f) {
      return Math.round(Math.random() * (_0x590f6f - _0x35b97b) + _0x35b97b);
    }

    arrNull(_0x3f1608) {
      var _0x550c74 = _0x3f1608.filter(_0x59c1b9 => {
        return _0x59c1b9 && _0x59c1b9.trim();
      });

      return _0x550c74;
    }

    nowtime() {
      return new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 28800000);
    }

    timecs() {
      let _0x1b6d9e = $.nowtime();

      JSON.stringify(_0x1b6d9e).indexOf(" ") >= 0 && (_0x1b6d9e = _0x1b6d9e.replace(" ", "T"));
      return new Date(_0x1b6d9e).getTime() - 28800000;
    }

    rtjson(_0x593fce, _0x5ce2d0, _0x1ef4a7, _0x3816c) {
      if (_0x3816c == 0) {
        return JSON.stringify(_0x593fce.split(_0x5ce2d0).reduce((_0x587b96, _0x2472e5) => {
          let _0x44592e = _0x2472e5.split(_0x1ef4a7);

          _0x587b96[_0x44592e[0].trim()] = _0x44592e[1].trim();
          return _0x587b96;
        }, {}));
      } else {
        return _0x593fce.split(_0x5ce2d0).reduce((_0x5b57e6, _0x67f193) => {
          let _0x436c01 = _0x67f193.split(_0x1ef4a7);

          _0x5b57e6[_0x436c01[0].trim()] = _0x436c01[1].trim();
          return _0x5b57e6;
        }, {});
      }
    }

    MD5Encrypt(_0xd3bd85, _0x578cd1) {
      if (_0xd3bd85 == 0) {
        return this.CryptoJS.MD5(_0x578cd1).toString().toLowerCase();
      } else {
        if (_0xd3bd85 == 1) {
          return this.CryptoJS.MD5(_0x578cd1).toString().toUpperCase();
        } else {
          if (_0xd3bd85 == 2) {
            return this.CryptoJS.MD5(_0x578cd1).toString().substring(8, 24).toLowerCase();
          } else {
            if (_0xd3bd85 == 3) {
              return this.CryptoJS.MD5(_0x578cd1).toString().substring(8, 24).toUpperCase();
            }
          }
        }
      }
    }

    SHA_Encrypt(_0x38eb53, _0x497591, _0x51fe5a) {
      return _0x38eb53 == 0 ? this.CryptoJS[_0x497591](_0x51fe5a).toString(this.CryptoJS.enc.Base64) : this.CryptoJS[_0x497591](_0x51fe5a).toString();
    }

    HmacSHA_Encrypt(_0xe5dc26, _0x3128c3, _0x787d7d, _0xcca420) {
      if (_0xe5dc26 == 0) {
        return this.CryptoJS[_0x3128c3](_0x787d7d, _0xcca420).toString(this.CryptoJS.enc.Base64);
      } else {
        return this.CryptoJS[_0x3128c3](_0x787d7d, _0xcca420).toString();
      }
    }

    Base64(_0x176a59, _0x232d2a) {
      return _0x176a59 == 0 ? this.CryptoJS.enc.Base64.stringify(this.CryptoJS.enc.Utf8.parse(_0x232d2a)) : this.CryptoJS.enc.Utf8.stringify(this.CryptoJS.enc.Base64.parse(_0x232d2a));
    }

    DecryptCrypto(_0x57734b, _0xa294a6, _0x1fee02, _0x303c9e, _0x1e7e80, _0x2c9405, _0x1ad15a) {
      if (_0x57734b == 0) {
        const _0x157473 = this.CryptoJS[_0xa294a6].encrypt(this.CryptoJS.enc.Utf8.parse(_0x1e7e80), this.CryptoJS.enc.Utf8.parse(_0x2c9405), {
          iv: this.CryptoJS.enc.Utf8.parse(_0x1ad15a),
          mode: this.CryptoJS.mode[_0x1fee02],
          padding: this.CryptoJS.pad[_0x303c9e]
        });

        return _0x157473.toString();
      } else {
        const _0x7986c0 = this.CryptoJS[_0xa294a6].decrypt(_0x1e7e80, this.CryptoJS.enc.Utf8.parse(_0x2c9405), {
          iv: this.CryptoJS.enc.Utf8.parse(_0x1ad15a),
          mode: this.CryptoJS.mode[_0x1fee02],
          padding: this.CryptoJS.pad[_0x303c9e]
        });

        return _0x7986c0.toString(this.CryptoJS.enc.Utf8);
      }
    }

    RSA(_0x204039, _0x2c3b70) {
      const _0x3b5a27 = require("node-rsa");

      let _0x40fdd4 = new _0x3b5a27("-----BEGIN PUBLIC KEY-----\n" + _0x2c3b70 + "\n-----END PUBLIC KEY-----");

      _0x40fdd4.setOptions({
        encryptionScheme: "pkcs1"
      });

      return _0x40fdd4.encrypt(_0x204039, "base64", "utf8");
    }

    SHA_RSA(_0x63569b, _0x5c4f83) {
      let _0xdb087b = this.Sha_Rsa.KEYUTIL.getKey("-----BEGIN PRIVATE KEY-----\n" + $.getNewline(_0x5c4f83, 76) + "\n-----END PRIVATE KEY-----"),
          _0x44a8a8 = new this.Sha_Rsa.KJUR.crypto.Signature({
        alg: "SHA256withRSA"
      });

      _0x44a8a8.init(_0xdb087b);

      _0x44a8a8.updateString(_0x63569b);

      let _0x389029 = _0x44a8a8.sign(),
          _0x3803f2 = this.Sha_Rsa.hextob64u(_0x389029);

      return _0x3803f2;
    }

    getNewline(_0x42691c, _0x1c201b) {
      let _0x4ea8c7 = new String(_0x42691c),
          _0x3cf50f = 0,
          _0x5f2f63 = "";

      for (let _0x367d22 = 0, _0x41115d = _0x4ea8c7.length; _0x367d22 < _0x41115d; _0x367d22++) {
        let _0x3d81d0 = _0x4ea8c7.charCodeAt(_0x367d22);

        if (_0x3d81d0 >= 1 && _0x3d81d0 <= 126 || 65376 <= _0x3d81d0 && _0x3d81d0 <= 65439) {
          _0x3cf50f += 1;
        } else {
          _0x3cf50f += 2;
        }

        _0x5f2f63 += _0x4ea8c7.charAt(_0x367d22);
        _0x3cf50f >= _0x1c201b && (_0x5f2f63 = _0x5f2f63 + "\n", _0x3cf50f = 0);
      }

      return _0x5f2f63;
    }

  }();
}