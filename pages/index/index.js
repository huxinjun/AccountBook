//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        motto: 'Hello World123',
        xinjun: 'hjuxinjun',
        tab_main_src: '/img/main_press.png',
        tab_me_src: '/img/me.png',
        currTab: 0,

        text_color_home: '#2BA245',
        text_color_me: '#272636',

        userInfo: {},


        list: [1, 2, 3],

        left:0,
        animationData:{},
        slideAnimData:null

    },

    test:function(e){
        var animation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease',
        })

        animation.scale(2, 2).rotate(45).step()

        this.setData({
            animationData: animation.export()
        })
        

        setTimeout(function () {
            var animation = wx.createAnimation({
                duration: 1000,
                timingFunction: 'ease',
            })
            // animation.scale(0, 0).rotate(-45).step()
            animation.translate(100).scale(2, 2).rotate(45).step()
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 1000)
    },




    onPullDownRefresh: function () {
        wx.stopPullDownRefresh()
        console.log("r");
        for (let i = 0; i < 6; i++) {
            this.data.list.push(this.data.list.length);
            console.log("push");
        }
        this.setData({
            list: this.data.list
        });
        wx.stopPullDownRefresh();
    },




    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },


    
    onLoad: function () {
        console.log('onLoad')
        var that = this
        
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        })

    },

    onTabMainSelected: function () {
        console.log("选择主页了")
    },
    onTabMeSelected: function () {
        console.log("选择我的了")
        wx.navigateTo({
            url: '/pages/find_friend/find_friend?id=nimade',
        })

    },

    tabMainClick: function () {

        if (this.data.currTab != 0) {
            this.setData({
                tab_main_src: '/img/main_press.png',
                tab_me_src: '/img/me.png',
                text_color_home: '#2BA245',
                text_color_me: '#272636'

            })
            this.data.currTab = 0;
            this.onTabMainSelected();
        }

    },

    tabMeClick: function () {

        if (this.data.currTab != 1) {
            this.setData({
                tab_main_src: '/img/main.png',
                tab_me_src: '/img/me_press.png',
                text_color_home: '#272636',
                text_color_me: '#2BA245'
            })
            this.data.currTab = 1;
            this.onTabMeSelected();
        }

    },

    

    startX: 0,
    preX: 0,
    touchstart:function(e){
        console.log(e)
        this.startX=e.touches[0].pageX;
        console.log(this.startX)
    },
    touchmove: function (e) {
        var currX = e.touches[0].pageX;
        var moveX = currX - this.startX;
        var deltaX = currX - this.preX;
        console.log(moveX + "--------" + deltaX)
        this.preX = currX;
        if (this.data.left<=-250 && deltaX<0){
          this.startX=currX+250;
          return
        }
        if (this.data.left >=0 && deltaX > 0) {
          this.startX = currX;
          return
        }

        moveX = moveX<-250?-250:moveX>0?0:moveX;
        this.setData({
            left:moveX
        })

        
    },
    touchend: function (e) {
        console.log(e)
    },
    touchcancel:function(e){
      console.log(e)
    }

})

