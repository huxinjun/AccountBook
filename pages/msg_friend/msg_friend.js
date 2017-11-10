var APP = getApp()
var dialog = require("../../utils/dialog.js")
var util = require('../../utils/util.js')
var isLoading = false
Page({
    data: {
        containerHeight: APP.systemInfo.windowHeight,
        msgs:[],
        nextPageIndex:0
    },


    onLoad: function (option) {
        

    },

    onShow: function () {

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
                userId:"oCBrx0FreB-L8pIQM5_RYDGoWOJJ",
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
                this.data.nextPageIndex = res.data.hasNextPage ? res.data.pageIndex + 1 : res.data.pageIndex
                this.data.msgs.addAllToHead(res.data.msgs)

                if (res.data.msgs.length>0)
                    this.setData({
                        msgs:this.data.msgs,
                        bottomMsgId: "_"+this.data.msgs[this.data.msgs.length-1].id
                    })

                isLoading=false
                
            }

        }, this)
    }

})










