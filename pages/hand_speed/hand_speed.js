var startTime
var isEnd
var endLength
//我的
Page({
    data: {
        formIds:[]
    },


    onButtonClick:function(e){
        var formId = e.detail.formId
        this.data.formIds.append(formId)

        if (startTime==undefined)
            startTime = Date.parse(new Date());
        else{
            var now = Date.parse(new Date())
            if(now-startTime>15000){
                if (!isEnd)
                    endLength = this.data.formIds.length
                isEnd=true
                this.setData({
                    speed: (endLength / 15).toFixed(2),
                    timeleft: "0"
                })
                console.log("统计结束:" + formId)
            }else{
                this.setData({
                    speed: (this.data.formIds.length / ((now - startTime) / 1000)).toFixed(2),
                    timeleft: (15 - (now - startTime) / 1000).toFixed(0)
                })
            }

        }
        // console.log("formId:"+formId)
    },

    onLoad: function () {

    },
    onShow: function () {
        this.onPullDownRefresh()
    },
    onUnload: function () {
        console.log("onUnload:" )
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


    /**
     * 上传获取的formIds
     */
    uploadFormIds:function(){
        APP.ajax({
            url: APP.globalData.BaseUrl + '/form/add',
            data: {
                token: wx.getStorageSync("token")
            },
            success: function (res) {
            }

        }, this)
    }
})
