//index.js
//获取应用实例
var slider
var APP = getApp()
Page({
    data: {
        containerHeight: APP.systemInfo.windowHeight

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
    },

    initData: function () {
        APP.ajax({
            url: APP.globalData.BaseUrl + '/group/getAll',

            data: {
                token: wx.getStorageSync("token")
            },

            success: function (res) {
                this.setData({
                    groups: res.data.groups
                })
                wx.stopPullDownRefresh()

            }
        }, this)
    },



    gotoAddGroup:function(e){
        var groupId = e.target.dataset.id
        var idParam = groupId ? "&groupId="+groupId.encode():""
        wx.navigateTo({
            url: '/pages/group_edit/group_edit?' + idParam,
        })
    }
})














