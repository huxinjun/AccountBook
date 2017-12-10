
//我的
Page({
    data: {
    },

    gotoHandSpeed:function(e){
        wx.navigateTo({
            url: '/pages/hand_speed/hand_speed',
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
