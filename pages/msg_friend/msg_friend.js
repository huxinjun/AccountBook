var APP = getApp()
var dialog = require("../../utils/dialog.js")
var util = require('../../utils/util.js')
Page({
    data: {
        containerHeight: APP.systemInfo.windowHeight
    },




    onLoad: function (option) {
        var that = this
        this.initData()

    },

    /**
     * 初始化消息列表
     */
    initData: function () {
        APP.ajax({
            url: APP.globalData.BaseUrl + '/msg/user',
            data: {
                token: wx.getStorageSync("token"),
                userId:"oCBrx0FreB-L8pIQM5_RYDGoWOJJ"
            },
            success: function (res) {
                this.setData({
                    msgs: res.data.datas
                })
            }

        }, this)
    }

})










