//index.js
//获取应用实例
var slider= require('../../utils/slider.js')
var APP = getApp()
Page({
    data: {
        containerHeight: APP.systemInfo.windowHeight

    },

    onFriendClick:function(e){
        var index = e.target.dataset.index
        var friend = this.data.friends[index]

        wx.navigateTo({
            url: '/pages/accounts_2p/accounts_2p?userId=' + friend.id.encode()
        })

    },
    
    onLoad: function () {
        var that = this
        this.onPullDownRefresh()
    },

    /**
     * 下拉刷新
     */
    onPullDownRefresh: function () {
        this.initData()
        this.initSelfInfo()
    },

    onShow: function (options) {
        
    },

    initData: function () {
        APP.ajax({
            url: APP.globalData.BaseUrl + '/friend/getAll',

            data: {
                token: wx.getStorageSync("token")
            },

            success: function (res) {
                this.setData({
                    friends:res.data.friends
                })
            }
        }, this)
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
                wx.stopPullDownRefresh()
            }

        }, this)
    },



    gotoAddFriend:function(e){
        wx.navigateTo({
            url: '/pages/qr_image/qr_image?title=扫码加我&userId=' + this.data.userInfo.id.encode(),
        })
    },
    gotoGroup: function (e) {
        wx.navigateTo({
            url: '/pages/group/group',
        })
    }

})














