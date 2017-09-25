
//获取应用实例
var APP = getApp()
Page({
    data: {
        containerHeight:APP.systemInfo.windowHeight,
        
    },
    
    onLoad: function (option) {
        wx.setNavigationBarTitle({
            title: option.title,
        })
        this.pullQrImage(option)

    },

    /**
     * 获取二维码
     */
    pullQrImage: function (option) {
        var urlPattener = "/" + (option.groupId ?"group":"user") +"/qr"
        APP.ajax({
            url: APP.globalData.BaseUrl + urlPattener,
            data: {
                groupId: option.groupId,
                token: wx.getStorageSync("token")
            },

            success: function (res) {
                if (res.data.status == APP.globalData.resultcode.SUCCESS)
                    this.setData({
                        qrImageUrl: APP.getImageUrl(res.data.msg)
                    })
            }


        }, this)
    },

})














