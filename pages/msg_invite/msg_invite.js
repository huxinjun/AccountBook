//index.js
//获取应用实例
var slider
var APP = getApp()
Page({
    data: {
        containerHeight: 0,

        datas: null

    },

    //点击删除按钮事件
    _delete: function (e) {
        slider.deleteItem(e)
    },

    acceptInvite: function (e) {
        APP.ajax({
            url: APP.globalData.BaseUrl + '/msg/invite/accept',

            data: {
                token: wx.getStorageSync("token"),
                msgId: this.data.datas[e.target.dataset.index].id
            },

            success: function (res) {
                switch (res.data.status) {
                    case APP.globalData.resultcode.SUCCESS:
                        this.data.datas[e.target.dataset.index].status = 11
                        this.data.datas[e.target.dataset.index].statusStr = "已接受"
                        this.data.datas[e.target.dataset.index].statusColor = "green"
                        console.log(this)
                        this.setData({
                            datas: this.data.datas
                        })
                        slider.close(e.target.dataset.index)
                        break;
                    case APP.globalData.resultcode.INVALID_TOKEN:
                        APP.reLogin({
                            context: this,
                            success: function () {
                                this.acceptInvite();
                            }
                        });
                        break;
                    case APP.globalData.resultcode.INVALID_COMMAND:
                        //已经是好友关系了
                        slider.close(e.target.dataset.index)
                        break;
                }


            }
        }, this)

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
        this.initData()
    },

    initData: function () {
        APP.ajax({
            url: APP.globalData.BaseUrl + '/msg/invite',

            data: {
                token: wx.getStorageSync("token")
            },

            success: function (res) {
                if (res.data.status == APP.globalData.resultcode.SUCCESS) {
                    res.data.datas.forEach(function (v, i) {
                        switch (v.status) {
                            case 0:
                            case 1:
                                v.statusStr = "未处理"
                                v.statusColor = "blue"
                                break;
                            case 11:
                                v.statusStr = "已接受"
                                v.statusColor = "green"
                                break;
                            case 12:
                                v.statusStr = "已拒绝"
                                v.statusColor = "red"
                                break;
                        }

                    })
                    this.setData({
                        datas: res.data.datas
                    })

                } else if (res.data.status == APP.globalData.resultcode.INVALID_TOKEN) {
                    APP.reLogin({
                        context: this,
                        success: function () {
                            this.initData();
                        }
                    });
                }

            }
        }, this)
    },




    touchstart: function (e) {
        slider.start(e)
    },
    touchmove: function (e) {
        slider.move(e)
    },
    touchend: function (e) {
        slider.end(e)
    },
    touchcancel: function (e) {
        slider.cancel(e)
    },
    outterScroll: function (e) {
        //   console.log(e)
        slider.breakOnce();
    },
    innerScroll: function (e) {
        //   console.log(e)
    }

})

