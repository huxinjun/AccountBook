var APP = getApp()
//我的
Page({
    data: {
    },

    onLoad: function (option) {
        wx.setNavigationBarTitle({
            title: option.name,
        })
        if (option.fileName!='null')
            this.initData(option.fileName)
        
    },

    /**
     * 获取帮助内容
     */
    initData: function (fileName) {
        console.log(fileName)
        APP.ajax({
            url: APP.globalData.BaseUrl + '/help/detail',

            data:{
                fileName: fileName
            },
        

            success: function (res) {
                this.setData({
                    nodes: res.data.content
                })
            }

        }, this)
    },
})
