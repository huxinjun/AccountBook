//app.js

App({
    onLaunch: function () {
        //调用API从本地缓存中获取数据
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        // console.log("before:"+wx.getStorageSync('token'))
        // wx.removeStorageSync('token')
        // console.log(wx.getStorageSync('token'))

    },





    getUserInfo: function (cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.getUserInfo({
                withCredentials: false,
                success: function (res) {
                    that.globalData.userInfo = res.userInfo
                    typeof cb == "function" && cb(that.globalData.userInfo)
                    if (wx.getStorageSync('token') !='') {
                        console.log('使用本地token')
                        that.globalData.token = wx.getStorageSync('token')
                        return
                    }
                    that.login()
                }

            })
        }
    },

    login:function(){
        // wx.showToast({
        //     title: '正在登陆...',
        //     icon: 'loading',
        //     duration: 2000
        // })
        

        var that = this
        wx.login({
            success: function (res) {
                //首先拿到js_code
                console.log(res.code)//这就是code 
                that.loginInMyServer(res.code)
            }
        })
    },

    //在我的服务器上登录,获取token
    loginInMyServer: function (code) {
        console.log('loginInMyServer')
        wx.showLoading({
          title: '正在登陆中请稍后...',
        })
        this.ajax({
            url: this.globalData.BaseUrl +'/login/fromWX',
            data: {
                code: code
            },
            success: function (res) {
                console.log(res.data)
                this.globalData.token = res.data.token
                wx.setStorageSync("token", res.data.token)
                if (res.data.status == 1) {
                    //完善个人信息
                    this.setUserInfo();
                    wx.showLoading({
                      title: '正在完善用户信息请稍后...',
                    })
                    return
                }
                wx.hideLoading()
            }
        },this)
    },

    //第一次在我的服务器上登录,需要完善用户信息
    setUserInfo: function () {
        console.log('uploadUserInfo')
        this.ajax({

            url: this.globalData.BaseUrl+'/user/updateInfo',
            data: {
                token: this.globalData.token,
                info: this.globalData.userInfo
            },
            success: function (res) {
                console.log(res.data)
                wx.hideLoading()
            }
        },this)
    },



    globalData: {
        // BaseUrl: 'http://192.168.10.228:8080/AccountBook',
        // BaseUrl: 'http://127.0.0.1:8080/AccountBook',
        // BaseUrl: 'http://oceanboss.tech/AccountBook',
        BaseUrl: 'http://192.168.1.103:8080/AccountBook',
        userInfo: null,
        token: null
    },


    



//*************************************************************************************************************/

    /**
     * 1.为了在请求回调实例中更方便的使用外层的数据
     * 2.请求集中打印log
     * 代理wx.request方法
     */
    ajax: function (obj,context) {
    
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
            },
            complete: function (res) {
                if (obj.complete != undefined)
                    obj.complete.call(context, res);
            }
        });

    },

})
