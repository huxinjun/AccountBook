
var app = getApp()

Page({
    data: {
        confirm_txt:'search',
        text:'搜索结果',
        search_txt:'新军'

    },

    onLoad: function (option,haha) {
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
        console.log('搜索' + this.data.search_txt);
    }


})
