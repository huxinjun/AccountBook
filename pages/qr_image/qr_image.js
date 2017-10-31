
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
        var data={}
        if (option.groupId)
            data.groupId = option.groupId.decode()
        else
            data.userId = option.userId.decode()
        data.token = wx.getStorageSync("token")
        APP.ajax({
            url: APP.globalData.BaseUrl + urlPattener,
            data: data,

            success: function (res) {
                if (res.data.status == APP.globalData.resultcode.SUCCESS)
                    this.setData({
                        qrImageUrl: res.data.msg
                    })
            }


        }, this)
    },

})














