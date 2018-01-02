//app.js
var util = require("/utils/util.js")
var loging
App({
    globalData: {
        BaseUrl: 'https://xzbenben.cn/AccountBook',
        // BaseUrl: 'http://192.168.10.41:8080/AccountBook',
        // BaseUrl: 'http://127.0.0.1:8080/AccountBook',
        // BaseUrl: 'http://oceanboss.tech/AccountBook',
        // BaseUrl: 'http://192.168.1.103:8080/AccountBook',
        resultcode: {
            SUCCESS: 0,
            FAILD:99,
            INVALID_TOKEN: 1,
            INVALID_COMMAND: 2,
            INVALID_USERINFO: 3
        },
        typeList: [
            {
                "id": "cf",
                "name": "吃饭",
                "icon": "/img/type/type_food.png"
            },
            {
                "id": "zf",
                "name": "租房",
                "icon": "/img/type/type_home.png"
            },
            {
                "id": "jt",
                "name": "交通",
                "icon": "/img/type/type_traffic.png"
            },
            {
                "id": "gw",
                "name": "购物",
                "icon": "/img/type/type_shopping.png"
            },
            {
                "id": "sh",
                "name": "生活",
                "icon": "/img/type/type_vegetable.png"
            },
            {
                "id": "ls",
                "name": "零食",
                "icon": "/img/type/type_snack.png"
            },
            {
                "id": "lx",
                "name": "旅行",
                "icon": "/img/type/type_travel.png"
            },
            {
                "id":"yl",
                "name": "娱乐",
                "icon": "/img/type/type_entertainment.png"
            },
            {
                "id": "qt",
                "name": "其他",
                "icon": "/img/type/type_other.png"
            },
            {
                "id": "hk",
                "name": "还款",
                "icon": "/img/type/type_money_in.png"
            },
            {
                "id": "jk",
                "name": "借款",
                "icon": "/img/type/type_money_out.png"
            },
            {
                "id": "sr",
                "name": "收入",
                "icon": "/img/type/type_self_money_in.png"
            },
            
        ]
    },

    /**
     * 拼接图像的完整地址
     * 服务器只返回一个文件id
     */
    getImageUrl: function (file) {
        if (file == null || file == "")
            return null
        return this.globalData.BaseUrl + "/image/get/" + (file ? file : "")
    },
    /**
     * 根据图像的完整地址获取其在服务器上的短地址
     */
    getImageUri: function (url) {
        if (url == null || url == "")
            return null
        return url.replace(this.globalData.BaseUrl + "/image/get/", "")
    },




    /**
     * 判断是否iphone手机
     */
    isiphone() {
        var that = this
        wx.getSystemInfo({
            success: function (res) {
                // console.log("!!!!!!!!")
                // console.log(res.model.toLowerCase())
                // console.log(res.model.toLowerCase().indexOf("iphone") != -1)
                var isiphone = res.model.toLowerCase().indexOf("iphone") != -1
                that.globalData.isiphone = isiphone
                console.log(that.globalData)
            }
        })
    },



    onLaunch: function () {
        this.isiphone()

        this.checkLogin()
        //调用API从本地缓存中获取数据
        // wx.removeStorageSync("token")

        var that = this
        wx.getSystemInfo({
            success: function (res) {
                that.systemInfo = res
                console.log(res.model)
                console.log(res.pixelRatio)
                console.log(res.screenWidth)
                console.log(res.screenHeight)
                console.log(res.windowWidth)
                console.log(res.windowHeight)
                console.log(res.language)
                console.log(res.version)
                console.log(res.platform)
            }
        })



        //数组长度改变回调
        Array.prototype.onSizeChanged = function (size) {
            console.log("Array.onSizeChanged:" + size)
        }
        //添加数据到数组顶端
        Array.prototype.addToHead = function (v) {
            this.unshift(v)
            this.onSizeChanged(this.length)
        }
        //添加一个数组到当前数组顶端
        Array.prototype.addAllToHead = function (arr) {
            for (var i = arr.length-1;i>=0;i--)
                this.unshift(arr[i])
            this.onSizeChanged(this.length)
        }


        //追加到末尾
        Array.prototype.append = function (v) {
            this.push(v)
            this.onSizeChanged(this.length)
        }
        //追加数组到末尾
        Array.prototype.appendAll = function (arr) {
            for (var i = 0; i < arr.length; i++)
                this.push(arr[i])
            this.onSizeChanged(this.length)
        }

        //移除某个索引的元素
        Array.prototype.remove = function (i) {
            this.splice(i, 1)
            this.onSizeChanged(this.length)
        }
        //移除数组中具有某个属性和值得对象
        Array.prototype.removeObject = function (key, value) {
            this.remove(this.findIndexByAttr(key, value))
        }


        //重写属性
        Array.prototype.overide = function (arr) {

            this.forEach(function (oldObj, i) {
                var newObj = arr[i]
                for (var attr in newObj) {
                    oldObj[attr] = newObj[attr];
                }
            })
        }
        //在对象数组中寻找具有某个属性和值得对象
        Array.prototype.findByAttr = function (key, value) {
            for (var i = 0, len = this.length; i < len; i++) {
                if (this[i][key] == value)
                    return this[i];
            }
        }
        //在数组中寻找具有指定属性的元素,返回第一个
        Array.prototype.findIndexByAttr = function (key, value) {
            for (var i = 0, len = this.length; i < len; i++) {
                if (this[i][key] == value)
                    return i;
            }
        }

        String.prototype.replaceAll = function (FindText, RepText) {
            regExp = new RegExp(FindText, "g");
            return this.replace(regExp, RepText);
        }

        String.prototype.encode = function () {
            return this.replaceAll("=", "!XJ!");
        }
        String.prototype.decode = function () {
            return this.replaceAll("!XJ!", "=");
        }

    },

    //检查登录状态，为了防止token失效时进入页面同时请求两个以上接口，导致服务器不停刷新token,造成死循环
    checkLogin: function () {
        console.log('checkLogin')
        var that = this
        this.ajax({
            url: this.globalData.BaseUrl + '/login/checkLogin',
            data: {
                token: wx.getStorageSync("token")
            },
            success:function(res){
                if (res.data.status == that.globalData.resultcode.FAILD ||
                    res.data.status == that.globalData.resultcode.INVALID_USERINFO)
                    //没有这个用户，或者没有完善用户信息
                    this.reLogin()
            }
        }, this)
    },


    login: function (success) {
        //避免几个请求同时发现未登录,都去登录了
        if (loging)
            return
        loging=true
        var that = this
        wx.login({
            success: function (res) {
                //首先拿到js_code
                // console.log(res.code)
                that.loginInMyServer(res.code, success)
            },
            complete:function(res){
                loging=false
            }
        })
    },

    //在我的服务器上登录,获取token
    loginInMyServer: function (code, success) {
        console.log('loginInMyServer')
        var that = this
        wx.showLoading({
            title: '正在登陆中请稍后...',
        })
        wx.request({
            url: that.globalData.BaseUrl + '/login/fromWX',
            data: {
                code: code
            },
            success: function (res) {
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                wx.setStorageSync("token", res.data.token)
                console.log(res)
                if (res.data.status == that.globalData.resultcode.INVALID_USERINFO) {
                    //完善个人信息
                    wx.getUserInfo({
                        withCredentials: false,
                        success: function (res) {
                            that.uploadUserInfo(res.userInfo, success);
                            wx.showLoading({
                                title: '正在完善用户信息请稍后...',
                            })
                        },
                        fail:function(){
                            that.uploadUserInfo('', success);
                            wx.showLoading({
                                title: '以游客身份登录中...',
                            })
                        }

                    })
                    return
                }
                that.onLoginSuccess(success);
            },
            complete:function(res){
                loging=false
            }


        })
    },

    //第一次在我的服务器上登录,需要完善用户信息
    uploadUserInfo: function (info, success) {
        console.log('uploadUserInfo')
        this.ajax({

            url: this.globalData.BaseUrl + '/user/updateInfo',
            data: {
                token: wx.getStorageSync("token"),
                info: info
            },
            success: function (res) {
                console.log(res.data)
                this.onLoginSuccess(success);
            }
        }, this)
    },

    /**
     * 更换设备导致token失效时需要重新登录
     */
    reLogin: function (success) {
        wx.removeStorageSync("token");
        this.login(success);
    },

    /**
     * 登录成功回调
     */
    onLoginSuccess: function (success) {
        wx.hideLoading()
        wx.showToast({
            title: '登陆成功!',
            icon: 'success',
            duration: 1000
        })

        if (success != undefined)
            success.success.call(success.context);
    },










    //*************************************************************************************************************/

    /**
     * 1.为了在请求回调实例中更方便的使用外层的数据
     * 2.请求集中打印log
     * 代理wx.request方法
     */
    ajax: function (obj, context) {
        var that = this
        wx.showNavigationBarLoading()
        wx.request({
            url: obj.url,
            data: obj.data,
            header: obj.header,
            method: obj.method,
            dataType: obj.dataType,
            success: function (res) {
                console.log("----------------------------------------------------------------")
                console.log("请求的url:" + obj.url);
                if (obj.data == undefined)
                    console.log("没有请求参数!!!")
                else{
                    console.log("请求的参数:")
                    console.log(obj.data)
                }
                console.log("成功:")
                console.log(res.data)
                console.log("----------------------------------------------------------------")
                console.log("")
                console.log("")
                console.log("")
                if (res.data.status == that.globalData.resultcode.INVALID_TOKEN) {
                    that.reLogin({
                        context: this,
                        //为了避免无限请求,重写登录后不自动发起请求
                        success: function () {
                            // obj.data.token = wx.getStorageSync("token")
                            // that.ajax(obj, context);
                        }
                    });
                    return
                }


                //转换为完整头像地址
                var clone = util.clone(res.data, {
                    onCopyed: function (obj, attr) {
                        //服务器内部图片都是以以XzBB结尾
                        if (obj[attr] && typeof obj[attr] == 'string' && obj[attr].endsWith("XzBB"))
                            obj[attr] = that.getImageUrl(obj[attr])
                        // console.log("onCopyed:" + attr)
                    }
                })
                res.data = clone



                if (obj.success != undefined)
                    obj.success.call(context, res);
            },
            fail: function (res) {
                console.log("----------------------------------------------------------------")
                console.log("请求的url:" + obj.url);
                console.log("请求的参数:");
                console.log(obj.data);
                console.log("失败:" + res.errMsg);
                console.log("----------------------------------------------------------------")
                console.log("");
                console.log("");
                console.log("");
                if (obj.fail != undefined)
                    obj.fail.call(context, res);

                wx.showToast({
                    title: '网络错误',
                    image: "/img/error.png",
                    duration: 1000
                })

            },
            complete: function (res) {
                wx.hideNavigationBarLoading()
                if (obj.complete != undefined)
                    obj.complete.call(context, res);
            }
        });

    },

})
