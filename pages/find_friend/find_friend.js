
var APP = getApp()

Page({
    data: {
        confirm_txt:'search',
        text:'搜索结果',
        search_txt:'新军',

        users:null

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
        APP.ajax({
          url: APP.globalData.BaseUrl +'/user/search',
            
            data: {
              nickname: this.data.search_txt,
              token: APP.globalData.token
            },
            
            success: function(res) {
                if (res.data.status == 0){
                  res.data.users.forEach(function(v,i){
                    if(v.gender==0)
                      v.genderPath="/img/girl.png"
                    else
                      v.genderPath = "/img/boy.png"
                  })
                    this.setData({
                      users : res.data.users
                    })
                    
                }
            }
        },this)
    }


})
