
var APP = getApp()

Page({
    data: {
        confirm_txt:'search',
        text:'搜索结果',
        search_txt:'新军',

        searchResulr:null

    },

    onLoad: function (option) {
        console.log('onLoad' + option)
        var that = this


    },

    intputCompleted:function(e){
        this.setData({
            search_txt: e.detail.value
        })
        this.search();
    },

    search:function(){
        var that=this;
        wx.request({
            url: APP.globalData.BaseUrl +'/user/search',
            data: {
                name: that.data.search_txt,
                token: APP.globalData.token
            },
            
            success: function(res) {
                
                if (res.data.status == 0){
                    console.log(res.data);
                }
            }
        })
    }


})
