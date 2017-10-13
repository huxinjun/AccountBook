var APP = getApp()
var dialog = require("../../utils/dialog.js")
var util = require('../../utils/util.js')
Page({
    data: {
        containerHeight: APP.systemInfo.windowHeight

    },

    onLoad: function (option) {
        this.initAccounts()
    },

    /**
     * 初始化账目列表数据
     */     
    initAccounts:function(){
        APP.ajax({
            url: APP.globalData.BaseUrl + '/account/get',
            data: {
                token: wx.getStorageSync("token")
            },

            success: function (res) {
                this.setData({
                    accounts: res.data.accounts
                })

                console.log(res.data.accounts)
            }

        }, this)
    }

})










