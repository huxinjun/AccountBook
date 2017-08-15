
var APP = getApp()

Page({
    data: {
        confirm_txt:'search',
        text:'搜索结果',
        search_txt:'新军',

        datas:null

    },

    searchValueChanged:function(e){
      console.log(e)
      this.setData({
        search_txt:e.detail.value
      })
    },

    /**
     * 邀请用户
     */
    invite: function (e) {
        wx.login({
            success: function (res) {
                APP.ajax({
                    url: APP.globalData.BaseUrl + "/user/invite",
                    data: {
                        formId:e.detail.formId,
                        token: wx.getStorageSync('token'),
                        code: res.code,
                        openid: "oCBrx0FreB-L8pIQM5_RYDGoWOKQ"
                    },
                    success: function (res) {
                        
                    }

                }, this)
            }
        })

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
              token: wx.getStorageSync("token")
            },
            
            success: function(res) {
                if (res.data.status == APP.globalData.resultcode.SUCCESS){
                    res.data.datas.forEach(function(v,i){
                    if(v.gender==0)
                      v.genderPath="/img/girl.png"
                    else
                      v.genderPath = "/img/boy.png"
                  })
                    this.setData({
                        datas: res.data.datas
                    })
                    
                }
                    
            }
        },this)
    }


})
