//app.js

App({
    globalData: {
        BaseUrl: 'http://192.168.10.205:8080/AccountBook',
        // BaseUrl: 'http://127.0.0.1:8080/AccountBook',
        // BaseUrl: 'http://oceanboss.tech/AccountBook',
        // BaseUrl: 'http://192.168.1.103:8080/AccountBook',
        resultcode: {
            SUCCESS: 0,
            INVALID_TOKEN: 1,
            INVALID_COMMAND: 2,
            INVALID_USERINFO: 3
        }
    },

    /**
     * 拼接图像的完整地址
     * 服务器只返回一个文件id
     */
    getImageUrl:function(file){
        return this.globalData.BaseUrl + "/image/get/" +(file?file:"")
    },



    onLaunch: function () {
        //调用API从本地缓存中获取数据
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        // wx.removeStorageSync("token")


        var that=this
        wx.getSystemInfo({
            success: function (res) {
                that.systemInfo=res
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




        Array.prototype.onSizeChanged = function (size) {
            console.log("Array.onSizeChanged:" + size)
        }
        Array.prototype.addToHead = function (v) {
            this.unshift(v)
            this.onSizeChanged(this.length)
        }
        Array.prototype.remove = function (i) {
            this.splice(i, 1)
            this.onSizeChanged(this.length)
        }
        //重写属性
        Array.prototype.overide = function (arr) {

            this.forEach(function(oldObj,i){
                var newObj=arr[i]
                for (var attr in newObj) {
                    oldObj[attr] = newObj[attr];
                }
            })
        }

    },


    login: function (success) {

        var that = this
        wx.login({
            success: function (res) {
                //首先拿到js_code
                // console.log(res.code)
                that.loginInMyServer(res.code, success)
            }
        })
    },

    //在我的服务器上登录,获取token
    loginInMyServer: function (code, success) {
        console.log('loginInMyServer')
        var that=this
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
                console.log(that.globalData.resultcode.INVALID_USERINFO)
                if (res.data.status == that.globalData.resultcode.INVALID_USERINFO) {
                    //完善个人信息
                    wx.getUserInfo({
                        withCredentials: false,
                        success: function (res) {
                            that.uploadUserInfo(res.userInfo, success);
                            wx.showLoading({
                                title: '正在完善用户信息请稍后...',
                            })
                        }

                    })
                    return
                }
                that.onLoginSuccess(success);
            },


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
            icon: 'loading',
            duration: 2000
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
                console.log("请求的参数:");
                console.log(obj.data);
                console.log("成功:");
                console.log(res.data);
                console.log("----------------------------------------------------------------")
                console.log("");
                console.log("");
                console.log("");
                if (res.data.status == that.globalData.resultcode.INVALID_TOKEN ||
                    res.data.status == that.globalData.resultcode.INVALID_USERINFO) {
                    that.reLogin({
                        context: this,
                        success: function () {
                            obj.data.token = wx.getStorageSync("token")
                            that.ajax(obj, context);
                        }
                    });
                    return
                }

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
                    icon: 'loading',
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
