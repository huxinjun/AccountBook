//index.js
//获取应用实例
var slider = require('../../utils/slider.js')
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
    delete: function (e) {
        slider.deleteItem.call(this,e)
    },

    
    onLoad: function () {
        console.log('onLoad')
        var that = this
      wx.getSystemInfo({
        success: function (res) {
          console.log(res.model)
          console.log(res.pixelRatio)
          console.log(res.windowWidth)
          console.log(res.windowHeight)
          console.log(res.language)
          console.log(res.version)
          console.log(res.platform)

          that.setData({
            containerHeight: res.pixelRatio * res.windowHeight
          })
        }
      })
      
        
    },

    touchstart:function(e){
        slider.start.call(this,e)
    },
    touchmove: function (e) {
        slider.move.call(this, e)
    },
    touchend: function (e) {
        slider.end.call(this, e)
    },
    touchcancel:function(e){
        slider.cancel.call(this, e)
    },
    outterScroll: function (e) {
      // console.log(e)
    },
    innerScroll: function (e) {
      // console.log(e)
    }

})

