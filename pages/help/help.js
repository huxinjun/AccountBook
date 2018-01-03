var APP = getApp()
//帮助
Page({
    data: {
    },

    gotoDetail:function(e){
        var index = e.target.dataset.index
        var item=this.data.items[index]
        console.log(item)
        wx.navigateTo({
            url: '/pages/help_detail/help_detail?name='+item.name+"&fileName="+item.fileName,
        })

    },

    onLoad: function () {
        this.initData()
    },



    /**
     * 获取帮助列表
     */
    initData: function () {
        APP.ajax({
            url: APP.globalData.BaseUrl + '/help/list',

            success: function (res) {
                this.setData({
                    items:res.data.list
                })
            }

        }, this)
    },
})
