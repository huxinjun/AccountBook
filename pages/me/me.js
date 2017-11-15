
//我的
Page({
    data: {
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
})
