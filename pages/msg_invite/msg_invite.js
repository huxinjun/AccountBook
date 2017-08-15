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
        console.log("delete")
        // slider.deleteItem(e)
    },

    acceptInvite: function (e) {
        this.option(e, "accept")
    },
    refuseInvite: function (e) {
        this.option(e, "refuse")
    },

    option: function (e, opt) {
        APP.ajax({
            url: APP.globalData.BaseUrl + '/msg/invite/' + opt,

            data: {
                token: wx.getStorageSync("token"),
                msgId: this.data.datas[e.target.dataset.index].id
            },

            success: function (res) {
                switch (res.data.status) {
                    case APP.globalData.resultcode.SUCCESS:
                        var item = this.data.datas[e.target.dataset.index]
                        slider.setLayer(item, 1)
                        if (opt == "accept") {
                            item.status = 11
                            item.statusStr = "已接受"
                            item.statusColor = "green"
                        } else {
                            item.status = 12
                            item.statusStr = "已拒绝"
                            item.statusColor = "red"
                        }
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
                                this.option(e, opt);
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
        var slidersInfo = {
            //page：page对象
            page: this,
            //checkAngle：是否要检查水平滑动的角度，默认大于15度将认为抽屉时间中断
            checkAngle: false,
            //条目高度
            height:200,
            //N种状态
            layers: [
                {
                    name: "状态一",
                    buttons: [
                        {
                            text: "接受",
                            color: "white",
                            colorBg: "#2ba245",
                            colorShadow: "black",
                            onClick: "acceptInvite",
                            width: 150
                        },
                        {
                            text: "拒绝",
                            color: "white",
                            colorBg: "#cdcdcd",
                            colorShadow: "black",
                            onClick: "refuseInvite",
                            width: 150
                        }
                    ]
                },
                {
                    name: "状态二",
                    buttons: [
                        {
                            text: "删除",
                            color: "white",
                            colorBg:"#f00",
                            colorShadow:"black",
                            onClick: "_delete",
                            width: 150
                        }
                    ]
                },
                {
                    name: "状态三",
                }
            ]
        }
        slider = require('../../utils/slider.js').init(slidersInfo)
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
                                slider.setLayer(v,0)
                                break;
                            case 11:
                                v.statusStr = "已接受"
                                v.statusColor = "green"
                                slider.setLayer(v,1)
                                break;
                            case 12:
                                v.statusStr = "已拒绝"
                                v.statusColor = "red"
                                slider.setLayer(v,1)
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


    canOpen: function (e) {
        return this.data.datas[e.target.dataset.index].canOpen;
    },


    touchstart: function (e) {
        var a=this
        // debugger
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














