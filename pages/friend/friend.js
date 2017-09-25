//index.js
//获取应用实例
var slider= require('../../utils/slider.js')
var APP = getApp()
Page({
    data: {
        containerHeight: APP.systemInfo.windowHeight,
        datas:null

    },
    slidersInfo:{
        //N种状态
        layers: [
            {
                name: "状态一",
                //条目高度
                height: 200,
                buttons: [
                    {
                        text: "接受1",
                        color: "white",
                        colorBg: "#2ba245",
                        colorShadow: "black",
                        onClick: "acceptInvite",
                        width: 150,
                        visible: true
                    },
                    {
                        text: "拒绝2",
                        color: "white",
                        colorBg: "#cdcdcd",
                        colorShadow: "black",
                        onClick: "refuseInvite",
                        width: 150,
                        visible: true
                    }
                ]
            },
            {
                name: "状态二",
                //条目高度
                height: 200,
                buttons: [
                    {
                        text: "删除3",
                        color: "white",
                        colorBg: "#f00",
                        colorShadow: "black",
                        onClick: "_delete",
                        width: 150,
                        visible: true
                    }
                ]
            },
            {
                name: "状态三",
                //条目高度
                height: 200
            }
        ]
    },

    getSliderData:function(index){
        if(index==undefined)
            return this.data.datas
        return this.data.datas[index]
    },
    refreshSliderData: function () {
        this.setData({
            datas:this.data.datas
        })
    },
    onLoad: function () {
        var that = this
        this.slidersInfo.page = this
        slider.init(this.slidersInfo)
        // this.initData()
    },


    onShow: function (options) {
        //切换页面时候需要重新初始化slider,因为require获取的是同一个对象
        slider.init(this.slidersInfo)
    },

    initData: function () {
        APP.ajax({
            url: APP.globalData.BaseUrl + '/msg/firend',

            data: {
                token: wx.getStorageSync("token")
            },

            success: function (res) {
                if (res.data.status == APP.globalData.resultcode.SUCCESS) {
                    this.data.datas = res.data.datas
                    res.data.datas.forEach(function (v, i) {
                      
                        switch (v.status) {
                            case 0:
                            case 1:
                                slider.setLayer(i,0)
                                break;
                            case 11:
                                v.statusStr = "已接受"
                                slider.setLayer(i,1)
                                break;
                            case 12:
                                v.statusStr = "已拒绝"
                                slider.setLayer(i,1)
                                break;
                        }

                    })
                    this.refreshSliderData()
                }

            }
        }, this)
    },



    gotoAddFriend:function(e){
        wx.navigateTo({
            url: '/pages/qr_image/qr_image',
        })
    },
    gotoGroup: function (e) {
        wx.navigateTo({
            url: '/pages/group/group',
        })
    }

})














