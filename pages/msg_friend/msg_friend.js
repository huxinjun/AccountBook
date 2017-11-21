var APP = getApp()
var dialog = require("../../utils/dialog.js")
var util = require('../../utils/util.js')
var isLoading = false
Page({
    data: {
        containerHeight: APP.systemInfo.screenHeight,
        msgs:[],
        nextPageIndex:0,
        userId:null
    },

    /**
     * 点击用户头像
     */
    onUserIconClick:function(e){
        var index = e.target.dataset.index
        var msg = this.data.msgs[index]
    },
    /**
     * 点击类型为[新账单]的消息
     */
    onNewAccountMsgClick: function (e) {
        var index = e.target.dataset.index
        var msg
        if(index)
            msg = this.data.msgs[index]
        else
            msg = this.data.msgs.findByAttr("accountId", e.target.dataset.acid)
        wx.navigateTo({
            url: '/pages/account/account?accountId=' + msg.accountId.encode()
        })
    },
    /**
     * 点击类型为[组内账单]的消息
     */
    onGroupAccountClick: function (e) {
        var index = e.target.dataset.index
        var msg = this.data.msgs[index]
    },
    /**
     * 点击类型为[支付提醒]的消息
     */
    onPayMsgClick: function (e) {
        var index = e.target.dataset.index
        var msg = this.data.msgs[index]
    },


    onLoad: function (option) {
        this.data.userId=option.userId.decode()
    },

    onShow: function () {
        this.data.msgs=[]
        this.data.nextPageIndex=0
        this.initSelfInfo()

    },

    /**
     * 初始化和自己的信息:id,name,icon
     */
    initSelfInfo: function () {
        APP.ajax({
            url: APP.globalData.BaseUrl + '/user/getSelfSimple',
            data: {
                token: wx.getStorageSync("token")
            },
            success: function (res) {
                this.setData({
                    userInfo: res.data
                })
                this.initData()
            }

        }, this)
    },

    
    /**
     * 初始化消息列表
     */
    initData: function (e) {
        var that = this
        
        console.log("initData")

        if (isLoading)
            return

        if (e)
            if (!this.data.hasNextPage)
                return
            
        
        

        isLoading=true
        APP.ajax({
            url: APP.globalData.BaseUrl + '/msg/user',
            data: {
                token: wx.getStorageSync("token"),
                userId: this.data.userId,
                pageIndex: this.data.nextPageIndex
            },
            success: function (res) {

                res.data.msgs.forEach(function (v, i) {
                    v.style = {
                        align:"justify-content:" + (that.data.userInfo.id == v.toId ? "flex-start" :"flex-end")+";"
                    }
                    v.value = {}
                    //类型图标处理
                    if(v.msgType==31 || v.msgType==32)
                        v.typeIcon = APP.globalData.typeList.findByAttr("id", v.type).icon
                })
                this.data.hasNextPage = res.data.hasNextPage
                this.data.nextPageIndex = res.data.hasNextPage ? res.data.pageIndex + 1 : 99999
                this.data.msgs.addAllToHead(res.data.msgs)

                if (res.data.msgs.length>0)
                    this.setData({
                        msgs:this.data.msgs,
                        
                    })
                if (this.data.nextPageIndex==1)
                    this.setData({
                        bottomMsgId: "_" + this.data.msgs[this.data.msgs.length - 1].id
                    })

                isLoading=false
                
            }

        }, this)
    }

})










