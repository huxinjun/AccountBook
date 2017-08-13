//index.js
//获取应用实例
var slider
var app = getApp()
Page({
    data: {
      containerHeight:0,
       
        list: [
            {
                "value":'A'
            },
            {
                "value": 'B'
            },
            {
                "value": 'C'
            },
            {
              "value": 'D'
            },
            {
              "value": 'E'
            },
            {
                "value": 'F'
            }
        ],
        
    },

    //点击删除按钮事件
    _delete: function (e) {
        slider.deleteItem(e)
    },

    acceptInvite: function (e) {
        slider.close(e.target.dataset.index)
    },
    refuseInvite: function (e) {
        slider.close(e.target.dataset.index)
    },

    
    onLoad: function () {
        console.log('onLoad')
        var that = this
      wx.getSystemInfo({
        success: function (res) {
          console.log(res.model)
          console.log(res.pixelRatio)
          console.log(res.screenWidth)
          console.log(res.screenHeight)
          console.log(res.windowWidth)
          console.log(res.windowHeight)
          console.log(res.language)
          console.log(res.version)
          console.log(res.platform)

          that.setData({
            containerHeight: res.windowHeight
          })
        }
      })
      slider = require('../../utils/slider.js').init(this, 300, false)
        
    },

    touchstart:function(e){
        slider.start(e)
    },
    touchmove: function (e) {
        slider.move(e)
    },
    touchend: function (e) {
        slider.end(e)
    },
    touchcancel:function(e){
        slider.cancel(e)
    },
    outterScroll: function (e) {
      console.log(e)
      slider.breakOnce();
    },
    innerScroll: function (e) {
      console.log(e)
    }

})

