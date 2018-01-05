//index.js
//获取应用实例
var slider
var APP = getApp()
Page({
    data: {
        containerHeight: APP.systemInfo.windowHeight, 
        datas:null

    },


    slidersInfo : {
        //N种状态
        layers: [
            {
                name: "状态一",
                //条目高度
                height: 120,
                buttons: [
                    {
                        text: "删除",
                        color: "white",
                        colorBg: "red",
                        colorShadow: "black",
                        onClick: "makeDeleted",
                        width: 150,
                        visible: true
                    },
                    {
                        text: "标记为已读",
                        color: "white",
                        colorBg: "#cdcdcd",
                        colorShadow: "black",
                        onClick: "makeReaded",
                        width: 150,
                        visible: true
                    }
                ]
            },
            {
                name: "邀请消息的侧滑菜单",
                //条目高度
                height: 120,
                buttons: [
                    {
                        text: "删除",
                        color: "white",
                        colorBg: "red",
                        colorShadow: "black",
                        onClick: "makeDeleted",
                        width: 150,
                        visible: true
                    }
                ]
            },
            
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

    onItemClick:function(e){
        var index = e.target.dataset.index
        var item = this.data.datas[index]

        if (slider.isSliderOpen(index)) {
            slider.close(index)
            return
        }

        if(item.type==3)
            wx.navigateTo({
                url: '/pages/msg_friend/msg_friend?userId='+item.userId.encode(),
        })
        else{
            wx.navigateTo({
                url: '/pages/msg_invite/msg_invite'
            })
        }
    },

    //点击删除
    makeDeleted: function (e) {
        console.log("makeDeleted")
        var index = e.target.dataset.index
        var chat = this.data.datas[index]

        APP.ajax({
            url: APP.globalData.BaseUrl + '/msg/deleteAll',

            data: {
                token: wx.getStorageSync("token"),
                userId: chat.userId,
                type:chat.type
            },
            success: function (res) {
                this.initData()
            }

        }, this)
    },

    //点击标记为已读
    makeReaded: function (e) {
        console.log("makeReaded")
        var index = e.target.dataset.index
        var chat = this.data.datas[index]

        APP.ajax({
            url: APP.globalData.BaseUrl + '/msg/readAll',

            data: {
                token: wx.getStorageSync("token"),
                userId: chat.userId,
                type: chat.type
            },

            success: function (res) {
                this.initData()
            }

        }, this)

    },



    onLoad: function () {
        console.log('onLoad')
        var that = this

        this.slidersInfo.page = this
        slider = require('../../utils/slider.js').init(this.slidersInfo)
        
    },

    onShow: function (options) {
        console.log('onShow')
        //切换页面时候需要重新初始化slider,因为require获取的是同一个对象
        slider.init(this.slidersInfo)
        this.initData()
    },

    /**
     * 下拉刷新
     */
    onPullDownRefresh: function () {
        this.initData()
    },

    initData: function () {
        APP.ajax({
            url: APP.globalData.BaseUrl + '/msg/chat',

            data: {
                token: wx.getStorageSync("token")
            },

            success: function (res) {
                this.data.datas = res.data.chats
                res.data.chats.forEach(function(v,i){
                    if (v.name =='邀请消息')
                        slider.setLayer(i, 1)
                    else
                        slider.setLayer(i, 0)
                })
                this.setData({
                    datas:res.data.chats
                })

                wx.stopPullDownRefresh()

            }
        }, this)
    },
})














