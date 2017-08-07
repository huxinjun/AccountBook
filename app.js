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
                        return
                    }
                    that.login()
                }

            })
        }
    },

    login:function(){
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
        var that = this
        wx.request({
            url: 'http://192.168.10.228:8080/AccountBook/login/fromWX',
            data: {
                code: code
            },
            success: function (res) {
                console.log(res.data)
                that.globalData.token = res.data.token
                wx.setStorageSync("token", res.data.token)
                if (res.data.status == 1) {
                    //完善个人信息
                    that.setUserInfo();
                }
            }
        })
    },

    //第一次在我的服务器上登录,需要完善用户信息
    setUserInfo: function () {
        console.log('uploadUserInfo')
        var that = this
        wx.request({

            url: 'http://192.168.10.228:8080/AccountBook/user/updateInfo',
            data: {
                token: that.globalData.token,
                info: that.globalData.userInfo
            },
            success: function (res) {
                console.log(res.data)
            }
        })
    },



    globalData: {
        userInfo: null,
        token: null
    }

})
