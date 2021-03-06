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
    coding:function(e){
        wx.showToast({
            title: '开发中...',
        })
    },

    /**
     * 统计数据
     */
    gotoHelp: function (e) {
        wx.navigateTo({
            url: '/pages/help/help',
        })
    },

    /**
     * 统计数据
     */
    gotoSummary: function (e) {
        wx.navigateTo({
            url: '/pages/summary/summary',
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

        this.initData()
        this.initNotifValidCount()
    },


    /**
     * 初始化账本今日数据
     */
    initData: function () {
        APP.ajax({
            url: APP.globalData.BaseUrl + '/summary/getToday',
            data: {
                token: wx.getStorageSync("token")
            },
            success: function (res) {
                this.setData({
                    todayPaidMoney:res.data.infos[0].number,
                    todayPaidCount: res.data.infos[0].count,
                })

                wx.stopPullDownRefresh()
            }

        }, this)
        
    },

    /**
     * 初始化提醒状态
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
