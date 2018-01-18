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
        if(index!=undefined)
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
        var msg
        if (index != undefined)
            msg = this.data.msgs[index]
        else
            msg = this.data.msgs.findByAttr("accountId", e.target.dataset.acid)
        wx.navigateTo({
            url: '/pages/account/account?accountId=' + msg.accountId.encode()
        })
    },
    /**
     * 点击类型为[支付提醒]的消息
     */
    onPayMsgClick: function (e) {
        var index = e.target.dataset.index
        var msg = this.data.msgs[index]
    },


    onLoad: function (option) {
        console.log(APP.systemInfo)
        this.data.userId=option.userId.decode()
        this.data.msgs = []
        this.data.nextPageIndex = 0
        this.initSelfInfo()
    },

    onPageScroll:function(e){
        if (e.scrollTop==0){
            this.initData(false)
        }
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
                this.initData(true)
            }

        }, this)
    },

    
    /**
     * 初始化消息列表
     */
    initData: function (isFrist) {
        var that = this
        
        console.log("initData")

        if (isLoading)
            return

        if (!isFrist)
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
                    v.originId=v.id
                    v.id = v.originId.replaceAll("=", "").replaceAll("\\+", "");
                    //类型图标处理
                    if(v.msgType==31 || v.msgType==32)
                        v.typeIcon = APP.globalData.typeList.findByAttr("id", v.type).icon
                })
                var topId = isFrist ? null : "_" + this.data.msgs[0].id

                this.data.hasNextPage = res.data.hasNextPage
                this.data.nextPageIndex = res.data.hasNextPage ? res.data.pageIndex + 1 : 99999
                this.data.msgs.addAllToHead(res.data.msgs)
 
                if (res.data.msgs.length>0)
                    this.setData({
                        msgs:this.data.msgs,
                        
                    })
                isLoading = false


                //初次滚动到底部
                if (isFrist){
                    var bottomMsgId = "_" + this.data.msgs[this.data.msgs.length - 1].id
                    this.execAfterViewAttached(bottomMsgId,function(){
                        this.pageScrollToPosition(bottomMsgId, 'bottom')
                        isLoading = false
                    })
                }else{
                    this.execAfterViewAttached(topId, function () {
                        this.pageScrollToPosition(topId, 'top')
                        isLoading = false
                    })
                }
            }

        }, this)
    },

    execAfterViewAttached:function(id,success){
        var that = this
        wx.createSelectorQuery().select('#' + id).boundingClientRect(function (rect) {
            // console.log(id+"-----------"+rect)
            if (rect==null) {
                that.execAfterViewAttached(id, success)
                return
            }
            success.call(that)
            

        }).exec()
    },

    // 获取容器高度，使页面滚动到容器底部
    pageScrollToPosition: function (id,pos) {
        wx.createSelectorQuery().select('#' + id).boundingClientRect(function (rect) {
            // 使页面滚动到底部
            wx.pageScrollTo({
                scrollTop: pos =='bottom'?rect.bottom:rect.top
            })
        }).exec()
    }

})










