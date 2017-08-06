//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.login({
      success: function (res) {
        console.log(res.code)//这就是code  
      }
  })

  },


    getUserInfo: function (cb) {
      var that = this
      if (this.globalData.userInfo) {
        typeof cb == "function" && cb(this.globalData.userInfo)
      } else {
        //调用登录接口
        wx.getUserInfo({
          withCredentials: true,
          success: function (res) {
            that.globalData.userInfo = res.userInfo
            typeof cb == "function" && cb(that.globalData.userInfo)
          }
        })
      }
    },

  test: function () {
    wx.request({
      url: 'http://oceanboss.tech/ABBooksServer/test/all', //仅为示例，并非真实的接口地址

      success: function (res) {
        console.log(res)
      }
    })
  },

  globalData: {
    userInfo: null
  }
})
