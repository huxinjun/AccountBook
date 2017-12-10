var APP = getApp()
Page({
    data: {
        formIds:[],
        isOpen:false
    },

    /**
     * 开关被切换了
     */
    onSwitchChanged:function(e){
        this.data.isOpen = e.detail.value
        APP.ajax({
            url: APP.globalData.BaseUrl + '/notif/' + (this.data.isOpen ? "open" : "close"),
            data: {
                token: wx.getStorageSync("token")
            },
            success: function (res) {
                this.initData()
            }

        }, this)
    },

    /**
     * 添加formid到数组
     */
    onAddFormId: function (e) {
        if(!this.data.isOpen)
            return
        var formId = e.detail.formId
        this.data.formIds.append(formId)
        this.setData({
            formIds: this.data.formIds,
            notifValidCount: (this.data.formIds.length + this.data.count)+'条',
        })
    },

    onLoad: function () {
        this.initData()
    },
    onUnload: function () {
        this.uploadFormIds()
    },


    /**
     * 查询自己的提醒消息数,未开启时返回-1
     */
    initData: function () {
        APP.ajax({
            url: APP.globalData.BaseUrl + '/notif/getValidCount',
            data: {
                token: wx.getStorageSync("token")
            },
            success: function (res) {
                var count = res.data.count
                if (count == -1)
                    this.setData({
                        notifValidCount: "未开启",
                        isOpen:false
                    })
                else
                    this.setData({
                        count: count,
                        notifValidCount: (this.data.formIds.length + count) + "条",
                        isOpen:true
                    })
            }

        }, this)

    },


    /**
     * 上传获取的formIds
     */
    uploadFormIds:function(){
        if (!this.data.isOpen)
            return
        if(this.data.formIds.length==0)
            return
        APP.ajax({
            url: APP.globalData.BaseUrl + '/notif/addAll',
            //注意:post必须加这个header才能解析出body中的参数
            method:'POST',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            }, 
            data: {
                token: wx.getStorageSync("token"),
                formIds: JSON.stringify(this.data.formIds)
            },
            success: function (res) {
            }

        }, this)
    }
})
