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
              "value": 'A'
            },
            {
              "value": 'B'
            }
        ],
    },

    //点击删除按钮事件
    delete: function (e) {
        //获取列表中要删除项的下标
        var index = e.target.dataset.index;
        var list = this.data.list;
        //移除列表中下标为index的项
        list.splice(index, 1);
        //更新列表的状态
        this.setData({
            list: list
        });
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

