var APP = getApp()
//我的
Page({
    data: {
        formIds: [],
        notifValidCount:'0条'
    },

    gotoNotificationSetting:function(e){
        wx.navigateTo({
            url: '/pages/notification/notification',
        })
    },

    onLoad: function () {

    },
    onShow: function () {
        this.onPullDownRefresh()
    },

    /**
     * 下拉刷新
     */
    onPullDownRefresh: function () {

        // this.initData()
        this.initNotifValidCount()
    },


    /**
     * 初始化数据
     */
    initData: function () {
        APP.ajax({
            url: APP.globalData.BaseUrl + '/user/getSelfSimple',
            data: {
                token: wx.getStorageSync("token")
            },
            success: function (res) {
                wx.stopPullDownRefresh()
            }

        }, this)
        
    },

    /**
     * 初始化数据
     */
    initNotifValidCount: function () {
        APP.ajax({
            url: APP.globalData.BaseUrl + '/notif/getValidCount',
            data: {
                token: wx.getStorageSync("token")
            },
            success: function (res) {
                var count=res.data.count
                if (count==-1)
                    this.setData({
                        notifValidCount:"未开启"
                    })
                else
                    this.setData({
                        notifValidCount: count+"条"
                    })

                wx.stopPullDownRefresh()
            }

        }, this)

    }
})
